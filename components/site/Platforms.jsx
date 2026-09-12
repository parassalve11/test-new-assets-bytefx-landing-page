"use client";

import { useState } from "react";
import {
  Apple,
  Check,
  Globe,
  MonitorSmartphone,
  Smartphone,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  {
    id: "webtrader",
    label: "ByteFX WebTrader",
    note: "Browser, nothing to install",
  },
  { id: "mt5", label: "MetaTrader 5", note: "Desktop and mobile" },
  { id: "mobile", label: "ByteFX Mobile", note: "iOS and Android" },
];

const DOWNLOADS = [
  { label: "Windows", icon: MonitorSmartphone, href: "/download#windows" },
  { label: "macOS", icon: Apple, href: "/download#macos" },
  { label: "iOS", icon: Smartphone, href: "/download#ios" },
  { label: "Android", icon: Smartphone, href: "/download#android" },
  { label: "Web", icon: Globe, href: "https://trade.bytefx.com" },
];

const FEATURES = [
  "Six order types with partial fills and no requotes",
  "38 built-in indicators, 21 timeframes, depth of market",
  "Expert Advisors and copy trading on the same account",
];

/* Fixed OHLC so server and client render identically — no layout shift. */
const CANDLES = [
  [42, 58, 38, 54], [54, 62, 50, 51], [51, 55, 41, 44], [44, 49, 40, 47],
  [47, 60, 45, 58], [58, 66, 55, 63], [63, 68, 58, 60], [60, 64, 52, 55],
  [55, 59, 48, 50], [50, 57, 47, 56], [56, 70, 54, 68], [68, 74, 64, 66],
  [66, 71, 60, 62], [62, 67, 57, 65], [65, 78, 63, 76], [76, 82, 72, 74],
  [74, 79, 68, 70], [70, 76, 66, 75], [75, 88, 73, 85], [85, 92, 81, 90],
];

function CandleChart() {
  const w = 640;
  const h = 260;
  const pad = 14;
  const lo = Math.min(...CANDLES.map((c) => c[2]));
  const hi = Math.max(...CANDLES.map((c) => c[1]));
  const slotW = (w - pad * 2) / CANDLES.length;
  const bodyW = slotW * 0.52;
  const y = (v) => h - pad - ((v - lo) / (hi - lo)) * (h - pad * 2);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full"
      role="img"
      aria-label="Candlestick chart illustration"
    >
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="#e3e9f2"
          strokeWidth="1"
        />
      ))}
      {CANDLES.map(([o, high, low, c], i) => {
        const cx = pad + i * slotW + slotW / 2;
        const up = c >= o;
        const color = up ? "#16a34a" : "#dc2626";
        const top = y(Math.max(o, c));
        const bottom = y(Math.min(o, c));
        return (
          <g key={i}>
            <line
              x1={cx}
              x2={cx}
              y1={y(high)}
              y2={y(low)}
              stroke={color}
              strokeWidth="1.2"
            />
            <rect
              x={cx - bodyW / 2}
              y={top}
              width={bodyW}
              height={Math.max(bottom - top, 1.5)}
              fill={up ? color : "var(--surface)"}
              stroke={color}
              strokeWidth="1.2"
              rx="1"
            />
          </g>
        );
      })}
    </svg>
  );
}

const WATCHLIST = [
  { s: "XAUUSD", p: "2,417.84", up: true },
  { s: "EURUSD", p: "1.0874", up: true },
  { s: "GBPUSD", p: "1.2731", up: false },
  { s: "US30", p: "41,562.4", up: true },
  { s: "BTCUSD", p: "76,916", up: false },
];

/**
 * Placeholder product UI. Swap for a real capture of the ByteFX WebTrader
 * skin once design has one — see plan.md open question 5.
 */
function TerminalMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-sunken px-4 py-2.5">
        <span className="flex gap-1.5">
          {["#f5726f", "#f8bd4f", "#61c454"].map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="mx-auto rounded-md border border-line bg-surface px-3 py-1 text-[11.5px] text-muted">
          trade.bytefx.com
        </span>
      </div>

      {/* Below 640px the watchlist is dropped so the chart keeps a usable
          width — a 110px column plus a chart does not fit a 320px screen. */}
      <div className="grid grid-cols-1 sm:grid-cols-[136px_minmax(0,1fr)]">
        <div className="hidden border-r border-line bg-surface p-3 sm:block">
          <p className="eyebrow mb-2">Watchlist</p>
          <ul className="space-y-1.5">
            {WATCHLIST.map((i) => (
              <li key={i.s} className="flex items-center justify-between gap-1">
                <span className="text-[11.5px] font-semibold text-ink">
                  {i.s}
                </span>
                <span
                  className={cn(
                    "tnum text-[11px]",
                    i.up ? "text-up" : "text-down"
                  )}
                >
                  {i.p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chart */}
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-semibold text-ink">
              XAUUSD &middot; H1
            </span>
            <span className="tnum rounded bg-up/8 px-1.5 py-0.5 text-[11px] font-semibold text-up">
              +0.62%
            </span>
          </div>
          <div className="h-[180px] sm:h-[220px]">
            <CandleChart />
          </div>
        </div>
      </div>

      {/* Order bar */}
      <div className="grid grid-cols-3 gap-2 border-t border-line p-3">
        <div className="rounded-lg border border-line bg-alt px-3 py-2">
          <span className="eyebrow">Sell</span>
          <span className="tnum block text-[14px] font-bold text-down">
            2,417.62
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-line bg-surface px-2 py-2">
          <span className="eyebrow">Volume</span>
          <span className="tnum text-[14px] font-bold text-ink">0.10</span>
        </div>
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2">
          <span className="eyebrow text-brand/70">Buy</span>
          <span className="tnum block text-[14px] font-bold text-up">
            2,417.84
          </span>
        </div>
      </div>
    </div>
  );
}

export function Platforms() {
  const [platform, setPlatform] = useState("webtrader");

  return (
    <Section
      id="platforms"
      bg="brand"
      title={
        <>
          The terminal professionals{" "}
          <span className="text-go">already know.</span>
        </>
      }
      lead="Run MetaTrader 5 on desktop and mobile, or trade straight from the browser with ByteFX WebTrader. Same account, same positions, same execution."
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <Reveal>
          {/* Platform picker */}
          <div
            role="tablist"
            aria-label="Trading platforms"
            className="grid gap-2 sm:grid-cols-3"
          >
            {PLATFORMS.map((p) => {
              const active = p.id === platform;
              return (
                <button
                  key={p.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setPlatform(p.id)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left backdrop-blur-sm transition-all duration-200",
                    active
                      ? "border-go bg-go/15 shadow-xs"
                      : "border-white/20 bg-white/8 hover:border-white/40"
                  )}
                >
                  <span
                    className={cn(
                      "block text-[13.5px] font-semibold",
                      active ? "text-go" : "text-white"
                    )}
                  >
                    {p.label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-white/60">
                    {p.note}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="mt-8 space-y-3.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3">
                <Check
                  className="mt-1 h-4 w-4 shrink-0 text-go"
                  strokeWidth={3}
                />
                <span className="text-[15.5px] leading-relaxed text-white/85">
                  {f}
                </span>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-9 text-white/60">Download</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {DOWNLOADS.map((d) => {
              const Icon = d.icon;
              return (
                <a
                  key={d.label}
                  href={d.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[13.5px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-go hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {d.label}
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:order-last">
          <TerminalMock />
        </Reveal>
      </div>
    </Section>
  );
}
