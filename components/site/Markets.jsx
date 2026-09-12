"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BarChart3,
  Bitcoin,
  CandlestickChart,
  Droplet,
  Send,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * The bento is 12 columns wide at xl:
 *
 *   [ Forex .................... 7 ][ Indices ........ 5 ]
 *   [ Crypto ... 4 ][ Stocks ... 4 ][ Metals & Energy 4 ]
 *
 * Forex leads because it is the house product and the only tile carrying
 * motion; Indices takes the rest of the top row because its artwork is the
 * one landscape mark in the set and needs the width. The bottom three are
 * equal thirds — breadth is the message down there, so nothing gets to shout.
 *
 * Every tile reads top-to-bottom in the same order: the count, the market,
 * a short blue rule, one sentence, then the CTA pinned to the bottom-left.
 * The artwork bleeds off the bottom-right corner behind all of it, which is
 * what lets the marks run large without ever colliding with the type — the
 * copy column is capped in width and the artwork starts where it ends.
 *
 * The card surface is near-white (`market-plate`). The old brushed-platinum
 * plate existed because the previous marks were dark steel cutouts that
 * needed a metal ground; this set is saturated, and saturation on grey goes
 * muddy. See the note on `market-plate` in globals.css.
 */

const MARKETS = [
  {
    id: "indices",
    title: "Indices",
    count: "12+",
    countLabel: "Global indices",
    icon: BarChart3,
    description: "S&P 500, Nasdaq 100, Dow and FTSE — spot and futures.",
    cta: "Explore Indices",
    // The rising bar this mark is mounted on runs the full width of the
    // artwork and lands in the bottom-LEFT corner — right where a labelled
    // pill would go. The reference solves that by dropping the label on this
    // one card and leaving the bare arrow, and so does this.
    compactCta: true,
    image: "/assets/indices.webp",
    width: 1448,
    height: 1086,
    alt: "S&P 500, Nasdaq 100, Dow Jones and FTSE 100 index medallions",
    // The one landscape mark in the set, so it gets the top row's width.
    span: "xl:col-span-5",
    minHeight: "min-h-[380px] md:min-h-[400px]",
    copyWidth: "max-w-[62%] sm:max-w-[56%]",
    markClassName: "-right-[2%] -bottom-[3%] w-[72%] max-w-[420px]",
    delay: "0s",
  },
  {
    id: "crypto",
    title: "Crypto",
    count: "25+",
    countLabel: "Crypto CFDs",
    icon: Bitcoin,
    description: "Bitcoin, Ethereum, Solana and Tether, around the clock.",
    cta: "Explore Crypto",
    image: "/assets/CrypoCurrency.webp",
    width: 1254,
    height: 1254,
    alt: "Bitcoin, Ethereum, Solana and Tether coins",
    span: "xl:col-span-4",
    minHeight: "min-h-[368px]",
    copyWidth: "max-w-[54%]",
    markClassName: "-right-[9%] -bottom-[11%] w-[62%] max-w-[262px]",
    delay: "-2.4s",
  },
  {
    id: "stocks",
    title: "Stocks",
    count: "500+",
    countLabel: "Share CFDs",
    icon: CandlestickChart,
    description: "Long or short on the largest US, UK and European names.",
    cta: "Explore Stocks",
    image: "/assets/stocks_metal.webp",
    width: 1254,
    height: 1254,
    alt: "Apple, NVIDIA, Tesla, Google and Meta company marks",
    span: "xl:col-span-4",
    minHeight: "min-h-[368px]",
    copyWidth: "max-w-[52%]",
    markClassName: "-right-[10%] -bottom-[10%] w-[64%] max-w-[270px]",
    delay: "-4.8s",
  },
  {
    id: "commodities",
    title: "Metals & Energy",
    count: "XAU, XAG",
    countLabel: "WTI & Brent",
    icon: Droplet,
    description: "Gold, silver, crude and natural gas at institutional pricing.",
    cta: "Explore Commodities",
    image: "/assets/gold_and_sliver.webp",
    width: 1254,
    height: 1254,
    alt: "Gold bar, silver bar and a crude oil droplet",
    span: "xl:col-span-4",
    minHeight: "min-h-[368px]",
    // "Metals & Energy" is the longest title in the set and wraps to two
    // lines, so its copy column is the narrowest.
    copyWidth: "max-w-[50%]",
    markClassName: "-right-[11%] -bottom-[12%] w-[66%] max-w-[278px]",
    delay: "-1.2s",
  },
];

