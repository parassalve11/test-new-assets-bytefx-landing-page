import { Funding } from "@/components/site/Funding";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Funding and withdrawals",
  description:
    "Card, bank wire, USDT and crypto — ByteFX charges no fee of its own on deposits. Providers and banks apply their own fees and cut-off times.",
  alternates: { canonical: "/funding" },
};

/**
 * `Funding.jsx` links here from its own footnote on the landing page, for the
 * reader who wants the detail rather than the summary. It is the same section
 * rather than a second version of it — the withdrawal windows in that
 * component are the ones pending compliance sign-off, and they must not end up
 * stated twice with two different numbers.
 */
export default function FundingPage() {
  return (
    <main>
      <Funding />
      <FinalCta />
    </main>
  );
}
