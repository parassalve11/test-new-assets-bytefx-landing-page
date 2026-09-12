import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * TEMPORARY — IMAGE TEST ONLY. Not the shipping Markets section.
 *
 * This is the "One platform. Every major market." bento rebuilt as five
 * pre-rendered banners (public/assets/experiment/25–29.webp) instead of five
 * composed tiles. The real component is `components/site/Markets.jsx`; it is
 * untouched and still in the codebase. To revert, swap the two lines in
 * app/page.jsx back and delete this file plus public/assets/experiment/.
 *
 * Image → tile mapping:
 *   25.webp  Forex             26.webp  Indices      27.webp  Crypto
 *   28.webp  Stocks            29.webp  Commodities
 *
 * Layout note: every supplied banner is 4000x2250 (16:9), and each one already
 * has its count, title, rule, sentence and CTA baked into the pixels. That
 * changes what the grid can do. The live bento runs 7+5 on the top row and
 * 4+4+4 underneath, which works because those tiles compose their own height.
 * Fixed-ratio images can't: a 7-col and a 5-col image in the same row are 394px
 * and 281px tall, so the row either goes ragged or the shorter one gets cropped
 * ~30% off its right edge — which is exactly where the artwork sits. So the top
 * row here is 6+6 (equal width, therefore equal height, zero crop) and the
 * bottom row stays 4+4+4. Same two-then-three bento rhythm, nothing cut off.
 *
 * The copy that used to be live text is repeated in a `sr-only` span on each
 * tile. Text inside a raster image is invisible to screen readers and to search
 * crawlers, so without this the section reads as five unlabelled links.
 */

const MARKET_BANNERS = [
  {
    id: "forex",
    href: "/markets/forex",
    label: "Explore Forex",
    image: "/assets/experiment/25.webp",
    alt: "Forex — 70+ currency pairs, with dollar, euro and yen coins over a rising candlestick chart",
    copy: "Forex. 70+ currency pairs. Majors, minors and exotics with spreads from 0.0 pips, deep liquidity and execution measured in milliseconds.",
    span: "xl:col-span-6",
    sizes: "(min-width: 1280px) 600px, (min-width: 768px) 48vw, 100vw",
  },
  {
    id: "indices",
    href: "/markets/indices",
    label: "Explore Indices",
    image: "/assets/experiment/26.webp",
    alt: "Indices — 12+ global indices, with S&P 500, Nasdaq 100, Dow Jones and FTSE 100 medallions",
    copy: "Indices. 12+ global indices. S&P 500, Nasdaq 100, Dow and FTSE — spot and futures.",
    span: "xl:col-span-6",
    sizes: "(min-width: 1280px) 600px, (min-width: 768px) 48vw, 100vw",
  },
  {
    id: "crypto",
    href: "/markets/crypto",
    label: "Explore Crypto",
    image: "/assets/experiment/27.webp",
    alt: "Crypto — 25+ crypto CFDs, with Bitcoin, Ethereum, Solana and Tether coins",
    copy: "Crypto. 25+ crypto CFDs. Bitcoin, Ethereum, Solana and Tether, around the clock.",
    span: "xl:col-span-4",
    sizes: "(min-width: 1280px) 400px, (min-width: 768px) 48vw, 100vw",
  },
  {
    id: "stocks",
    href: "/markets/stocks",
    label: "Explore Stocks",
    image: "/assets/experiment/28.webp",
    alt: "Stocks — 500+ share CFDs, with Apple, NVIDIA, Tesla, Microsoft, Google, Meta and Amazon marks",
    copy: "Stocks. 500+ share CFDs. Long or short on the largest US, UK and European names.",
    span: "xl:col-span-4",
    sizes: "(min-width: 1280px) 400px, (min-width: 768px) 48vw, 100vw",
  },
  {
    id: "commodities",
    href: "/markets/commodities",
    label: "Explore Commodities",
    image: "/assets/experiment/29.webp",
    alt: "Commodities — XAU, XAG, WTI and Brent, with gold and silver bars in a crude oil splash",
    copy: "Metals & Energy. XAU, XAG, WTI and Brent. Gold, silver, crude and natural gas at institutional pricing.",
    span: "xl:col-span-4",
    sizes: "(min-width: 1280px) 400px, (min-width: 768px) 48vw, 100vw",
  },
];

/**
 * The tile is the anchor and the banner is its only child, so there is no
 * padding, no `market-plate` surface and no copy column here — the plate is
 * part of the artwork now. Hover keeps the live section's language: the card
 * lifts, the shadow deepens, and the image takes a small scale so the corner
 * fill never shows through during the transform.
 */
function BannerTile({ tile }) {
  return (
    <RevealItem as="li" className={cn("min-w-0 list-none", tile.span)}>
      <a
        href={tile.href}
        aria-label={tile.label}
        className="group/tile relative block overflow-hidden rounded-[1.75rem] shadow-[0_18px_44px_-28px_rgba(1,6,26,0.28)] outline-none transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_64px_-30px_rgba(1,6,26,0.36)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        <Image
          src={tile.image}
          alt={tile.alt}
          width={4000}
          height={2250}
          sizes={tile.sizes}
          className="h-auto w-full transition-transform duration-500 ease-out group-hover/tile:scale-[1.03]"
        />
        <span className="sr-only">{tile.copy}</span>
      </a>
    </RevealItem>
  );
}

export function MarketsImageTest() {
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
        {MARKET_BANNERS.map((tile) => (
          <BannerTile key={tile.id} tile={tile} />
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
