import { Handshake, LineChart, Megaphone, Wallet } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Partnership",
  description:
    "Introduce traders to ByteFX and earn on their activity. Real-time reporting, a dedicated manager and marketing material that has been through compliance.",
  alternates: { canonical: "/partnership" },
};

/**
 * The IB / affiliate page. This was the single most load-bearing gap on the
 * site: seven links pointed here — four in `Navbar.jsx`, one in `Footer.jsx`
 * and both CTAs in the Thailand campaign, one of which targets `#terms`. Keep
 * that anchor.
 *
 * ## The numbers that are deliberately not here
 *
 * TODO [PRODUCT]: **no commission rate, rebate per lot, payout threshold or
 * payout schedule appears on this page**, because ByteFX has not published
 * any of them and a partner page is precisely where an invented number would
 * be relied on. The `#terms` section says so in plain words rather than
 * printing a plausible "up to $X per lot". Fill those in from the signed IB
 * agreement and delete the standing note there — do not fill them in from a
 * competitor's page.
 *
 * The Thailand campaign's own qualifying period and prize terms are a
 * separate outstanding item; see the note in `Thailand.jsx`.
 */

const STEPS = [
  {
    icon: Handshake,
    title: "Apply",
    copy: "Tell us how you reach traders — a community, a channel, a client book, a website. Approval is a conversation, not a form that auto-accepts.",
  },
  {
    icon: Megaphone,
    title: "Introduce",
    copy: "You get a tracked link and marketing material that has already been through compliance, so you are not writing risk warnings yourself.",
  },
  {
    icon: LineChart,
    title: "Track",
    copy: "Registrations, funded accounts and trading volume in one dashboard, updated as it happens rather than in a monthly statement.",
  },
  {
    icon: Wallet,
    title: "Get paid",
    copy: "Earnings accrue on the trading activity of the clients you introduced, and are withdrawn through the same methods the platform already supports.",
  },
];

const AUDIENCE = [
  {
    title: "Educators and analysts",
    copy: "You already explain the market to an audience that asks where you trade. This makes that answer worth something.",
  },
  {
    title: "Communities and channels",
    copy: "Telegram, Discord, YouTube — anywhere traders gather and compare brokers rather than being sold one.",
  },
  {
    title: "Regional introducers",
    copy: "Local-language support and payment methods matter more than a headline rate. If you know a market, you know that.",
  },
];

const FAQ = [
  {
    q: "What does it cost to become a partner?",
    a: "Nothing. There is no joining fee and no minimum volume to hold the status once you are approved.",
  },
  {
    q: "Do I need to be a licensed adviser?",
    a: "You are introducing traders, not advising them. That distinction matters legally: giving personalised investment advice without the right licence is a regulated activity in most jurisdictions, and the partner agreement does not permit it.",
  },
  {
    q: "How are my referrals tracked?",
    a: "Through a link unique to you. A client who registers through it is attributed to you, and you see their registration and trading activity — never their personal details or their balance.",
  },
  {
    q: "When do I find out what I earn?",
    a: "The commission structure is set out in the partner agreement you are sent on approval, and it is agreed before you introduce anyone. We do not publish a headline rate on this page because the structure depends on the markets you introduce and the volume involved.",
  },
  {
    q: "Can the clients I introduce still get support directly?",
    a: "Yes, and they should. They are ByteFX clients with the same 24/6 support as anyone else — you are not their support desk.",
  },
];

export default function PartnershipPage() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Partnership" }]}
        title="Introduce traders. Earn on what they actually do."
        lead="A partner programme for people who already have an audience that asks them where to trade — with real-time reporting and a manager who answers."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            href="/signup?type=partner"
            size="lg"
            arrow
            className="w-full sm:w-auto"
          >
            Apply to the programme
          </Button>
          <Button
            href="#terms"
            variant="onDark"
            size="lg"
            className="w-full sm:w-auto"
          >
            Read the terms
          </Button>
        </div>
      </PageHero>

      <Section title="How it works">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <RevealItem
              key={s.title}
              className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <span className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand">
                  <s.icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </span>
                <span
                  aria-hidden="true"
                  className="tnum text-[12px] font-semibold tracking-[0.08em] text-muted"
                >
                  0{i + 1}
                </span>
              </span>
              <p className="mt-5 text-[18px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
                {s.title}
              </p>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-body">
                {s.copy}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section bg="alt" title="Who this is for">
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {AUDIENCE.map((a) => (
            <RevealItem
              key={a.title}
              className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <p className="text-[18px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
                {a.title}
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                {a.copy}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section
        id="terms"
        title="The terms, plainly"
        lead="What we can tell you before you apply, and what is settled in the agreement itself."
      >
        <Reveal className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)] md:p-9">
          <p className="eyebrow">Commission</p>
          <p className="mt-4 text-[15.5px] leading-relaxed text-body">
            ByteFX does not publish a headline partner rate on this page. The
            structure — how you are paid, on what, and when — is set out in the
            partner agreement sent on approval and is agreed with you before you
            introduce a single client. A rate quoted on a marketing page and a
            rate in a signed agreement are not the same thing, and only one of
            them is enforceable.
          </p>

          <div className="mt-7 grid gap-5 border-t border-line pt-7 sm:grid-cols-2">
            <div>
              <p className="text-[15.5px] font-semibold text-ink">
                What you can rely on
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-body">
                No joining fee, no minimum volume to keep partner status, and
                reporting you can see for yourself rather than a statement you
                have to request.
              </p>
            </div>
            <div>
              <p className="text-[15.5px] font-semibold text-ink">
                What the agreement covers
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-body">
                Commission structure, payout schedule and threshold, permitted
                marketing conduct, and the jurisdictions you may introduce from.
                Read it before you sign it.
              </p>
            </div>
          </div>

          <p className="mt-7 border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
            Partners introduce clients; they do not advise them. Providing
            personalised investment advice without the appropriate licence is a
            regulated activity in most jurisdictions and is not permitted under
            the partner agreement. Trading on leverage carries a high level of
            risk, and any material you publish must carry that warning.
          </p>
        </Reveal>
      </Section>

      <Section bg="alt" title="Partner questions">
        <Reveal>
          <Accordion items={FAQ} />
        </Reveal>
      </Section>

      <FinalCta />
    </main>
  );
}
