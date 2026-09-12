"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ items, defaultOpen = 0, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();
  const reduced = useReducedMotion();
  const btnRefs = useRef([]);

  const onKeyDown = (e, i) => {
    const last = items.length - 1;
    let next = null;
    if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    btnRefs.current[next]?.focus();
  };

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const headerId = `${baseId}-h-${i}`;
        const panelId = `${baseId}-p-${i}`;

        return (
          <div key={item.q}>
            <h3>
              <button
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "text-[16px] leading-snug font-semibold transition-colors md:text-[17px]",
                    isOpen ? "text-brand" : "text-ink"
                  )}
                >
                  {item.q}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                    isOpen
                      ? "rotate-45 border-brand-solid bg-brand-solid text-white"
                      : "border-line text-muted"
                  )}
                  aria-hidden="true"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pr-10 pb-6 text-[15.5px] leading-relaxed text-body">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