/**
 * One tile. The surface, the hairline and the lift all live here so every
 * tile is milled the same way. Hover is the lift and the shadow only — the
 * plate takes no specular sweep, which read as glare on a card that already
 * carries a gradient and a floating mark.
 */
function Tile({ href, label, plate = "market-plate", className, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        "market-tile group/tile relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(1,6,26,0.045),0_18px_44px_-28px_rgba(1,6,26,0.28)] transition-[transform,box-shadow] duration-300 ease-out outline-none hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(19,86,190,0.12),0_30px_64px_-30px_rgba(1,6,26,0.36)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        // Passed separately rather than folded into `className`: the plates
        // are hand-written classes, so `cn` cannot see two of them as
        // conflicting and would keep both on the element.
        plate,
        className
      )}
    >
      {children}
    </a>
  );
}

/**
 * The count, in the reference's two-line form: the number carries the weight,
 * the unit sits under it in brand blue. The icon is the only glyph on the
 * card, so it is the thing that tells you which market this is before you
 * have read anything.
 */
function TileCount({ icon: Icon, count, label }) {
  return (
    <span className="flex items-center gap-2.5">
      <Icon
        className="h-[19px] w-[19px] shrink-0 text-brand"
        strokeWidth={2.2}
        aria-hidden="true"
      />
      <span className="leading-none">
        <span className="tnum block text-[14px] font-bold text-ink">
          {count}
        </span>
        <span className="mt-[3px] block text-[10.5px] font-semibold tracking-[0.09em] text-brand uppercase">
          {label}
        </span>
      </span>
    </span>
  );
}

/** The short rule between the title and the sentence, as in the reference. */
function TileRule() {
  return (
    <span
      aria-hidden="true"
      className="mt-3.5 block h-[3px] w-8 rounded-full bg-brand"
    />
  );
}

/**
 * The CTA. It is a `span`, not a button or a link — the whole tile is already
 * the anchor, so a nested interactive element would be both a duplicate tab
 * stop and invalid markup.
 */
function TileCta({ children, compact = false, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center self-start rounded-full border border-black/[0.05] bg-white/90 shadow-[0_6px_18px_-8px_rgba(1,6,26,0.35)] backdrop-blur-sm transition-colors duration-300 group-hover/tile:border-brand/25 dark:border-white/10 dark:bg-surface/90",
        compact ? "p-1.5" : "gap-3 py-1.5 pr-1.5 pl-5",
        className
      )}
    >
      {!compact && (
        <span className="text-[13.5px] font-semibold text-ink">{children}</span>
      )}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-solid text-white transition-transform duration-300 group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.6} />
      </span>
    </span>
  );
}

/** The supplied Forex mark, with a restrained idle drift and hover response. */
function ForexMark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 -mx-6 -mt-2 aspect-[4/3] w-[calc(100%+3rem)] sm:absolute sm:right-[1%] sm:top-1/2 sm:mx-0 sm:mt-0 sm:w-[62%] sm:max-w-[460px] sm:-translate-y-1/2"
    >
      <span className="absolute inset-x-[12%] inset-y-[17%] rounded-full bg-brand/20 opacity-55 blur-3xl transition-[opacity,transform] duration-700 ease-out group-hover/tile:scale-110 group-hover/tile:opacity-80 dark:opacity-35" />

      <div
        className="metal-float relative h-full w-full"
        style={{ "--float-delay": "-3.6s" }}
      >
        <Image
          src="/assets/forex.webp"
          alt=""
          width={1024}
          height={768}
          sizes="(min-width: 1280px) 500px, (min-width: 640px) 46vw, 100vw"
          className="h-full w-full origin-[58%_56%] object-contain drop-shadow-[0_24px_30px_rgba(4,26,74,0.18)] transition-[transform,filter] duration-700 ease-out group-hover/tile:-rotate-[0.8deg] group-hover/tile:scale-[1.045] group-hover/tile:drop-shadow-[0_30px_36px_rgba(19,86,190,0.28)]"
        />
      </div>

      <span className="absolute top-[14%] right-[22%] h-10 w-10 rounded-full bg-white/50 opacity-0 blur-2xl transition-opacity duration-500 group-hover/tile:opacity-65" />
    </div>
  );
}

