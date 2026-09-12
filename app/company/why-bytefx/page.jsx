import { WhyByteFX } from "@/components/site/WhyByteFX";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Why ByteFX",
  description:
    "~20ms average execution, raw spreads from 0.0 pips and leverage up to 1:2000 — the conditions that actually move your P&L, stated as numbers.",
};

export default function WhyByteFXPage() {
  return (
    <main>
      <WhyByteFX />
      <FinalCta />
    </main>
  );
}
