"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import growthArtwork from "@/public/assets/show_case/ae9eeeb9-2976-4ba4-8326-2dcdeaeb7513.webp";

const TILT_SPRING = { stiffness: 180, damping: 24, mass: 0.7 };

const STEPS = [
  { n: "1", label: "Open", detail: "2 minutes" },
  { n: "2", label: "Verify", detail: "ID upload" },
  { n: "3", label: "Fund", detail: "from $20" },
];

/**
 * The PNG is genuinely transparent, so it sits directly on the section. The
 * three steps are separate glass chips rather than a rectangular image plate.
 */
export function FinalCtaVisual() {
  const visualRef = useRef(null);
  const reduced = useReducedMotion();
  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);
  const glowXTarget = useMotionValue(0);
  const glowYTarget = useMotionValue(0);
  const rotateX = useSpring(rotateXTarget, TILT_SPRING);
  const rotateY = useSpring(rotateYTarget, TILT_SPRING);
  const glowX = useSpring(glowXTarget, TILT_SPRING);
  const glowY = useSpring(glowYTarget, TILT_SPRING);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start end", "end start"],
  });
  const driftTarget = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);
  const driftY = useSpring(driftTarget, {
    stiffness: 90,
    damping: 28,
    mass: 0.65,
  });

  const reset = () => {
    rotateXTarget.set(0);
    rotateYTarget.set(0);
    glowXTarget.set(0);
    glowYTarget.set(0);
  };

  const handlePointerMove = (event) => {
    if (reduced || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateXTarget.set(y * -3);
    rotateYTarget.set(x * 4);
    glowXTarget.set(x * 20);
    glowYTarget.set(y * 16);
  };

  return (
    <motion.div
      ref={visualRef}
      style={{ y: reduced ? 0 : driftY }}
      className="relative mx-auto w-full max-w-[390px] [perspective:1000px] motion-reduce:!transform-none"
    >
      <motion.figure
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
        whileHover={reduced ? undefined : { y: -3 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative will-change-transform motion-reduce:!transform-none"
      >
        <div className="relative aspect-[4/3]">
          <motion.div
            aria-hidden="true"
            style={{ x: glowX, y: glowY }}
            className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(76,210,1,0.22)_0%,rgba(19,86,190,0.14)_46%,transparent_76%)] blur-[38px]"
          />
          <div className="absolute inset-0 [transform:translateZ(42px)]">
            <Image
              src={growthArtwork}
              alt="Blue and green glass market bars rising beside a dollar symbol"
              sizes="(min-width: 1024px) 390px, (min-width: 640px) 42vw, calc(100vw - 72px)"
              className="absolute top-1/2 left-1/2 h-auto w-[116%] max-w-none -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_26px_30px_rgba(19,86,190,0.2)] transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <figcaption className="relative -mt-1 grid grid-cols-3 gap-2">
          {STEPS.map((step) => (
            <span
              key={step.n}
              className="flex flex-col items-center rounded-xl border border-brand-100/70 bg-surface/35 px-2 py-3 text-center shadow-xs backdrop-blur-md"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-solid text-[11.5px] font-bold text-white">
                {step.n}
              </span>
              <span className="mt-2 block text-[12.5px] leading-none font-semibold text-ink">
                {step.label}
              </span>
              <span className="mt-1 block text-[11px] leading-none text-muted">
                {step.detail}
              </span>
            </span>
          ))}
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}
