import { AccountTypes } from "@/components/site/AccountTypes";
import { DemoAccount } from "@/components/site/DemoAccount";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Account types",
  description:
    "Standard from $20, Pro from $2,000 and Raw from $25,000 — spreads, commission, leverage and swap-free support compared side by side, plus the demo account.",
  alternates: { canonical: "/account-types" },
};

/**
 * The navbar links straight to `#standard`, `#pro`, `#raw` and `#demo`. The
 * first three are the card ids inside `AccountTypes`; the fourth is
 * `DemoAccount`. Keep those anchors — four menu items depend on them.
 */
export default function AccountTypesPage() {
  return (
    <main>
      <AccountTypes />
      <DemoAccount />
      <FinalCta />
    </main>
  );
}
