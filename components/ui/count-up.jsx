"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

function format(n, decimals, group) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: group,
  });
}

/**
 * Counts once when scrolled into view. Under reduced motion the final value is
 * rendered immediately — no animation, no layout shift either way.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  group = true,
  duration = 1200,
  className,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;

    let raf;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out-expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className} data-num>
      {prefix}
      {format(display, decimals, group)}
      {suffix}
    </span>
  );
}
