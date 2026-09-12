"use client";

import { useCallback, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export const THEME_KEY = "bytefx:theme";

const THEME_COLORS = {
  light: "#f4f6f8",
  dark: "#111418",
};

function syncThemeColor(theme) {
  let meta = document.querySelector('meta[name="theme-color"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", THEME_COLORS[theme] ?? THEME_COLORS.light);
}

/**
 * The resolved theme is stored on <html>. Both visual states are rendered so
 * the control never hydrates with the wrong icon after the pre-paint script
 * restores a saved preference.
 */
export function ThemeToggle({ className }) {
  useEffect(() => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    syncThemeColor(theme);
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    syncThemeColor(next);

    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* Storage can be blocked; the choice still lasts for this page view. */
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      title="Switch colour theme"
      className={cn(
        "theme-toggle relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line/80 bg-surface/45 text-body shadow-xs backdrop-blur-md transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/45 hover:text-ink",
        className
      )}
    >
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:inline">Switch to light mode</span>
      <Moon aria-hidden="true" className="h-[17px] w-[17px] dark:hidden" strokeWidth={2} />
      <Sun aria-hidden="true" className="hidden h-[17px] w-[17px] dark:block" strokeWidth={2} />
    </button>
  );
}
