"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1];

const FEATURES = [
  {
    title: "Fund and withdraw in-app",
    copy: "Card, bank wire, USDT and crypto — no desktop round trip.",
  },
  {
    title: "Price alerts that actually arrive",
    copy: "Push notifications on levels you set, per instrument.",
  },
  {
    title: "One account, every device",
    copy: "Positions opened on mobile show instantly in MT5 and WebTrader.",
  },
];

/**
 * TODO [PRODUCT]: these two lines describe what each platform does
 * generally, not a ByteFX integration spec. Confirm the TradingView broker
 * link before launch.
 *
 * Atlas AI used to sit here as a third tab. It is not a place you open the
 * account, so it never belonged in a switcher whose whole claim is "the same
 * account opens in all of these" — it now lives in the assistant launcher
 * (`components/site/AtlasChat.jsx`), reachable from every page.
 */
const PLATFORMS = [
  {
    id: "mt5",
    name: "MetaTrader 5",
    copy: "Every order type, Expert Advisors and 21 timeframes — running on your live balance.",
    icon: "/assets/mobile-section/meta-treader.webp",
    markClass: "h-[22px] w-[22px]",
  },
  {
    id: "tradingview",
    name: "TradingView",
    copy: "Chart where you already chart. Orders and open positions stay linked to your account.",
    icon: "/assets/mobile-section/treadingview.webp",
    markClass: "h-[26px] w-[26px]",
  },
];

/**
 * The platforms the same account opens in, as one small switcher rather than a
 * section: this band is already the "one account, every device" argument, and
 * two logos do not need a section of their own to make the same point. Picking
 * one swaps the line underneath it, so the whole thing stays two rows tall no
 * matter how many platforms are listed.
 *
 * Real tabs — click, arrow keys, Home/End — not hover-only, which would put
 * the copy out of reach on touch. Each mark sits on a white puck for the same
 * reason as the funding icons: TradingView's near-black wordmark has no other
 * ground it reads on in both themes.
 */
function PlatformSwitch() {
  const [active, setActive] = useState(PLATFORMS[0].id);
  const reduced = useReducedMotion();
  const refs = useRef([]);
  const baseId = useId();
  const current = PLATFORMS.find((p) => p.id === active) ?? PLATFORMS[0];

  const onKeyDown = (e) => {
    const i = PLATFORMS.findIndex((p) => p.id === active);
    const last = PLATFORMS.length - 1;
    let next = null;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(PLATFORMS[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="text-center">
      <p className="text-[13.5px] text-muted">
        The same account opens in both.
      </p>

      <div
        role="tablist"
        aria-label="Trading platforms"
        onKeyDown={onKeyDown}
        className="mx-auto mt-4 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-line bg-surface p-1 shadow-sm"
      >
        {PLATFORMS.map((p, i) => {
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${p.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(p.id)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors",
                isActive ? "text-brand" : "text-body hover:text-ink"
              )}
            >
              {isActive &&
                (reduced ? (
                  <span className="absolute inset-0 rounded-full bg-brand-50" />
                ) : (
                  <motion.span
                    layoutId="platform-pill"
                    className="absolute inset-0 rounded-full bg-brand-50"
                    transition={{ duration: 0.28, ease: EASE }}
                  />
                ))}
              <span className="pay-puck relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                <Image
                  src={p.icon}
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="28px"
                  className={cn("object-contain", p.markClass)}
                />
              </span>
              <span className="relative">{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Fixed height so swapping the line never nudges the page. */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="mx-auto mt-4 flex min-h-[48px] max-w-lg items-start justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="text-[14.5px] leading-relaxed text-body"
          >
            {current.copy}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function MobileApp() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Signature moment 2: the device cluster drifts a little as you scroll past.
  const y = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <Section
      id="app"
      bg="alt"
      align="center"
      title={
        <>
          Trade anywhere. Settle everything from your phone.
        </>
      }
      lead="The ByteFX app runs the same account as your desktop terminal — open positions, fund, withdraw and set alerts without opening a laptop."
    >
      <div ref={ref}>
        {/* The real ByteFX product shot, centred and carrying the section. */}
        <motion.div
          style={reduced ? undefined : { y }}
          className="relative mx-auto w-full max-w-[1000px]"
        >
          {/* Soft brand glow so the dark devices sit on the light band
              instead of floating unanchored. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[6%] top-[18%] bottom-[6%] rounded-[50%] bg-brand/20 blur-3xl"
          />
          <Image
            src="/assets/mobile_section.webp"
            alt="The ByteFX trading platform running on tablet, phone and laptop"
            width={1672}
            height={941}
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="relative h-auto w-full"
          />
        </motion.div>

        {/* Directly under the device shot: the cluster shows the account on
            tablet, phone and laptop, and this is the line that says which
            front ends those are. Separating them put a features grid and two
            store badges between the claim and its evidence. */}
        <Reveal delay={0.04} className="mt-10">
          <PlatformSwitch />
        </Reveal>

        <Reveal
          delay={0.06}
          className="mx-auto mt-12 grid max-w-4xl gap-8 text-center sm:grid-cols-3 sm:gap-6"
        >
          {FEATURES.map((f) => (
            <div key={f.title}>
              <p className="text-[16.5px] font-semibold text-ink">{f.title}</p>
              <p className="mx-auto mt-1.5 max-w-[22rem] text-[14.5px] leading-relaxed text-body">
                {f.copy}
              </p>
            </div>
          ))}
        </Reveal>

      </div>
    </Section>
  );
}
