"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

/**
 * TEMPORARY — VIDEO HERO TEST. Not the shipping hero.
 *
 * A four-slide video carousel built from the supplied artboard animations, with
 * the fpmarkets.com hero as the structural reference. The real hero is
 * `components/site/Hero.jsx` — untouched, still in the codebase. To revert,
 * swap the two lines in app/page.jsx back.
 *
 * WHAT WAS TAKEN FROM THE REFERENCE (structure, not styling)
 *   - one full-bleed stage, slides crossfading in place
 *   - side arrows for manual paging, vertically centred on the stage
 *   - a segmented progress rail that fills across the active slide's duration
 *   - CTAs that live *outside* the slide and persist across all four, so the
 *     conversion point never moves
 * Everything else — colour, radius, type, button shapes — is ours.
 *
 * WHAT THE SOURCE FILES FORCED
 *   - The artboards ship with a fake nav strip painted across the top ("Home ·
 *     Markets · Trade · Competition · Insights"), which would have sat directly
 *     under the real sticky navbar. The top 80px is cropped off in the encode;
 *     source is 1920x1080, these are 1920x1000.
 *   - Originals were 3s at ~11Mbps, ~4.3MB each (17MB for the set). Re-encoded
 *     to H.264 ~800KB and VP9 ~270KB each, plus a poster taken from the last
 *     frame. Total for the set is now ~4.5MB, and only the first slide's poster
 *     is on the critical path.
 *   - Each clip is a 3s intro that settles and holds. Looping would restart the
 *     animation every 3s, which reads as a glitch, so a slide plays once, holds
 *     its final frame, and the rail advances at 7s.
 *
 * WHAT IT CANNOT DO (see the note in the chat): headline, sub-line and the
 * painted CTA are baked into the pixels, so none of it is selectable,
 * translatable, indexable, or legible at phone widths. The `sr-only` block on
 * each slide is a floor, not a fix. fpmarkets keeps its slide copy as live HTML
 * over layered art — that is the version worth asking the designer for.
 */

const SLIDE_MS = 7000;

const SLIDES = [
  {
    id: "guesswork",
    src: "/assets/experiment/hero/slide-1",
    alt: "The ByteFX app on a phone, surrounded by currency and crypto coins",
    heading: "Trade forex without the guesswork",
    copy: "Every market. Every tool. All under one roof. Execute forex and CFDs with institutional-grade speed — tight spreads, zero requotes, and real MT5 precision on every trade.",
  },
  {
    id: "atlas",
    src: "/assets/experiment/hero/slide-2",
    alt: "A trader working alongside Atlas, the ByteFX AI assistant",
    heading: "The missing piece",
    copy: "Introducing Atlas, ByteFX's AI, made to complete your trading strategy.",
  },
  {
    id: "one-platform",
    src: "/assets/experiment/hero/slide-3",
    alt: "A trader checking rates and charts on his phone",
    heading: "One platform for every market you trade",
    copy: "One platform for every market you trade, with no extra apps required. Zero extra apps.",
  },
  {
    id: "gold",
    src: "/assets/experiment/hero/slide-4",
    alt: "Gold bars in front of a rising candlestick chart",
    heading: "Gold moves. ByteFX moves with you.",
    copy: "From market movement to execution, ByteFX gives you the speed and access to trade with confidence.",
  },
];

export function HeroVideoTest() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const videoRefs = useRef([]);

  // Only the slide on screen and the one after it get a <video> element. The
  // rest stay as their poster until they are stepped to, so opening the page
  // costs one clip, not four.
  const [mounted, setMounted] = useState(() => new Set([0, 1]));

  const go = useCallback((next) => {
    const wrapped = (next + SLIDES.length) % SLIDES.length;
    setIndex(wrapped);
    setMounted((prev) => {
      const merged = new Set(prev);
      merged.add(wrapped);
      merged.add((wrapped + 1) % SLIDES.length);
      return merged;
    });
  }, []);

  // Restart the slide that just became active and stop the one that left, so a
  // clip is never mid-animation when you page back to it.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        const attempt = video.play();
        if (attempt?.catch) attempt.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, mounted]);

  // Auto-advance. Held while the pointer is over the stage, while the tab is
  // hidden, and whenever the viewer has paused it — the pause button is the
  // WCAG 2.2.2 escape hatch for moving content that starts on its own.
  useEffect(() => {
    if (reduced || !playing || hovered) return undefined;
    const timer = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, playing, hovered, reduced, go]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  };

  const active = SLIDES[index];

  return (
    <section
      aria-label="ByteFX highlights"
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden bg-[#03102b]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={onKeyDown}
    >
      <div className="relative mx-auto aspect-[1920/1000] w-full max-h-[760px]">
        {SLIDES.map((slide, i) => {
          const isActive = i === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={!isActive}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              {mounted.has(i) && !reduced ? (
                <video
                  ref={(node) => {
                    videoRefs.current[i] = node;
                  }}
                  className="h-full w-full object-cover"
                  poster={`${slide.src}-poster.webp`}
                  muted
                  playsInline
                  autoPlay={i === 0}
                  preload={i === 0 ? "auto" : "metadata"}
                  aria-label={slide.alt}
                >
                  <source src={`${slide.src}.webm`} type="video/webm" />
                  <source src={`${slide.src}.mp4`} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={`${slide.src}-poster.webp`}
                  alt={slide.alt}
                  width={1600}
                  height={834}
                  priority={i === 0}
                  sizes="100vw"
                  className="h-full w-full object-cover"
                />
              )}

              <span className="sr-only">
                {slide.heading}. {slide.copy}
              </span>
            </div>
          );
        })}

        {/* Arrows. Kept off the artwork's left third, where every slide puts
            its headline, and small enough on phones not to cover the copy. */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/60 hover:bg-black/45 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:left-5 sm:h-12 sm:w-12"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
        </button>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/60 hover:bg-black/45 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:right-5 sm:h-12 sm:w-12"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
        </button>

        <p aria-live="polite" className="sr-only">
          Slide {index + 1} of {SLIDES.length}: {active.heading}
        </p>
      </div>

      {/* The rail and the CTAs sit under the stage rather than on it: the
          artwork is edge-to-edge and already carries a painted button, so
          anything overlaid lands on top of something. Keeping the real CTAs
          here also means they stay in one place across all four slides. */}
      <div className="container-x relative z-10 flex flex-col items-center gap-5 py-6 sm:py-7">
        <div className="flex w-full items-center justify-center gap-3">
          <div className="flex flex-1 items-center gap-2 sm:max-w-[420px]">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.heading}`}
                aria-current={i === index}
                className="group relative h-6 flex-1 focus-visible:outline-none"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20 transition-colors duration-200 group-hover:bg-white/35 group-focus-visible:bg-white/60">
                  <span
                    className="block h-full rounded-full bg-go transition-[width] duration-300 ease-out"
                    style={{
                      width: i === index ? "100%" : i < index ? "100%" : "0%",
                      opacity: i <= index ? 1 : 0,
                    }}
                  />
                </span>
              </button>
            ))}
          </div>

          {!reduced && (
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors duration-200 hover:border-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              {playing ? (
                <Pause className="h-3.5 w-3.5" strokeWidth={2.4} />
              ) : (
                <Play className="h-3.5 w-3.5" strokeWidth={2.4} />
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/signup" size="lg" arrow>
            Start Trading
          </Button>
          <Button href="/demo" size="lg" variant="onDark">
            Try Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
