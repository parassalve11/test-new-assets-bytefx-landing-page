import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SessionClock } from "@/components/ui/session-clock";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Economic calendar",
  description:
    "Which FX sessions are open right now, and the recurring releases that move the majors — non-farm payrolls, CPI, central bank decisions and PMIs.",
  alternates: { canonical: "/tools/calendar" },
};

/**
 * ## Why this page has no event list
 *
 * A live economic calendar needs a data provider, and there isn't one wired
 * up. Rather than print a table of plausible-looking events with invented
 * times and forecasts — on a broker's own site, where a reader would
 * reasonably act on them — this page ships the two things that can be stated
 * truthfully today:
 *
 * 1. **The session clock**, which is computed from the reader's own clock and
 *    so is genuinely live and cannot go stale.
 * 2. **The recurring releases**, described by their published schedules. These
 *    are public facts about how often each release happens and roughly when,
 *    not forecasts and not a calendar of specific dates.
 *
 * TODO [PRODUCT]: wire a calendar provider and add the dated event table
 * above `RELEASES`. Keep the "no forecasts" position when you do — a
 * consensus number rendered next to a broker's logo is read as the broker's
 * view, whoever supplied it.
 */

const RELEASES = [
  {
    name: "US non-farm payrolls",
    cadence: "Monthly — first Friday",
    time: "13:30 UTC (12:30 UTC in US summer time)",
    why: "The single most reliably violent scheduled release for USD pairs, gold and the US indices. Spreads widen around it on every venue.",
  },
  {
    name: "US CPI",
    cadence: "Monthly — usually mid-month",
    time: "13:30 UTC (12:30 UTC in US summer time)",
    why: "Drives the rate expectations that price the dollar. A surprise here moves everything quoted against USD, which is most of the board.",
  },
  {
    name: "FOMC rate decision",
    cadence: "Eight scheduled meetings a year",
    time: "19:00 UTC, with the press conference 30 minutes later",
    why: "The statement moves the market and the press conference often moves it back. Both halves matter.",
  },
  {
    name: "ECB rate decision",
    cadence: "Eight monetary policy meetings a year",
    time: "Decision 12:15 UTC, press conference 12:45 UTC",
    why: "The euro's equivalent, and the main scheduled risk in EUR/USD and EUR crosses.",
  },
  {
    name: "Bank of England decision",
    cadence: "Eight meetings a year",
    time: "11:00 UTC",
    why: "Sterling's scheduled risk. The vote split is often the market-moving detail rather than the rate itself.",
  },
  {
    name: "PMIs (S&P Global / ISM)",
    cadence: "Monthly, around the start of the month",
    time: "Regional, through the European and US mornings",
    why: "A first read on activity before the hard data arrives. Moves currencies and indices more than the headline attention suggests.",
  },
];

export default function CalendarPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Economic calendar" },
        ]}
        title="Know when the market is open, and what is coming."
        lead="The session clock below is live — it reads your own device clock. Under it are the recurring releases that reliably move the majors."
      />

      <Section title="Sessions, right now" align="center">
        <Reveal>
          <SessionClock />
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mx-auto mt-5 max-w-xl text-center text-[13px] leading-relaxed text-muted">
            Windows are approximate and quoted in UTC; they do not shift with
            daylight saving. Liquidity is deepest where London and New York
            overlap, and thinnest in the hours after the New York close.
          </p>
        </Reveal>
      </Section>

      <Section
        bg="alt"
        title="The releases worth planning around"
        lead="Published schedules, not forecasts. Times are the usual slot — check the official source for a specific date before you trade it."
      >
        <RevealGroup className="grid gap-5 md:grid-cols-2">
          {RELEASES.map((r) => (
            <RevealItem
              key={r.name}
              className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <p className="text-[18px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
                {r.name}
              </p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium text-brand">
                <span>{r.cadence}</span>
                <span className="tnum text-muted">{r.time}</span>
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                {r.why}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[13px] leading-relaxed text-muted">
            ByteFX does not publish consensus forecasts and nothing here is a
            trade recommendation. A dated, filterable event feed is not
            connected yet — until it is, use the official statistical agency or
            central bank calendar for exact dates and times.
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </main>
  );
}
