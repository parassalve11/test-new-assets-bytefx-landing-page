import Link from "next/link";
import { ArrowRight, CalendarClock, Calculator, Newspaper } from "lucide-react";
import { Section } from "@/components/ui/section";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Trading tools",
  description:
    "Position size, margin and profit calculators, the economic calendar and market news — the working tools that sit beside the platform.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    href: "/tools/calculators",
    icon: Calculator,
    title: "Calculators",
    copy: "Pip value, required margin and profit/loss. Each one prints the arithmetic it used, so you can check the answer rather than trust it.",
    state: "Ready",
  },
  {
    href: "/tools/calendar",
    icon: CalendarClock,
    title: "Economic calendar",
    copy: "The releases that move the pairs you trade, and the session clock that says which markets are open right now.",
    state: "Session clock live",
  },
  {
    href: "/tools/news",
    icon: Newspaper,
    title: "Market news",
    copy: "What actually moves each asset class, and where the headline risk sits in a normal trading week.",
    state: "Briefings live",
  },
];

export default function ToolsPage() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}
        title="Tools that do the arithmetic, not the deciding."
        lead="Sizing a position and knowing when the market is open are mechanical problems. These pages solve those, and leave the judgement to you."
      />

      <Section title="What's here">
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {TOOLS.map((t) => (
            <RevealItem key={t.href}>
              <Link
                href={t.href}
                className="group flex h-full flex-col rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-[var(--sh-lg)] motion-reduce:transform-none"
              >
                <span className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand">
                    <t.icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="rounded-full bg-go/10 px-2.5 py-1 text-[11px] font-semibold text-go-600">
                    {t.state}
                  </span>
                </span>

                <span className="mt-5 block text-[20px] leading-[1.2] font-bold tracking-[-0.025em] text-ink transition-colors group-hover:text-brand">
                  {t.title}
                </span>
                <span className="mt-2.5 block flex-1 text-[14.5px] leading-relaxed text-body">
                  {t.copy}
                </span>

                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand">
                  Open
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

      <FinalCta />
    </main>
  );
}
