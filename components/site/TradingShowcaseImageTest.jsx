import Image from "next/image";

/**
 * TEMPORARY — IMAGE TEST ONLY. Not the shipping showcase section.
 *
 * The "Trade with Better Conditions" bento rebuilt as four pre-rendered banners
 * (public/assets/experiment/30–33.webp). The real component is
 * `components/site/TradingShowcase.jsx` — untouched, still in the codebase,
 * along with its CSS module.
 *
 * Image → card mapping:
 *   30.webp  Trade with Better Conditions   31.webp  ByteFX Enhanced Trading Tools
 *   32.webp  Compete. Trade. Win.           33.webp  Copy Top Traders. Grow Together.
 *
 * WHY THIS IS NOT A REAL BENTO
 * A bento grid is built from tiles of *different shapes* — a wide one, a tall
 * one, a square. All four banners are 4000x2250, one single 16:9 ratio, with
 * the copy and CTA composed edge to edge inside it. A fixed ratio only gives
 * you one shape: change a tile's width and its height changes with it. The only
 * way to get a second shape out of these files is to crop, and there is nothing
 * safe to crop — 33.webp has a speech bubble at the top edge and a painted
 * button near the bottom, so taking it to 21:9 clips both. 30 and 32 are the
 * same story.
 *
 * So this is the closest zero-crop approximation: a mirrored 7/5 stagger.
 * Row one runs wide-then-narrow, row two narrow-then-wide, and the narrow tile
 * in each row is centred against the taller one. The size difference is real
 * and the rhythm alternates, which reads as a composed layout rather than a
 * 2x2 — but the tiles are still all one shape, and no CSS changes that.
 *
 * To get an actual bento, the artwork has to come back in more than one ratio.
 * The spec to hand back is in the chat.
 *
 * Two things carried over deliberately:
 *  - every card repeats its copy in an `sr-only` span. Baked-in text is
 *    invisible to screen readers and to crawlers, so this section would
 *    otherwise contribute no indexable words.
 *  - 33.webp has a "Start Copy Trading Now!" button painted into it, but the
 *    live CopyCard is not a link and has no destination. Pointing it at
 *    /getting-started for now so the painted button isn't dead; change or drop
 *    it once there's a real copy-trading route.
 */

const SHOWCASE_BANNERS = [
  {
    id: "conditions",
    href: "/getting-started",
    label: "Start trading with ByteFX",
    image: "/assets/experiment/30.webp",
    alt: "Two ByteFX traders holding phones, one powerful platform, trade anytime anywhere",
    copy: "Trade with Better Conditions. Tighter spreads, faster execution, and lower costs on every trade. Start trading with ByteFX.",
    span: "lg:col-span-7",
    sizes: "(min-width: 1100px) 860px, 100vw",
  },
  {
    id: "tools",
    href: "#platforms",
    label: "Explore ByteFX trading tools",
    image: "/assets/experiment/31.webp",
    alt: "The ByteFX platform shown on a phone, a laptop and a tablet",
    copy: "ByteFX Enhanced Trading Tools. Powerful platforms and market tools designed to keep you ahead of every move. Explore tools.",
    span: "lg:col-span-5 lg:self-center",
    sizes: "(min-width: 1100px) 615px, 100vw",
  },
  {
    id: "competition",
    href: "/competition",
    label: "Join the ByteFX trading competition",
    image: "/assets/experiment/32.webp",
    alt: "Celebrating traders holding phones beside a $100,000+ prize pool trophy",
    copy: "Compete. Trade. Win. Join live trading competitions and compete for your share of exciting cash prizes. Join competition.",
    span: "lg:col-span-5 lg:self-center",
    sizes: "(min-width: 1100px) 615px, 100vw",
  },
  {
    id: "copy-trading",
    href: "/getting-started",
    label: "Start copy trading with ByteFX",
    image: "/assets/experiment/33.webp",
    alt: "A ByteFX copy trader with a dollar coin and a Bitcoin coin",
    copy: "Copy Top Traders. Grow Together. Follow proven strategies and mirror experienced traders while staying in control.",
    span: "lg:col-span-7",
    sizes: "(min-width: 1100px) 860px, 100vw",
  },
];

/**
 * One banner card. Border, radius, shadow and the 4px hover lift are matched to
 * `.card` in TradingShowcase.module.css so the test section still sits in the
 * page like the real one.
 */
function BannerCard({ card }) {
  return (
    <a
      href={card.href}
      aria-label={card.label}
      className={`group/card relative block min-w-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.045)] outline-none transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.14)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${card.span}`}
    >
      <Image
        src={card.image}
        alt={card.alt}
        width={4000}
        height={2250}
        sizes={card.sizes}
        className="h-auto w-full transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
      />
      <span className="sr-only">{card.copy}</span>
    </a>
  );
}

export function TradingShowcaseImageTest() {
  return (
    <section
      id="trading-showcase"
      className="bg-alt px-6 pt-[18px] pb-4"
      aria-labelledby="trading-showcase-title"
    >
      <h2 id="trading-showcase-title" className="sr-only">
        Everything you need to trade, grow, and earn with ByteFX
      </h2>

      <div className="mx-auto grid w-full max-w-[1512px] grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {SHOWCASE_BANNERS.map((card) => (
          <BannerCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
