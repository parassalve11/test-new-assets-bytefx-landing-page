import { Check, MonitorSmartphone, ShieldCheck, Timer } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

/**
 * The demo account, as a section rather than a page, so it can sit at the foot
 * of `/account-types` under the `#demo` anchor the navbar points at and also
 * carry `/demo` on its own.
 *
 * ## What is deliberately not claimed
 *
 * TODO [PRODUCT]: the **virtual starting balance**, the **expiry policy** and
 * whether a demo can be reset or topped up are not stated anywhere on this
 * site, and they are the three things a visitor actually asks about a demo. I
 * have not invented numbers for them. The copy below says only what is
 * already true elsewhere on the site — same platform, same instruments,
 * simulated money — and the last card names the gap in plain words rather
 * than papering over it. Fill it in and delete that card.
 */

const POINTS = [
  {
    icon: MonitorSmartphone,
    title: "The same platform, not a sandbox",
    copy: "MetaTrader 5 and TradingView, the same instruments and the same charts as a live account. Nothing you learn here has to be relearned later.",
  },
  {
    icon: ShieldCheck,
    title: "Simulated money, real mechanics",
    copy: "Orders, margin, stops and liquidation behave the way they will on a funded account — you just cannot lose anything finding that out.",
  },
  {
    icon: Timer,
    title: "Open in minutes",
    copy: "No deposit and no funding step. You are placing your first order well before a live account would have cleared.",
  },
];

const CAVEATS = [
  "Demo fills are simulated. A live account meets real liquidity, and in fast markets that difference is the whole lesson.",
  "Demo trading carries no financial risk, which also means it does not teach you how you behave when the money is yours.",
];

export function DemoAccount({ id = "demo" }) {
  return (
    <Section
      id={id}
      bg="alt"
      title="Try it on a demo first"
      lead="A demo account runs the same platform on simulated funds. It is the honest way to find out whether ByteFX suits how you trade, before any money moves."
    >
      <RevealGroup className="grid gap-5 md:grid-cols-3">
        {POINTS.map((p) => (
          <RevealItem
            key={p.title}
            className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand">
              <p.icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="mt-5 text-[18px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
              {p.title}
            </p>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-body">
              {p.copy}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Saying what a demo cannot do is the reason to trust what it can. */}
      <Reveal
        delay={0.08}
        className="mt-6 rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
      >
        <p className="eyebrow">What a demo will not tell you</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {CAVEATS.map((c) => (
            <li
              key={c}
              className="flex gap-2.5 text-[14.5px] leading-relaxed text-body"
            >
              <Check
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-go-600"
                strokeWidth={2.75}
              />
              {c}
            </li>
          ))}
        </ul>

        {/* TODO [PRODUCT]: delete this block once the demo terms are signed
            off. It is here so the page does not quietly imply an unlimited,
            unexpiring demo that nobody has actually promised. */}
        <p className="mt-6 border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
          Starting virtual balance, how long a demo stays open and whether it
          can be reset are set at account opening. Ask support for the current
          terms before you rely on them.
        </p>
      </Reveal>

      <Reveal
        delay={0.12}
        className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Button href="/signup?type=demo" size="lg" arrow>
          Open a demo account
        </Button>
        <Button href="/signup" variant="ghost" size="lg">
          Go straight to live
        </Button>
      </Reveal>
    </Section>
  );
}
