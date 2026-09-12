import { DemoAccount } from "@/components/site/DemoAccount";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Demo account",
  description:
    "A ByteFX demo runs MetaTrader 5 and TradingView on simulated funds — the same instruments and the same mechanics, with nothing at risk.",
  alternates: { canonical: "/demo" },
};

/**
 * `/demo` and `/account-types#demo` are both real entry points — the hero and
 * the market pages link to the first, the navbar to the second — and they
 * render the same `DemoAccount` section rather than two versions of it.
 */
export default function DemoPage() {
  return (
    <main>
      <DemoAccount />
      <FinalCta />
    </main>
  );
}
