import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { InstrumentIcon } from "@/components/ui/asset-icon";
import { FinalCta } from "@/components/site/FinalCta";
import { MARKETS } from "@/lib/markets-data";

export const metadata = {
  title: "Markets",
  description:
    "Forex, crypto, shares, indices, metals and energy — 150+ instruments on one account and one margin pool, on MetaTrader 5 and TradingView.",
  alternates: { canonical: "/markets" },
};

/**
 * The directory the six market pages hang off. `Markets.jsx` on the landing
 * page is the *pitch* for the asset classes; this is the index, so it does not
 * repeat that argument — it lists what is there and gets out of the way.
 */
export default function MarketsPage() {
  return (
    <main>
      <section className="relative -mt-[84px] overflow-hidden pt-[84px] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="hero-tools absolute inset-0" />
          <div className="hero-tools-grid absolute inset-0" />
          <div className="hero-scrim absolute inset-0" />
        </div>

        <div className="container-x relative py-16 md:py-20">
          <h1 className="h-section text-balance-i max-w-[18ch] text-white">
            Every market, one balance.
          </h1>
          <p className="text-balance-i mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-white/80">
            150+ instruments across six asset classes. They share a single
            margin pool, so your capital is not split between venues, and they
            all open in MetaTrader 5 and TradingView.
          </p>
        </div>
      </section>

      <Section
        title="Choose a market"
        lead="Each page carries live indicative prices for that class, a sortable instrument table, and the session clock."
      >
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MARKETS.map((m) => (
            <RevealItem key={m.slug}>
              <Link
                href={`/markets/${m.slug}`}
                className="group flex h-full flex-col rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-[var(--sh-lg)] motion-reduce:transform-none"
              >
                <span className="flex items-center gap-2">
                  {m.symbols.slice(0, 3).map((s) => (
                    <InstrumentIcon key={s.symbol} symbol={s.symbol} size="sm" />
                  ))}
                </span>

                <span className="mt-5 block text-[20px] leading-[1.2] font-bold tracking-[-0.025em] text-ink transition-colors group-hover:text-brand">
                  {m.name}
                </span>
                <span className="mt-2.5 block flex-1 text-[14.5px] leading-relaxed text-body">
                  {m.lead}
                </span>

                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand">
                  View {m.name.toLowerCase()}
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

        <p className="mt-8 text-[13px] leading-relaxed text-muted">
          Instrument availability depends on your account type and jurisdiction.
          Maximum leverage depends on instrument class and account equity.
          Trading on leverage carries a high level of risk.
        </p>
      </Section>

      <FinalCta />
    </main>
  );
}
