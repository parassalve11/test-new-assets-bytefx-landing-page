"use client";

import { BrandGlyph } from "@/components/ui/brand-icons";
import { Flag } from "@/components/ui/flag-icons";
import { cn } from "@/lib/utils";

/**
 * The ByteFX coin disc — the asset mark treatment from the original landing
 * page: a circular disc tinted green or blue, carrying the real mark for the
 * instrument (brand logo, currency flags, metal, or index wordmark).
 */

const TONES = {
  // These discs carry white type, so their darker stop is pinned rather
  // than tokenised — `brand` and `go-600` both lighten in dark mode.
  blue: "bg-gradient-to-br from-[#7FB2FF] to-brand-solid text-white",
  green: "bg-gradient-to-br from-[#A9F073] to-[#3ca800] text-white",
  deep: "bg-gradient-to-br from-[#2F6BD6] to-[#0D3585] text-white",
  gold: "bg-gradient-to-br from-[#FFDF8A] to-[#D9A21B] text-[#5A3E00]",
  silver: "bg-gradient-to-br from-[#F0F3F8] to-[#AFBACB] text-[#41506A]",
};

const SIZES = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
  xl: "h-[68px] w-[68px]",
};

const GLYPH = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

const TEXT = {
  sm: "text-[7px]",
  md: "text-[9px]",
  lg: "text-[10.5px]",
  xl: "text-[12px]",
};

export function Coin({ tone = "blue", size = "md", className, children }) {
  return (
    <span
      className={cn(
        "coin inline-flex shrink-0 items-center justify-center",
        TONES[tone],
        SIZES[size],
        className
      )}
    >
      {children}
    </span>
  );
}

/** A brand mark (AAPL, NVDA, BTC…) inside a coin. */
export function BrandCoin({ brand, tone = "blue", size = "md", className }) {
  return (
    <Coin tone={tone} size={size} className={className}>
      <BrandGlyph name={brand} className={GLYPH[size]} />
    </Coin>
  );
}

/**
 * A short wordmark (US30, NAS100, XAU…) inside a coin. Long labels step the
 * type down so nothing ever touches the disc edge.
 */
export function TextCoin({ label, tone = "deep", size = "md", className }) {
  const long = label.length >= 6;
  const medium = label.length === 5;

  return (
    <Coin tone={tone} size={size} className={className}>
      <span
        className={cn(
          "font-bold tracking-[-0.02em]",
          TEXT[size],
          long && "scale-[0.72]",
          medium && "scale-[0.86]"
        )}
      >
        {label}
      </span>
    </Coin>
  );
}

/**
 * A currency pair: two flag discs, the quote currency tucked behind the base.
 * This is how every real terminal renders FX, and it beats a generic globe.
 */
export function PairCoin({ base, quote, size = "md", className }) {
  const ring =
    "coin overflow-hidden rounded-full ring-2 ring-surface bg-sunken shrink-0";
  const dim = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-9 w-9" : "h-7 w-7";
  const overlap = size === "sm" ? "-ml-2.5" : size === "lg" ? "-ml-4" : "-ml-3";

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span className={cn(ring, dim)}>
        <Flag code={base} className="h-full w-full object-cover" />
      </span>
      <span className={cn(ring, dim, overlap)}>
        <Flag code={quote} className="h-full w-full object-cover" />
      </span>
    </span>
  );
}

/**
 * Overlapping disc cluster for the asset-class cards — the arrangement the
 * original page used, rebuilt with real marks instead of a stock 3D render.
 */
export function CoinCluster({ items, className }) {
  return (
    <span className={cn("relative flex items-center", className)} aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={item.key ?? i}
          className={cn(i > 0 && "-ml-4")}
          style={{ zIndex: i === 1 ? items.length + 1 : items.length - i }}
        >
          {item.brand ? (
            <BrandCoin
              brand={item.brand}
              tone={item.tone}
              size={i === 1 ? "xl" : "lg"}
            />
          ) : (
            <TextCoin
              label={item.label}
              tone={item.tone}
              size={i === 1 ? "xl" : "lg"}
            />
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * Resolves an instrument symbol to its correct mark. Keeping this in one place
 * means the ticker, the bento and the watchlist can never disagree.
 */
const FX = {
  "EUR/USD": ["EU", "US"],
  "GBP/USD": ["GB", "US"],
  "USD/JPY": ["US", "JP"],
  "USD/CHF": ["US", "CH"],
  "AUD/USD": ["AU", "US"],
  "USD/CAD": ["US", "CA"],
};

const BRAND_SYMBOL = {
  AAPL: "apple",
  NVDA: "nvidia",
  TSLA: "tesla",
  GOOGL: "google",
  META: "meta",
  "BTC/USD": "bitcoin",
  "ETH/USD": "ethereum",
  USDT: "tether",
};

export function InstrumentIcon({ symbol, size = "md", className }) {
  const pair = FX[symbol];
  if (pair) {
    return (
      <PairCoin base={pair[0]} quote={pair[1]} size={size} className={className} />
    );
  }

  const brand = BRAND_SYMBOL[symbol];
  if (brand) {
    const tone =
      symbol === "BTC/USD" ? "gold" : symbol === "ETH/USD" ? "deep" : "blue";
    return (
      <BrandCoin brand={brand} tone={tone} size={size} className={className} />
    );
  }

  if (symbol === "XAU/USD" || symbol === "XAUUSD") {
    return <TextCoin label="XAU" tone="gold" size={size} className={className} />;
  }
  if (symbol === "XAG/USD") {
    return <TextCoin label="XAG" tone="silver" size={size} className={className} />;
  }
  if (symbol === "WTI" || symbol === "BRENT") {
    return <TextCoin label={symbol} tone="deep" size={size} className={className} />;
  }

  // Indices and anything else fall back to a wordmark disc.
  return (
    <TextCoin
      label={symbol.replace("/", "")}
      tone="deep"
      size={size}
      className={className}
    />
  );
}
