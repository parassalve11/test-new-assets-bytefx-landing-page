"""Turn a "transparent background" stock clip into a real alpha WebM.

    python scripts/key-checkerboard.py media-source/forex_coins_source.mp4 \
        public/assets/forex_coins.webm

This exists because the supplied coin clip is not actually transparent: it is
an H.264 file with the editor's transparency checkerboard *rendered into the
pixels*, two flat greys in ~26px squares. Dropping it on a card would show the
board, and a plain luma key cannot lift it — the coins are silver, so their
own mid-greys land on the board's greys and the key eats holes through them.

The pass therefore has three stages:

1. **Learn the board.** Every pixel is sampled across every frame; the frames
   where it is neutral and in the board's narrow luminance window vote on what
   the board looks like *there*. That gives a per-pixel plate that already
   accounts for the clip's vignette and its compression noise. A pixel that is
   never board — permanently under a coin — is simply marked opaque, which is
   the right answer for it in every frame.

2. **Key against that plate, then repair.** A per-pixel difference gives a
   crisp matte with holes. Grey-scale closing fills the notches bitten out of
   the coin rims; hole-filling closes the ones bitten out of the faces.

3. **Demodulate.** The real discriminator: an empty pixel still carries the
   board's +/- swing, and nothing the coins cover does. Correlating each frame
   against the board's own pattern over a one-square window separates a dark
   coin face from genuine emptiness in a way no per-pixel test can. It is soft
   by half a window, so it is eroded back and used only to *add* opacity
   inside the silhouette the crisp matte already found.

Finally the keyed colour is bled outward into the dead area (so no board tone
can creep back into an edge the decoder softens, and so the plane compresses)
and the sequence is handed to libvpx-vp9 as `yuva420p`.

Needs numpy, opencv-python, scipy, Pillow, and ffmpeg on PATH (or the
`ffmpeg-static` dev dependency, which this script will find on its own).
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

# The board's luminance window and how neutral it has to be to count as board.
BOARD_LO, BOARD_HI, BOARD_SPREAD = 64, 102, 7
# How many frames must see board at a pixel before we trust the estimate.
MIN_BOARD_VOTES = 6
# Difference, in 8-bit levels, that ramps a pixel from clear to fully opaque.
KEY_LO, KEY_HI = 7.0, 24.0
# One board square, give or take — the demodulation window.
SQUARE = 27


def ffmpeg() -> str:
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:
        out = subprocess.run(
            ["node", "-p", "require('ffmpeg-static')"],
            capture_output=True, text=True, check=True,
        )
        return out.stdout.strip()
    except Exception:  # noqa: BLE001 - any failure here means "no ffmpeg"
        sys.exit("ffmpeg not found: install it, or `npm i -D ffmpeg-static`.")


def probe_fps(exe: str, src: Path) -> str:
    out = subprocess.run([exe, "-hide_banner", "-i", str(src)], capture_output=True, text=True)
    for line in out.stderr.splitlines():
        if " fps," in line:
            return line.split(" fps,")[0].split()[-1]
    return "24"


def learn_board(frames: list[Path]) -> tuple[np.ndarray, np.ndarray]:
    """Per-pixel board plate, plus the mask of pixels that ever showed board."""
    stack = None
    for i, f in enumerate(frames):
        a = np.array(Image.open(f).convert("RGB"), np.uint8)
        if stack is None:
            stack = np.empty((len(frames), *a.shape), np.uint8)
        stack[i] = a

    gray = stack.mean(axis=3)
    spread = stack.max(axis=3).astype(np.int16) - stack.min(axis=3).astype(np.int16)
    votes = (gray >= BOARD_LO) & (gray <= BOARD_HI) & (spread <= BOARD_SPREAD)
    known = votes.sum(axis=0) >= MIN_BOARD_VOTES

    with np.errstate(invalid="ignore"):
        board = np.nanmedian(np.where(votes, gray, np.nan), axis=0)
    return np.where(known, board, 80.0).astype(np.float32), known


def key_frames(frames: list[Path], board: np.ndarray, known: np.ndarray, out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    smooth = cv2.boxFilter(board, -1, (SQUARE * 2 + 1, SQUARE * 2 + 1))
    pattern = board - smooth
    amplitude = np.maximum(
        np.abs(cv2.boxFilter(pattern * np.sign(pattern), -1, (SQUARE, SQUARE))), 2.5
    )
    sign = np.sign(pattern)
    board3 = np.repeat(board[:, :, None], 3, 2)
    k15 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    k21 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21))

    for i, f in enumerate(frames):
        frame = np.array(Image.open(f).convert("RGB"), np.float32)
        diff = np.abs(frame - board3).max(2)

        alpha = np.clip((diff - KEY_LO) / (KEY_HI - KEY_LO), 0, 1)
        alpha = cv2.medianBlur((alpha * 255).astype(np.uint8), 3).astype(np.float32) / 255.0
        alpha[~known] = 1.0
        alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, k15)

        swing = cv2.boxFilter((frame.mean(2) - smooth) * sign, -1, (SQUARE, SQUARE)) / amplitude
        solid = cv2.morphologyEx((np.abs(swing - 1.0) > 0.7).astype(np.uint8), cv2.MORPH_CLOSE, k15)
        solid = ndimage.binary_fill_holes(solid.astype(bool))
        solid = cv2.erode(solid.astype(np.uint8), k21).astype(bool)
        # Only where the plate is genuinely high-contrast: the faint sparkles
        # are meant to stay semi-transparent, not to snap to solid.
        strong = cv2.dilate((diff > 45).astype(np.uint8), k21).astype(bool)
        alpha = np.maximum(alpha, (solid & strong).astype(np.float32))
        alpha = np.where(ndimage.binary_fill_holes(alpha > 0.55), 1.0, alpha)

        label, n = ndimage.label(alpha > 0.12)
        if n:
            sizes = ndimage.sum(np.ones_like(label), label, range(1, n + 1))
            alpha[~np.isin(label, np.nonzero(sizes >= 40)[0] + 1)] = 0.0

        alpha = np.clip(cv2.GaussianBlur(alpha, (0, 0), 0.7), 0, 1)

        a3 = alpha[:, :, None]
        fg = np.clip(
            np.where(a3 > 0.02, (frame - (1 - a3) * board3) / np.maximum(a3, 0.02), frame), 0, 255
        )
        fg = bleed(fg, alpha)
        Image.fromarray(np.dstack([fg, alpha * 255.0]).astype(np.uint8), "RGBA").save(
            out / f"{i + 1:05d}.png"
        )


def bleed(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Push the keyed colour out into the dead area, widening ring by ring."""
    known = (alpha > 0.02).astype(np.float32)
    cur = rgb * known[:, :, None]
    for k in (9, 25, 61):
        den = cv2.boxFilter(known, -1, (k, k))
        avg = cv2.boxFilter(cur, -1, (k, k)) / np.maximum(den, 1e-4)[:, :, None]
        reached = (den > 1e-4).astype(np.float32)
        cur = np.where(known[:, :, None] > 0.5, cur, avg * reached[:, :, None])
        known = np.maximum(known, reached)
    return np.where(known[:, :, None] > 0.5, cur, 190.0)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("source")
    ap.add_argument("output")
    ap.add_argument("--crf", type=int, default=42)
    ap.add_argument("--crop", default="", help="ffmpeg crop, e.g. 1088:720:100:0")
    ap.add_argument("--scale", default="816:540")
    ap.add_argument("--poster", default="", help="write frame one as a transparent WebP here")
    args = ap.parse_args()

    exe = ffmpeg()
    src = Path(args.source)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        seq, keyed = tmp / "seq", tmp / "keyed"
        seq.mkdir()
        subprocess.run(
            [exe, "-hide_banner", "-loglevel", "error", "-i", str(src), "-an", str(seq / "%05d.png")],
            check=True,
        )
        frames = sorted(seq.glob("*.png"))
        print(f"{len(frames)} frames", flush=True)

        board, known = learn_board(frames)
        print(f"board learnt, {int((~known).sum())} always-covered pixels", flush=True)
        key_frames(frames, board, known, keyed)
        print("keyed", flush=True)

        chain = [c for c in (f"crop={args.crop}" if args.crop else "", f"scale={args.scale}:flags=lanczos") if c]
        chain.append("format=yuva420p")
        subprocess.run(
            [exe, "-hide_banner", "-loglevel", "error", "-y",
             "-framerate", probe_fps(exe, src), "-i", str(keyed / "%05d.png"),
             "-vf", ",".join(chain),
             # auto-alt-ref must be off or libvpx drops the alpha stream.
             "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", str(args.crf),
             "-row-mt", "1", "-deadline", "good", "-cpu-used", "1",
             "-auto-alt-ref", "0", "-an", args.output],
            check=True,
        )
        print(f"wrote {args.output} ({Path(args.output).stat().st_size / 1048576:.2f} MB)")

        if args.poster:
            first = Image.open(sorted(keyed.glob("*.png"))[0]).convert("RGBA")
            if args.crop:
                w, h, x, y = (int(v) for v in args.crop.split(":"))
                first = first.crop((x, y, x + w, y + h))
            w, h = (int(v) for v in args.scale.split(":"))
            first.resize((w, h), Image.LANCZOS).save(args.poster, quality=82, method=6)
            print(f"wrote {args.poster}")


if __name__ == "__main__":
    main()
