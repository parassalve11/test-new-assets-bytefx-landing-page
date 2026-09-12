import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PageHero } from "@/components/site/ToolsHero";

export const metadata = {
  title: "Contest rules",
  description:
    "How the ByteFX trading contest works, who can enter, and where the binding rules for the current round come from.",
  alternates: { canonical: "/competition/rules" },
};

/**
 * TODO [LEGAL]: **the binding contest rules are not published here**, because
 * they have not been written. Round dates, the qualifying period, eligible
 * account types, the ranking metric, prize values and the tax position are all
 * unspecified — the same outstanding item flagged for the Thailand campaign in
 * `Thailand.jsx`.
 *
 * A prize competition is a promotion with legal consequences in most
 * jurisdictions, and rules invented for a placeholder are exactly the kind of
 * thing an entrant relies on and a regulator reads. So this page states the
 * structure that is genuinely settled, names every gap explicitly, and sends
 * the reader to support for the round they are actually entering.
 *
 * When the rules exist: replace `OPEN_ITEMS` with the executed terms and keep
 * `STRUCTURE` as the plain-language summary above them.
 */

const STRUCTURE = [
  {
    title: "You trade your own live account",
    copy: "The contest ranks activity on a funded ByteFX account. There is no separate contest account and no separate balance — the positions are real and so are the results, in both directions.",
  },
  {
    title: "Entry is free",
    copy: "There is no entry fee and no separate deposit required to be ranked. Standard account minimums still apply to the account itself.",
  },
  {
    title: "One account per entrant",
    copy: "Ranking multiple accounts belonging to the same person, or trading opposing positions across them to guarantee a placing, disqualifies all of them.",
  },
  {
    title: "Results are final on verification",
    copy: "Placings are confirmed after the round closes and after trade activity has been checked. A placing shown on a live leaderboard is provisional.",
  },
];

const OPEN_ITEMS = [
  "The start and end dates of the current round, and the qualifying period within it",
  "Which account types are eligible, and any minimum volume to be ranked",
  "The ranking metric — return percentage, absolute profit, or risk-adjusted",
  "Prize values, how they are paid, and the tax position in your country",
  "Eligible jurisdictions, which is not the same list as the ones we accept accounts from",
];

export default function CompetitionRulesPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Competition", href: "/competition" },
          { label: "Rules" },
        ]}
        title="How the contest works — and what is still to be confirmed."
        lead="The structure below holds for every round. The specifics of the round you are entering come from support, in writing, before you enter."
      />

      <Section title="The structure">
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {STRUCTURE.map((s) => (
            <RevealItem
              key={s.title}
              className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <p className="text-[18px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
                {s.title}
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                {s.copy}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section
        bg="alt"
        title="Not yet published"
        lead="These are the terms that decide who wins and what they get. We would rather list them as outstanding than print numbers nobody has agreed."
      >
        <Reveal className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)] md:p-9">
          <ul className="space-y-4">
            {OPEN_ITEMS.map((o) => (
              <li
                key={o}
                className="flex gap-3.5 text-[15px] leading-relaxed text-body"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong"
                />
                {o}
              </li>
            ))}
          </ul>

          <p className="mt-7 border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
            Contest trading is trading. Positions opened to climb a leaderboard
            carry the same risk as any other position, and the risk of ruin
            rises sharply when the goal is a placing rather than a return —
            read the{" "}
            <Link
              href="/legal/risk"
              className="font-medium text-brand underline"
            >
              risk disclosure
            </Link>{" "}
            before you enter.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/support" size="lg" arrow>
            Ask support for this round
          </Button>
          <Button href="/competition" variant="ghost" size="lg">
            Back to the contest
          </Button>
        </Reveal>
      </Section>
    </main>
  );
}
