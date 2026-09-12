"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

const KEY = "bytefx:notice-dismissed";

/**
 * The live site runs this as a solid green bar — far too much weight at the
 * very top of the page. Same message, brand-tint surface, dismissible.
 */
export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked — dismissal is per-session, which is fine */
    }
  };

  return (
    <div className="relative z-40 bg-brand-50 text-brand">
      <div className="container-x flex items-center justify-center gap-2 py-2 pr-8 text-center">
        <ShieldCheck className="hidden h-4 w-4 shrink-0 sm:block" strokeWidth={2.2} />
        <p className="text-[12.5px] leading-snug font-medium">
          Your security matters — use only official ByteFX platforms for secure
          transactions.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notice"
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded p-1 text-brand/60 transition-colors hover:text-brand"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
