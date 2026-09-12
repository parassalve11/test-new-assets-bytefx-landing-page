import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { InstrumentIcon } from "@/components/ui/asset-icon";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";
import { MARKETS } from "@/lib/markets-data";

export const metadata = {
  title: "Market news",
  description:
    "What actually moves each asset class, and where the scheduled risk sits in a normal trading week — a standing briefing rather than a headline feed.",
  alternates: { canonical: "/tools/news" },
};

/**
 * ## Why this page has no headlines
 *
 * A news feed needs a wire, and there isn't one. Inventing headlines on a
 * broker's site is not a placeholder, it is fabricated financial reporting —
 * so this page ships what can be said truthfully instead: a standing briefing
 * on what moves each class we list, which is the thing a headline feed is
 * usually being read *for*.
 *
 * TODO [PRODUCT]: when a wire is connected, put the live feed above
 * `DRIVERS` and keep this section underneath as the explainer. Do not delete
 * it — it is the part that dates well.
 */

const DRIVERS = [
  {
    slug: "forex",
    symbol: "EUR/USD",
    title: "Forex",
    driver: "Interest rate expectations",
    copy: "A currency pair is a bet on the gap between two central banks. Rate decisions, inflation prints and employment data move that gap; almost everything else is noise around it.",
  },
  {
    slug: "commodities",
    symbol: "XAU/USD",
    title: "Metals",
    driver: "Real yields and the dollar",
    copy: "Gold pays no coupon, so it competes with inflation-adjusted bond yields. When real yields fall or the dollar weakens, gold usually has its best days.",
  },
  {
    slug: "indices",
    symbol: "NAS100",
    title: "Indices",
    driver: "Earnings and the discount rate",
    copy: "An index price is future earnings discounted back to today. Earnings season moves the numerator, rate expectations move the denominator — and the denominator moves faster.",
  },
  {
    slug: "energy",
    symbol: "WTI",
    title: "Energy",
    driver: "Supply decisions and inventories",
    copy: "Crude responds to production policy, weekly inventory data and anything that threatens a shipping route. Demand moves it too, but far more slowly.",
  },
  {
    slug: "crypto",
    symbol: "BTC/USD",
    title: "Crypto",
    driver: "Liquidity and risk appetite",
    copy: "The majors trade as the high-beta end of risk assets. They tend to move with equities and against the dollar, only further in both directions.",
  },
  {
    slug: "stocks",
    symbol: "AAPL",
    title: "Shares",
    driver: "Results, guidance and sector rotation",
    copy: "A single name moves on its own results and on what its guidance implies for the sector. Index moves explain a lot of any given day; the company explains the rest.",
  },
];

export default function NewsPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Market news" },
        ]}
        title="What moves what, before you read the headline."
        lead="A headline tells you something happened. This tells you why the instrument you hold cared — which is the part that transfers to the next headline."
      />

      <Section
        title="The standing briefing"
        lead="One driver per asset class we list. Not the only thing that matters, but the one that explains most days."
      >
        <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DRIVERS.map((d) => (
            <RevealItem key={d.slug}>
              <Link
                href={`/markets/${d.slug}`}
                className="group flex h-full flex-col rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-[var(--sh-lg)] motion-reduce:transform-none"
              >
                <span className="flex items-center gap-3">
                  <InstrumentIcon symbol={d.symbol} size="sm" />
                  <span className="text-[15.5px] font-semibold text-ink transition-colors group-hover:text-brand">
                    {d.title}
                  </span>
                </span>

                <span className="mt-5 block text-[18px] leading-[1.25] font-bold tracking-[-0.02em] text-ink">
                  {d.driver}
                </span>
                <span className="mt-2.5 block flex-1 text-[14.5px] leading-relaxed text-body">
                  {d.copy}
                </span>

                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand">
                  Trade {d.title.toLowerCase()}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section bg="alt" align="center" title="A live wire is not connected yet">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[15.5px] leading-relaxed text-body">
            ByteFX does not run a headline feed on this page, and we would
            rather say so than fill it with something that looks like one.
            Nothing here is a recommendation or a forecast. For the scheduled
            releases worth planning around, the{" "}
            <Link
              href="/tools/calendar"
              className="font-medium text-brand underline"
            >
              economic calendar
            </Link>{" "}
            has the recurring ones, and the session clock says what is open
            right now.
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            {MARKETS.length} asset classes, 150+ instruments, one margin pool.
            Trading on leverage carries a high level of risk.
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </main>
  );
}
