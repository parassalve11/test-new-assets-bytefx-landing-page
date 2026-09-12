"use client";

import { useEffect, useState } from "react";

/**
 * The simulated quote feed, shared by `Ticker` and the market pages.
 *
 * TODO [BACKEND]: this is not a feed. It is a fixed seed plus a random walk,
 * and it exists so the pages can be built and reviewed before the socket
 * lands. **Replace `useQuoteFeed` with the real subscription** — the contract
 * a caller depends on is `{ symbol, price, decimals, change }` per row, plus
 * a `flash` object naming the row that just moved.
 *
 * Two rules the real implementation has to keep:
 *
 * 1. The seed renders identically on server and client, so there is no
 *    hydration mismatch and no layout shift. Ticking only starts after mount.
 * 2. On a stale feed, keep the last price at 60% opacity. Never render 0.00 —
 *    a zero price on a broker's own site reads as an outage, and a wrong
 *    price reads as a quote.
 */

/** Ten instruments across every asset class, for the landing-page ticker. */
export const TICKER_SEED = [
  { symbol: "EUR/USD", price: 1.0874, decimals: 4, change: 0.14 },
  { symbol: "XAU/USD", price: 2417.84, decimals: 2, change: 0.62 },
  { symbol: "BTC/USD", price: 76916.0, decimals: 0, change: -0.23 },
  { symbol: "GBP/USD", price: 1.2731, decimals: 4, change: -0.08 },
  { symbol: "US30", price: 41562.4, decimals: 1, change: 0.31 },
  { symbol: "NAS100", price: 21149.6, decimals: 1, change: 0.48 },
  { symbol: "USD/JPY", price: 154.219, decimals: 3, change: -0.17 },
  { symbol: "ETH/USD", price: 2913.55, decimals: 2, change: 1.06 },
  { symbol: "WTI", price: 71.42, decimals: 2, change: -0.44 },
  { symbol: "SPX500", price: 5734.9, decimals: 1, change: 0.19 },
];

/**
 * Drives a set of quotes with a small random walk. One row moves per tick, at
 * `intervalMs`; the row that moved is reported in `flash` so a caller can
 * highlight it. Nothing runs under `prefers-reduced-motion` — the seed is
 * returned unchanged and stays put, which is the correct still frame rather
 * than an empty table.
 */
export function useQuoteFeed(seed, intervalMs = 1800) {
  const [quotes, setQuotes] = useState(seed);
  const [flash, setFlash] = useState({});

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const i = Math.floor(Math.random() * seed.length);
      setQuotes((prev) =>
        prev.map((q, qi) => {
          if (qi !== i) return q;
          const drift = (Math.random() - 0.5) * (q.price * 0.0006);
          const next = q.price + drift;
          return {
            ...q,
            price: next,
            change: +(q.change + (drift / q.price) * 100).toFixed(2),
          };
        })
      );
      setFlash({
        index: i,
        dir: Math.random() > 0.5 ? "up" : "down",
        at: Date.now(),
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [seed, intervalMs]);

  return { quotes, flash };
}
