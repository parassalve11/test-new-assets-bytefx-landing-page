import { Section } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/** Single source of truth: renders the accordion and the FAQPage JSON-LD. */
const FAQS = [
  {
    q: "What is the minimum deposit to start trading?",
    a: "$20 on a Standard account. Pro accounts start at $2,000 and Raw accounts at $25,000, which buys tighter spreads rather than different market access.",
  },
  {
    q: "How long do withdrawals take?",
    a: "Crypto and USDT withdrawals are typically processed within an hour. Card and bank withdrawals take one to three business days depending on your bank. ByteFX does not charge a withdrawal fee.",
  },
  {
    q: "Which markets can I trade with ByteFX?",
    a: "Over 150 instruments across six asset classes: 70+ forex pairs, 500+ share CFDs, 12+ indices, metals and soft commodities, energy, and 25+ cryptocurrencies — all from one account.",
  },
  {
    q: "What leverage is available?",
    a: "Up to 1:2000 on selected instruments. Maximum leverage varies by instrument class and account equity. Leverage magnifies losses as well as gains, so size positions accordingly.",
  },
  {
    q: "Are client funds held separately from company funds?",
    a: "Client money is held in segregated accounts, separate from ByteFX operating capital. Full details are set out in our Terms & Conditions.",
  },
  {
    q: "Do you offer swap-free (Islamic) accounts?",
    a: "Swap-free support is available on Standard and Raw accounts. Contact support to have it enabled on your account.",
  },
  {
    q: "Which trading platforms does ByteFX support?",
    a: "MetaTrader 5 on Windows, macOS, iOS and Android, plus ByteFX WebTrader in the browser and the ByteFX mobile app. All of them run the same account and the same positions.",
  },
  {
    q: "Is there a demo account?",
    a: "Yes. Demo accounts use live market prices with virtual funds, so you can test a strategy or learn the platform before funding a live account.",
  },
  {
    q: "Which countries are restricted?",
    a: "ByteFX does not offer services to residents of the UAE, India, USA, China, Iran, North Korea, or other sanctioned regions.",
  },
];

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal as="h2" className="h-section">
            Questions, answered before you ask.
          </Reveal>
          <Reveal
            as="p"
            delay={0.05}
            className="mt-4 text-[16.5px] leading-relaxed text-body"
          >
            Still stuck? Our team is on chat and email 24 hours a day, six days
            a week.
          </Reveal>
          <Button
            href="/company/contact"
            variant="ghost"
            size="md"
            arrow
            className="mt-6"
          >
            Contact the team
          </Button>
        </div>

        <Reveal delay={0.08}>
          <Accordion items={FAQS} defaultOpen={0} />
        </Reveal>
      </div>
    </Section>
  );
}