function MarketTile({ market }) {
  return (
    <RevealItem
      as="li"
      className={cn("min-w-0 list-none", market.span)}
    >
      <Tile
        href={`/markets/${market.id}`}
        label={market.cta}
        className={cn("p-6 sm:p-7", market.minHeight)}
      >
        <div className={cn("relative z-10 mb-6", market.copyWidth)}>
          <TileCount
            icon={market.icon}
            count={market.count}
            label={market.countLabel}
          />

          <h3 className="mt-4 text-[26px] leading-[1.08] font-bold tracking-[-0.03em] text-ink md:text-[30px]">
            {market.title}
          </h3>

          <TileRule />

          <p className="mt-4 text-[13.5px] leading-relaxed text-body">
            {market.description}
          </p>
        </div>

        <Image
          src={market.image}
          alt={market.alt}
          width={market.width}
          height={market.height}
          sizes="(min-width: 1280px) 420px, (min-width: 768px) 38vw, 66vw"
          className={cn(
            "metal-float pointer-events-none absolute z-0 h-auto transition-transform duration-500 ease-out group-hover/tile:scale-[1.05]",
            market.markClassName
          )}
          style={{ "--float-delay": market.delay }}
        />

        <TileCta compact={market.compactCta} className="relative z-10 mt-auto">
          {market.cta}
        </TileCta>
      </Tile>
    </RevealItem>
  );
}

function ForexTile() {
  return (
    <RevealItem as="li" className="min-w-0 list-none md:col-span-2 xl:col-span-7">
      <Tile
        href="/markets/forex"
        label="Explore Forex"
        className="min-h-[380px] p-6 sm:p-8 md:min-h-[400px]"
      >
        <div className="relative z-10 mb-5 sm:mb-6 sm:max-w-[46%]">
          <TileCount icon={Send} count="70+" label="Currency pairs" />

          <h3 className="mt-5 text-[36px] leading-[1.02] font-bold tracking-[-0.035em] text-ink md:text-[44px]">
            Forex
          </h3>

          <TileRule />

          <p className="mt-4 max-w-[38ch] text-[14.5px] leading-relaxed text-body sm:max-w-[27ch]">
            Majors, minors and exotics with spreads from 0.0 pips, deep
            liquidity and execution measured in milliseconds.
          </p>
        </div>

        <ForexMark />

        <TileCta className="relative z-10 mt-auto pt-5 sm:pt-0">Explore Forex</TileCta>
      </Tile>
    </RevealItem>
  );
}

export function Markets() {
  return (
    <Section
      id="markets"
      className="platinum-wash border-y border-line"
      title={<>One platform. Every major market.</>}
      lead="Forex, indices, crypto, shares, metals and energy from a single MetaTrader 5 account—one balance, one margin pool, one login."
      aside={
        <Button href="/markets" size="md" arrow>
          Explore all instruments
        </Button>
      }
    >
      <RevealGroup
        as="ul"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-12"
      >
        <ForexTile />
        {MARKETS.map((market) => (
          <MarketTile key={market.id} market={market} />
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-8 text-center text-[13.5px] text-muted">
        Spreads, swaps and margin requirements for every instrument are listed in
        the{" "}
        <a
          href="/markets"
          className="font-semibold text-brand underline-offset-4 hover:underline"
        >
          full contract specification
        </a>
        .
      </Reveal>
    </Section>
  );
}
