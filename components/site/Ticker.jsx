"use client";

import { useEffect, useRef, useState } from "react";

const TRADINGVIEW_SCRIPT_ID = "tradingview-ticker-tape-component";
const TRADINGVIEW_SCRIPT_URL =
  "https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js";

const SYMBOLS = [
  "FOREXCOM:SPXUSD",
  "FOREXCOM:NSXUSD",
  "FOREXCOM:DJI",
  "FX:EURUSD",
  "BITSTAMP:BTCUSD",
  "BITSTAMP:ETHUSD",
  "CMCMARKETS:GOLD",
  "FX:GBPUSD",
  "FX:USDJPY",
].join(",");

export function Ticker() {
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "180px 0px" }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || customElements.get("tv-ticker-tape")) return;
    if (document.getElementById(TRADINGVIEW_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = TRADINGVIEW_SCRIPT_ID;
    script.type = "module";
    script.src = TRADINGVIEW_SCRIPT_URL;
    script.async = true;
    document.head.appendChild(script);
  }, [visible]);

  return (
    <section
      ref={hostRef}
      aria-labelledby="live-market-prices"
      style={{ marginTop: "-32px" }}
      className="relative z-10 w-full px-3 py-2 sm:px-5"
    >
      <h2 id="live-market-prices" className="sr-only">
        Live global market prices
      </h2>

      <div className="relative h-[58px] w-full overflow-hidden rounded-2xl border border-white/75 bg-[linear-gradient(112deg,rgba(255,255,255,.72),rgba(238,243,248,.48),rgba(255,255,255,.6))] shadow-[0_18px_42px_-25px_rgba(5,21,35,.5),inset_0_1px_0_rgba(255,255,255,.92)] backdrop-blur-[24px] backdrop-saturate-[165%] transition-[background-color,border-color,box-shadow] duration-500 dark:border-white/12 dark:bg-[linear-gradient(112deg,rgba(25,31,36,.74),rgba(9,14,18,.68),rgba(18,26,24,.72))] dark:shadow-[0_20px_46px_-24px_rgba(0,0,0,.92),inset_0_1px_0_rgba(255,255,255,.08)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_10%_-40%,rgba(255,255,255,.74),transparent_36%),linear-gradient(115deg,rgba(255,255,255,.2),transparent_35%,transparent_72%,rgba(126,231,74,.06))] transition-opacity duration-500 dark:bg-[radial-gradient(circle_at_10%_-55%,rgba(255,255,255,.1),transparent_38%),linear-gradient(115deg,rgba(255,255,255,.025),transparent_35%,transparent_72%,rgba(126,231,74,.035))]"
        />

        {visible ? (
          <div
            className="relative z-10 h-[58px] w-full overflow-hidden"
            style={{
              "--tv-widget-background-color": "transparent",
            }}
          >
            <tv-ticker-tape
              symbols={SYMBOLS}
              item-size="compact"
              transparent
              className="block h-[58px] w-full bg-transparent"
            >
              <div className="flex h-[58px] items-center gap-10 px-6" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((item) => (
                  <span
                    key={item}
                    className="h-2.5 w-28 shrink-0 animate-pulse rounded-full bg-black/[0.055] dark:bg-white/[0.075]"
                  />
                ))}
              </div>
            </tv-ticker-tape>
          </div>
        ) : (
          <div className="relative z-10 flex h-[58px] items-center gap-10 px-6" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((item) => (
              <span
                key={item}
                className="h-2.5 w-28 shrink-0 animate-pulse rounded-full bg-black/[0.055] dark:bg-white/[0.075]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
