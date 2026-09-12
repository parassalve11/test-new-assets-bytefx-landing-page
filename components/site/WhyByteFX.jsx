"use client";

import { Banknote, Headphones, Landmark, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/section";
import { CountUp } from "@/components/ui/count-up";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

/**
 * Elefin's rule: the number is the headline, the label is secondary.
 * Deliberately no glow here — the bento showpiece is spent on Markets.
 */
const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Negative balance protection",
    copy: "Your account cannot be driven below zero by a gap or a spike.",
  },
  {
    icon: Landmark,
    title: "Segregated client funds",
    copy: "Client money is held separately from company operating capital.",
  },
  {
    icon: Banknote,
    title: "No internal deposit fee",
    copy: "ByteFX charges nothing to fund your account, on any method.",
  },
  {
    icon: Headphones,
    title: "24/6 dedicated support",
    copy: "Real people on chat and email through every trading session.",
  },
];

const EXECUTION = [
  { label: "ByteFX", ms: 20, width: "21%", brand: true },
  { label: "Industry average", ms: 95, width: "100%", brand: false },
];

export function WhyByteFX() {
  return (
    <Section
      id="why"
      title={
        <>
          Conditions you can measure, not adjectives.
        </>
      }
      lead="Execution speed, spread and leverage are the only things that change your P&L. Here is where we sit on all three."
    >
      <RevealGroup className="grid gap-4 lg:grid-cols-3">
        {/* Anchor tile ------------------------------------------------ */}
        <RevealItem className="card-fade-green rounded-2xl border border-line p-7 shadow-sm md:p-9 lg:col-span-2">
          <p className="tnum h-display text-ink">
            <CountUp value={20} prefix="~" suffix="ms" />
          </p>
          <p className="eyebrow mt-3">Average order execution</p>
          <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-body">
            Orders route to our liquidity pool over a co-located bridge. Faster
            fills mean less slippage between the price you click and the price
            you get.
          </p>

          <div className="mt-8 space-y-4">
            {EXECUTION.map((row) => (
              <div key={row.label}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[13px] font-medium text-ink">
                    {row.label}
                  </span>
                  <span className="tnum text-[13px] font-semibold text-body">
                    {row.ms} ms
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sunken">
                  <div
                    className={
                      row.brand
                        ? "h-full rounded-full bg-brand"
                        : "h-full rounded-full bg-line-strong"
                    }
                    style={{ width: row.width }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-muted">
            ByteFX figure measured on market orders across major FX pairs.
            Industry average is indicative and varies by broker and instrument.
          </p>
        </RevealItem>

        {/* Two supporting numbers ------------------------------------- */}
        <RevealItem className="grid gap-4">
          <div className="rounded-2xl border border-line bg-surface p-7 shadow-sm">
            <p className="tnum text-[clamp(38px,4.4vw,52px)] leading-none font-bold tracking-[-0.03em] text-ink">
              <CountUp value={0} decimals={1} suffix=" pips" />
            </p>
            <p className="eyebrow mt-2.5">Raw spreads from</p>
            <p className="mt-3 text-[14px] leading-relaxed text-body">
              On Raw accounts, with an $8 round-turn commission per lot.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-7 shadow-sm">
            <p className="tnum text-[clamp(38px,4.4vw,52px)] leading-none font-bold tracking-[-0.03em] text-ink">
              <CountUp value={2000} prefix="1:" group={false} />
            </p>
            <p className="eyebrow mt-2.5">Maximum leverage</p>
            <p className="mt-3 text-[14px] leading-relaxed text-body">
              Available on selected instruments. Leverage magnifies losses as
              well as gains.
            </p>
          </div>
        </RevealItem>
      </RevealGroup>

      {/* Guarantees row ---------------------------------------------- */}
      <RevealGroup className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GUARANTEES.map((g) => {
          const Icon = g.icon;
          return (
            <RevealItem
              key={g.title}
              className="rounded-2xl border border-line bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-go-50 text-go-600">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <p className="mt-4 text-[15.5px] leading-snug font-semibold text-ink">
                {g.title}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-body">
                {g.copy}
              </p>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
