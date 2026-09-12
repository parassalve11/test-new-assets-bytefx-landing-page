import { Calculators } from "@/components/site/Calculators";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Trading calculators",
  description:
    "Work out pip value, required margin and profit or loss before you place the trade. Every result shows the formula it used.",
  alternates: { canonical: "/tools/calculators" },
};

export default function CalculatorsPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Calculators" },
        ]}
        title="Know the number before you place the trade."
        lead="Pip value, margin and profit or loss — three calculators that show their working, so you can check the result instead of taking it on faith."
      />
      <Calculators />
      <FinalCta />
    </main>
  );
}
