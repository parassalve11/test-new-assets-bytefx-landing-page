import { notFound } from "next/navigation";
import { MarketPage } from "@/components/site/MarketPage";
import { FinalCta } from "@/components/site/FinalCta";
import { MARKETS, getMarket } from "@/lib/markets-data";

/**
 * Six market pages from one route. They are the same page with different data
 * — see the note at the top of `lib/markets-data.js` for why that is a feature
 * and not a shortcut.
 */
export function generateStaticParams() {
  return MARKETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) return {};

  return {
    title: `${market.title} trading`,
    description: market.lead,
    alternates: { canonical: `/markets/${market.slug}` },
  };
}

export default async function MarketRoute({ params }) {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) notFound();

  return (
    <main>
      <MarketPage market={market} />
      <FinalCta />
    </main>
  );
}
