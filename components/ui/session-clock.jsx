"use client";

import { useEffect, useState } from "react";
import { SESSIONS } from "@/lib/markets-data";
import { cn } from "@/lib/utils";

function isOpen(session, utcHour) {
  // Sydney wraps midnight, so the window is a union rather than a range.
  return session.open <= session.close
    ? utcHour >= session.open && utcHour < session.close
    : utcHour >= session.open || utcHour < session.close;
}

/**
 * Which FX sessions are open right now.
 *
 * This is the one genuinely live thing on the calendar page: it is computed
 * from the reader's own clock, so it needs no feed and cannot go stale.
 *
 * It renders a neutral state until mounted. The server has no idea what time
 * it is for the reader, and an open/closed pill that flips on hydration is
 * worse than one that arrives a frame late. Session windows are approximate
 * and do not shift with daylight saving — the note under it says so.
 */
export function SessionClock({ className }) {
  const [utcHour, setUtcHour] = useState(null);

  useEffect(() => {
    const tick = () => setUtcHour(new Date().getUTCHours());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {SESSIONS.map((s) => {
        const open = utcHour === null ? null : isOpen(s, utcHour);
        return (
          <span
            key={s.id}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              open === null && "border-line bg-surface text-muted",
              open === true && "border-go/35 bg-go/8 text-go-600",
              open === false && "border-line bg-alt text-muted"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                open ? "bg-go" : "bg-line-strong"
              )}
            />
            {s.name}
            <span className="tnum text-[11.5px] opacity-70">
              {open === null
                ? "—"
                : `${open ? "open" : "closed"} · ${String(s.open).padStart(2, "0")}–${String(s.close).padStart(2, "0")} UTC`}
            </span>
          </span>
        );
      })}
    </div>
  );
}
