"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * Trading conditions — replaces the old `MetricsStrip`, and sits under Markets.
 *
 * The strip rendered the same five numbers as hairline-separated columns. That
 * was right when it sat directly under the hero and had to stay quiet; as a
 * section in its own right it read as a footer that had drifted up the page.
 * These are the five things somebody actually compares between brokers, so
 * they get room to be compared — and they sit under Markets rather than under
 * the hero, because the numbers land better once the reader knows what is
 * being traded.
 *
 * ── Geometry, measured off the reference rather than guessed ──────────────
 *
 * `ref/image.png` (XTB's "Choose your way to understand the market") was
 * measured directly: the card is 711 × 314 in an 869-wide frame. That is
 * **82% of the frame width at a 2.26:1 aspect**, with the art occupying ~44%
 * of the card's width and ~91% of its height, and the next card peeking in at
 * the right edge. Those three numbers are what make it read as a big card.
 *
 * The first attempt here used `(100%-2rem)/2.4` — a 41% card with 240px art,
 * less than half the reference in both dimensions, which is why it looked
 * like a tile rather than a panel. **If this is ever re-tuned, keep the card
 * at ~82% and the art above 360px.** The size *is* the design; shrink either
 * and it stops being this section.
 *
 * ── The platinum palette ──────────────────────────────────────────────────
 *
 * Every card shares the same platinum surface so the artwork and numbers do
 * the differentiating. A single highlight crosses a card when it becomes
 * active or is hovered; it never loops, and it is removed under reduced
 * motion.
 *
 * ── The cursor ────────────────────────────────────────────────────────────
 *
 * Scroll-snap does the actual paging, so the track stays a plain scrollable
 * region: trackpad, swipe, scrollbar and keyboard all work whether or not the
 * JS below ever runs. The cursor is a control over that, not a replacement.
 */
const CONDITIONS = [
  {
    id: "leverage",
    label: "Max leverage",
    figure: "1:2000",
    copy: "Control a position up to two thousand times your margin, on eligible instruments.",
    image: "/assets/2nd_section/image1.webp",
    alt: "A balance scale weighing stacked coins against a rising chart",
  },
  {
    id: "spreads",
    label: "Spreads from",
    figure: "0.1 pips",
    copy: "Variable pricing that tracks the underlying market instead of a fixed markup.",
    image: "/assets/2nd_section/image2.webp",
    alt: "A precision caliper measuring a narrow illuminated gap",
  },
  {
    id: "instruments",
    label: "Tradable instruments",
    figure: "150+",
    copy: "Forex, indices, crypto, shares, metals and energy — one balance, one margin pool.",
    image: "/assets/2nd_section/image3.webp",
    alt: "Gold bars, a currency panel, a candlestick chart, an oil barrel, a globe and a Bitcoin coin",
  },
  {
    id: "execution",
    label: "Average execution",
    figure: "~20ms",
    copy: "From the click to the confirmation, measured across our own bridge.",
    image: "/assets/2nd_section/image4.webp",
    alt: "A stopwatch trailing motion streaks",
  },
  {
    id: "support",
    label: "Dedicated support",
    figure: "24/6",
    copy: "A real person from the Sydney open to the New York close, every trading day.",
    image: "/assets/2nd_section/image5.webp",
    alt: "A support headset behind a shield with a message bubble",
  },
];

/** How long a card holds before the cursor advances. */
const DWELL_MS = 2000;

export function Conditions() {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /**
   * Where the run is *heading*, which is not the same thing as `active`.
   *
   * At a 2s dwell a smooth scroll is often still in flight when the next
   * tick fires, and the wrap from the last card back to the first crosses
   * every card in between — so the observer reports 3, 2, 1 on the way home.
   * If the timer advanced from whatever the observer last saw, the run would
   * reverse itself mid-wrap. It advances from this instead, so the sequence
   * is always 0→1→2→3→4→0 regardless of what the scroller is doing.
   */
  const targetRef = useRef(0);
  /** True once the scroller has actually arrived at `targetRef`. */
  const settledRef = useRef(true);

  const goTo = useCallback(
    (i, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.children[i];
      if (!card) return;
      targetRef.current = i;
      settledRef.current = false;
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: smooth && !reduced ? "smooth" : "auto",
      });
    },
    [reduced]
  );

  // Scroll position is the source of truth for which card is *shown*, so a
  // manual swipe and an automatic advance move the cursor through the same
  // path and can never disagree. A card seen while the run is already
  // settled can only have come from the reader, so it also becomes the new
  // point the timer counts on from.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Array.prototype.indexOf.call(track.children, entry.target);
          if (i < 0) continue;
          setActive(i);
          if (i === targetRef.current) settledRef.current = true;
          else if (settledRef.current) targetRef.current = i;
        }
      },
      { root: track, threshold: 0.55 }
    );

    for (const child of track.children) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  // Auto-advance, wrapping past the last card back to the first. Never runs
  // under reduced motion — a carousel that moves on its own is exactly what
  // that setting is asking us not to do.
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => {
      const next = (targetRef.current + 1) % CONDITIONS.length;
      goTo(next);
      setActive(next);
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [reduced, paused, goTo]);

  const hold = () => setPaused(true);
  const release = () => setPaused(false);

  return (
    <Section
      id="conditions"
      title="Every number that moves your P&L."
      lead="Leverage, spread, breadth, speed and support. These are the five things worth comparing before you open an account anywhere — so here they are, with nothing rounded in our favour."
    >
      <div
        onMouseEnter={hold}
        onMouseLeave={release}
        onFocusCapture={hold}
        onBlurCapture={release}
        onTouchStart={hold}
      >
        {/* The negative margin lets a card bleed to the viewport edge on small
            screens while the padding keeps the first one aligned to the grid. */}
        <div
          ref={trackRef}
          role="group"
          aria-label="Trading conditions"
          tabIndex={0}
          className={cn(
            "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          )}
        >
          {CONDITIONS.map((c, i) => (
            <article
              key={c.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${CONDITIONS.length}: ${c.label} ${c.figure}`}
              className={cn(
                "group/card condition-metal condition-platinum relative isolate shrink-0 snap-start overflow-hidden rounded-[28px]",
                // 82% on desktop is the reference proportion, and it is what
                // leaves the next card peeking at the right edge.
                "w-[88vw] sm:w-[74vw] lg:w-[82%]"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-y-0 -left-[45%] z-0 w-[38%]",
                  "skew-x-[-14deg] bg-gradient-to-r from-transparent via-white/45 to-transparent",
                  "transition-transform duration-700 ease-out motion-reduce:hidden",
                  i === active
                    ? "translate-x-[430%] group-hover/card:translate-x-[215%]"
                    : "group-hover/card:translate-x-[215%]"
                )}
              />
              <div
                className={cn(
                  "relative z-10 flex flex-col gap-8 p-8 sm:p-10",
                  "lg:min-h-[440px] lg:flex-row lg:items-stretch lg:gap-12 lg:p-14"
                )}
              >
                <div className="flex flex-col lg:w-[46%] lg:shrink-0">
                  {/* The index is the same number the cursor below is
                      counting, printed on the card so a reader who lands
                      mid-run knows where in the five they are without
                      looking away from it. */}
                  <div className="flex items-center gap-3">
                    <span className="tnum text-[12.5px] leading-none font-bold tracking-[0.06em] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
                    <span className="text-[12.5px] leading-none font-semibold tracking-[0.07em] text-ink/70 uppercase">
                      {c.label}
                    </span>
                  </div>

                  {/* Centred in whatever the index row leaves, so the number sits
                      on the card’s optical middle rather than in its bottom
                      corner. */}
                  <div className="my-auto pt-10 lg:pt-8">
                    <p className="tnum text-[clamp(44px,5.4vw,68px)] leading-[0.95] font-bold tracking-[-0.04em] text-ink">
                      {c.figure}
                    </p>
                    <p className="mt-5 max-w-[30rem] text-[15.5px] leading-relaxed text-ink/75">
                      {c.copy}
                    </p>
                  </div>
                </div>

                {/* The render is the card's whole visual argument, so it gets
                    the larger half of the space. Below 360px it stops reading
                    as product art and starts reading as an icon. */}
                <div className="mx-auto flex w-[64%] max-w-[300px] items-center lg:mx-0 lg:w-auto lg:max-w-none lg:flex-1">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    width={620}
                    height={620}
                    sizes="(max-width: 1024px) 64vw, 400px"
                    className="mx-auto h-auto w-full drop-shadow-[0_26px_40px_rgba(0,0,0,0.45)] lg:max-w-[400px]"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* The cursor, in numbers.
 
            Five dots said "five equal options". These are five *steps*, taken
            in order, and the number is what makes that legible: the one you
            are on is inked and carries the dwell meter, the ones behind it
            stay solid because you have seen them, the ones ahead are light.
            The pair at the right prints the same thing as a fraction, which
            is the form a reader can take in without counting.
 
            The meter is keyed on `active`, so it remounts and restarts on
            every advance; `paused` freezes it in place with the run rather
            than resetting it, so hovering holds the card *and* its clock. */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-2 shadow-sm">
            {CONDITIONS.map((c, i) => {
              const on = i === active;
              const seen = i < active;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Show ${c.label}`}
                  aria-current={on ? "true" : undefined}
                  onClick={() => {
                    setActive(i);
                    goTo(i);
                  }}
                  className="group relative rounded-full px-2.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span
                    className={cn(
                      "tnum block text-[13px] leading-none font-bold tabular-nums transition-colors duration-300",
                      on
                        ? "text-ink"
                        : seen
                          ? "text-muted group-hover:text-ink"
                          : "text-line-strong group-hover:text-muted"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* The dwell meter. Only under the active number, and only
                      when the run is actually running. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-1.5 bottom-0 block h-[2px] overflow-hidden rounded-full"
                  >
                    {on && !reduced && (
                      <span
                        key={active}
                        style={{
                          "--dwell": `${DWELL_MS}ms`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                        className="dwell-fill block h-full w-full rounded-full bg-brand"
                      />
                    )}
                  </span>
                </button>
              );
            })}

            <span
              aria-hidden="true"
              className="mx-1 h-4 w-px shrink-0 bg-line"
            />

            <span className="tnum pr-1.5 pl-1 text-[12px] leading-none font-semibold tabular-nums text-muted">
              <span className="text-ink">{String(active + 1).padStart(2, "0")}</span>
              {" / "}
              {String(CONDITIONS.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

    </Section>
  );
}
