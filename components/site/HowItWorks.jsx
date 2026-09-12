"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

/**
 * Kills the 3D city-skyline illustration on the live site. This is a genuine
 * sequence, so 01-04 numbering carries real information here.
 */
const STEPS = [
  {
    n: "01",
    title: "Sign up",
    copy: "Create your account in a few clicks.",
  },
  {
    n: "02",
    title: "Verify",
    copy: "Upload ID and proof of address. Usually minutes.",
  },
  {
    n: "03",
    title: "Add funds",
    copy: "Card, bank wire, USDT or crypto. No ByteFX fee.",
  },
  {
    n: "04",
    title: "Start trading",
    copy: "Open your first position on any of 150+ markets.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });
  const scale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <Section
      id="how-it-works"
      bg="alt"
      title={
        <>
          Live in four steps.
        </>
      }
      lead="No paperwork queue, no waiting on a callback. Most accounts are funded and trading the same day."
      aside={
        <Button href="/signup" size="md" arrow>
          Open live account
        </Button>
      }
    >
      <div ref={ref} className="relative">
        {/* Rail: runs down the gutter on mobile, across the top on desktop.
            Both fill from the same scroll progress. */}
        <div
          aria-hidden="true"
          className="absolute top-6 bottom-6 left-[23px] w-0.5 bg-line md:hidden"
        >
          <motion.div
            className="h-full w-full origin-top rounded-full bg-brand"
            style={reduced ? { transform: "scaleY(1)" } : { scaleY: scale }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute top-[23px] right-0 left-0 hidden h-0.5 bg-line md:block"
        >
          <motion.div
            className="h-full w-full origin-left rounded-full bg-brand"
            style={reduced ? { transform: "scaleX(1)" } : { scaleX: scale }}
          />
        </div>

        <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              className="relative pl-14 md:pl-0"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              <span className="tnum absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand bg-surface text-[14px] font-bold text-brand md:relative md:mb-6">
                {step.n}
              </span>
              <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 max-w-[15rem] text-[14.5px] leading-relaxed text-body">
                {step.copy}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
