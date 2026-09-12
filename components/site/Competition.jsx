"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Tabs } from "@/components/ui/tabs";
import { Flag, hasFlag } from "@/components/ui/flag-icons";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

/**
 * The ByteFX Trading Championship — a monthly, real-account contest ranked on
 * percentage return, presented with its leaderboard on `/competition`.
 *
 * It is deliberately two bands inside one `<section>` rather than two sections:
 * the photographic banner states the offer, and the leaderboard immediately
 * underneath is the proof. The root layout supplies the shared navbar/footer.
 *
 * **The artwork ships with a white frame baked in** (3.3% left/right, ~10%
 * top/bottom, plus rounded corners). `background.png` is the untouched original;
 * `background-trimmed.png` is that frame cropped off, and it is the one used
 * here. A full-bleed band cannot use the original: at viewport aspect ratios
 * near the source's own 4:3 the white edge creeps back into frame. If the art is
 * ever replaced, re-crop to the blue field or the seam returns.
 *
 * **The scrim is navy-blue, not black.** Thailand darkens toward `shell`
 * (rgba(1,6,26,…)) because it sits on turquoise water. Here the plate is already
 * a saturated blue and a neutral scrim greys it into slate, so this one ramps
 * through deep blue instead: white copy clears 14:1 on the left while the
 * trophy and globe keep their colour on the right.
 *
 * TODO [CLIENT]: every standing below is placeholder. Wire `DIVISIONS` to the
 * real contest feed before launch — a broker publishing invented results is a
 * compliance problem, not a copy problem. The prize ladder, the entry rules and
 * the "settles within five business days" line all need confirming too.
 */

/* Prize ladder, applied identically to all three divisions. Sums to $20,000 a
   division and so to the $60,000 headline — if you edit one, edit the headline. */
const PRIZES = [8000, 4000, 2500, 1500, 1200, 900, 700, 600, 400, 200];

const PRIZE_POOL = PRIZES.reduce((sum, p) => sum + p, 0) * 3;

/**
 * Handles, not names. Live broker contests publish nicknames because the
 * standings are public and the accounts behind them are not — keep it that way
 * when the real feed lands.
 */
const DIVISIONS = [
  {
    id: "standard",
    label: "Standard",
    note: "Zero commission, from $20.",
    rows: [
      { trader: "NakhonPip", country: "TH", ret: 94.6, lots: 184.2 },
      { trader: "VelocityRay", country: "SG", ret: 88.1, lots: 151.7 },
      { trader: "KiriBull", country: "TH", ret: 79.4, lots: 210.4 },
      { trader: "AndamanFX", country: "MY", ret: 71.8, lots: 96.8 },
      { trader: "TigerSpread", country: "VN", ret: 66.2, lots: 133.5 },
      { trader: "MekongQuant", country: "TH", ret: 61.5, lots: 88.1 },
      { trader: "GulfTrader", country: "AE", ret: 57.9, lots: 174.9 },
      { trader: "RiptideJK", country: "ID", ret: 54.3, lots: 120.6 },
      { trader: "SiamScalper", country: "TH", ret: 50.7, lots: 245.3 },
      { trader: "NorthStarFX", country: "PH", ret: 47.2, lots: 79.4 },
    ],
  },
  {
    id: "pro",
    label: "Pro",
    note: "Tighter spreads, from $2,000.",
    rows: [
      { trader: "AtlasCarry", country: "SG", ret: 72.3, lots: 612.8 },
      { trader: "BangkokDelta", country: "TH", ret: 68.9, lots: 508.3 },
      { trader: "HanoiEdge", country: "VN", ret: 63.4, lots: 447.1 },
      { trader: "PenangGrid", country: "MY", ret: 58.7, lots: 391.6 },
      { trader: "DubaiMomentum", country: "AE", ret: 55.1, lots: 528.9 },
      { trader: "ChaoPhrayaFX", country: "TH", ret: 51.6, lots: 366.2 },
      { trader: "MarinaBayQ", country: "SG", ret: 48.3, lots: 402.7 },
      { trader: "JakartaSwing", country: "ID", ret: 45.9, lots: 318.4 },
      { trader: "ManilaTide", country: "PH", ret: 42.4, lots: 287.5 },
      { trader: "KrabiCapital", country: "TH", ret: 39.8, lots: 341.9 },
    ],
  },
  {
    id: "raw",
    label: "Raw",
    note: "Raw spreads, from $25,000.",
    rows: [
      { trader: "IronOrderbook", country: "HK", ret: 58.2, lots: 1482.6 },
      { trader: "TokyoTapeFX", country: "JP", ret: 54.7, lots: 1207.3 },
      { trader: "SeoulLatency", country: "KR", ret: 51.3, lots: 1394.8 },
      { trader: "LionCityAlgo", country: "SG", ret: 47.6, lots: 1046.2 },
      { trader: "SukhumvitDesk", country: "TH", ret: 44.1, lots: 968.7 },
      { trader: "TaipeiBasis", country: "TW", ret: 41.5, lots: 1133.4 },
      { trader: "HarbourCarry", country: "HK", ret: 38.2, lots: 892.5 },
      { trader: "PhuketPrime", country: "TH", ret: 35.7, lots: 1074.9 },
      { trader: "SydneyBasis", country: "AU", ret: 33.1, lots: 806.3 },
      { trader: "ByteDeskOne", country: "SG", ret: 30.6, lots: 951.8 },
    ],
  },
];

/* Gold, silver, bronze. Three one-off colours rather than tokens: they mean
   "first, second, third" and nothing else on the site ranks anything. */
const MEDALS = {
  1: { ring: "#d4a017", fill: "#fdf6e3", text: "#8a6508" },
  2: { ring: "#9aa5b1", fill: "#f4f6f8", text: "#5b6672" },
  3: { ring: "#c07d4a", fill: "#fbf1e8", text: "#7d4a22" },
};

const PAD = (n) => String(n).padStart(2, "0");

/**
 * Counts down to the last instant of the current UTC month — the round always
 * closes with the calendar month, so there is no date to keep updating.
 *
 * Returns `null` until mounted. The server and the client would render
 * different seconds otherwise, and React would flag the mismatch on hydration.
 */
function useRoundCountdown() {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const deadline = () => {
      const now = new Date();
      return Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1) - 1000;
    };

    const tick = () => {
      const ms = Math.max(0, deadline() - Date.now());
      const s = Math.floor(ms / 1000);
      setLeft({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return left;
}

function Countdown() {
  const left = useRoundCountdown();

  const units = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Mins" },
    { key: "seconds", label: "Secs" },
  ];

  return (
    <div
      className="flex gap-2.5"
      role="timer"
      aria-label="Time remaining in the current round"
    >
      {units.map((u) => (
        <div
          key={u.key}
          className="w-[56px] rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-center backdrop-blur-sm md:w-[62px]"
        >
          <span className="tnum block text-[19px] leading-none font-bold tracking-[-0.03em] text-white md:text-[22px]">
            {left ? PAD(left[u.key]) : "--"}
          </span>
          <span className="mt-1 block text-[10px] font-semibold tracking-[0.06em] text-white/55 uppercase">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function RankBadge({ rank }) {
  const medal = MEDALS[rank];

  if (!medal) {
    return (
      <span className="tnum inline-flex h-8 w-8 items-center justify-center text-[14px] font-semibold text-muted">
        {rank}
      </span>
    );
  }

  return (
    <span
      className="tnum inline-flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-bold"
      style={{
        background: medal.fill,
        color: medal.text,
        boxShadow: `inset 0 0 0 1.5px ${medal.ring}`,
      }}
    >
      {rank}
    </span>
  );
}

function Leaderboard() {
  const [divisionId, setDivisionId] = useState(DIVISIONS[0].id);
  const [expanded, setExpanded] = useState(false);

  const division = DIVISIONS.find((d) => d.id === divisionId);

  // The bar is read against the division leader, not against 100% — these are
  // returns, and scaling them to an absolute ceiling would flatten every row.
  const best = useMemo(
    () => Math.max(...division.rows.map((r) => r.ret)),
    [division]
  );

  const visible = expanded ? division.rows : division.rows.slice(0, 5);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-line md:flex-row md:items-end md:justify-between">
        <Tabs
          label="Contest divisions"
          tabs={DIVISIONS.map((d) => ({ id: d.id, label: d.label }))}
          value={divisionId}
          onChange={(id) => {
            setDivisionId(id);
            setExpanded(false);
          }}
        />
        <p className="pb-3 text-[13px] text-muted">
          {division.note} Standings refresh every 15 minutes.
        </p>
      </div>

      {/* `key` on the tbody restarts the row fade when the division changes, so
          switching tabs reads as new data arriving rather than as text swapping
          in place. */}
      <div className="-mx-5 overflow-x-auto px-5">
        {/* Volume drops out below `sm`, so the four remaining columns fit a
            phone without a sideways scroll — hold the wide floor back until
            that column returns, or the table scrolls when it does not need to. */}
        <table className="w-full min-w-[360px] border-collapse text-left sm:min-w-[540px]">
          <caption className="sr-only">
            {division.label} division standings, ranked by percentage return
          </caption>
          {/* Widths are set here rather than left to auto. Auto layout gives
              the trader column every spare pixel, which strands the return
              beside it across a third of the table with nothing in between. */}
          <thead>
            <tr className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
              <th scope="col" className="w-[52px] py-3 pr-3 font-semibold">
                #
              </th>
              <th scope="col" className="py-3 pr-3 font-semibold">
                Trader
              </th>
              <th scope="col" className="w-[36%] py-3 pr-3 font-semibold">
                Return
              </th>
              <th
                scope="col"
                className="hidden w-[13%] py-3 pr-3 text-right font-semibold sm:table-cell"
              >
                Volume
              </th>
              <th scope="col" className="w-[13%] py-3 pl-3 text-right font-semibold">
                Prize
              </th>
            </tr>
          </thead>
          <tbody key={divisionId}>
            {visible.map((row, i) => {
              const rank = i + 1;
              return (
                <tr
                  key={row.trader}
                  className="border-t border-line transition-colors hover:bg-alt"
                >
                  <td className="py-3 pr-3 align-middle">
                    <RankBadge rank={rank} />
                  </td>

                  <td className="py-3 pr-3 align-middle">
                    <span className="flex items-center gap-2.5">
                      {hasFlag(row.country) && (
                        <span className="coin inline-block h-6 w-6 shrink-0 overflow-hidden">
                          <Flag
                            code={row.country}
                            className="h-full w-full object-cover"
                          />
                        </span>
                      )}
                      <span className="text-[14.5px] font-semibold text-ink">
                        {row.trader}
                      </span>
                      <span className="text-[12px] font-medium text-muted">
                        {row.country}
                      </span>
                    </span>
                  </td>

                  <td className="py-3 pr-3 align-middle">
                    <span className="flex items-center gap-3">
                      <span className="tnum w-[68px] shrink-0 whitespace-nowrap text-[14.5px] font-semibold text-up">
                        +{row.ret.toFixed(1)}%
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden h-1.5 w-full max-w-[240px] overflow-hidden rounded-full bg-sunken md:block"
                      >
                        <span
                          className="block h-full rounded-full bg-up/70"
                          style={{ width: `${(row.ret / best) * 100}%` }}
                        />
                      </span>
                    </span>
                  </td>

                  <td className="tnum hidden py-3 pr-3 text-right align-middle text-[14px] whitespace-nowrap text-body sm:table-cell">
                    {row.lots.toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </td>

                  <td className="tnum py-3 pl-3 text-right align-middle text-[14.5px] font-semibold whitespace-nowrap text-ink">
                    ${PRIZES[i].toLocaleString("en-US")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand transition-colors hover:text-brand-700"
        >
          {expanded ? "Show top 5" : `Show all ${division.rows.length} places`}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              expanded && "rotate-180"
            )}
            strokeWidth={2.5}
          />
        </button>

        <Button href="/competition/rules" variant="quiet" size="sm">
          Full contest rules
        </Button>
      </div>
    </>
  );
}

export function Competition() {
  return (
    <section id="competition" aria-labelledby="competition-heading">
      {/* Band one — the offer, on the trophy plate. */}
      <div className="relative isolate overflow-hidden">
        <Image
          src="/assets/compatation/background-trimmed.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-right"
        />

        {/* On a phone the band is barely wider than the copy, so the ramp below
            runs out before the text does and the trophy sits directly behind
            it. This flat wash sits under the ramp and only on small screens, so
            the desktop framing is untouched. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[rgba(2,18,62,0.5)] md:hidden"
        />

        {/* Deep-blue ramp rather than a neutral one — see the note above. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(100deg, rgba(2,20,68,0.93) 0%, rgba(2,24,80,0.84) 34%, rgba(3,32,104,0.5) 62%, rgba(4,40,130,0.12) 84%, rgba(4,40,130,0) 100%)",
          }}
        />

        <div className="container-x py-12 md:py-16">
          <div className="max-w-2xl">
            {/* Status, not a kicker. The section rule bans a label that restates
                the heading; this one says the round is open, which the heading
                does not. */}
            {/* <Reveal className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-go opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-go" />
              </span>
              <span className="text-[12px] font-semibold tracking-[0.04em] text-white uppercase">
                Round open &middot; Entries live
              </span>
            </Reveal> */}

            <Reveal
              as="h1"
              id="competition-heading"
              delay={0.05}
              className="h-section mt-5 text-white"
            >
              Climb the board. Claim the prize.
            </Reveal>

            <Reveal
              as="p"
              delay={0.1}
              className="mt-3.5 max-w-xl text-[16.5px] leading-relaxed text-white/80"
            >
              Every month, ByteFX traders compete on a single number:
              percentage return on a live account. Trade the account you already
              have — the standings do the rest.
            </Reveal>

            <Reveal delay={0.15} className="mt-7">
              <p className="eyebrow text-white/55">Round closes in</p>
              <div className="mt-3">
                <Countdown />
              </div>
            </Reveal>

            {/* The three numbers that are the whole offer. A grid, not a wrap:
                on flex the third figure dropped to its own row and read as an
                afterthought rather than as the third of three. */}
            <Reveal
              delay={0.2}
              className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3"
            >
              <div>
                <p className="tnum text-[32px] leading-none font-bold tracking-[-0.04em] text-white">
                  <CountUp value={PRIZE_POOL} prefix="$" />
                </p>
                <p className="mt-2 text-[13px] text-white/70">
                  Prize pool, every round.
                </p>
              </div>
              <div>
                <p className="tnum text-[32px] leading-none font-bold tracking-[-0.04em] text-white">
                  <CountUp value={PRIZES.length * DIVISIONS.length} />
                </p>
                <p className="mt-2 text-[13px] text-white/70">
                  Paid places across three divisions.
                </p>
              </div>
              <div>
                <p className="text-[32px] leading-none font-bold tracking-[-0.04em] text-white">
                  $0
                </p>
                <p className="mt-2 text-[13px] text-white/70">
                  To enter. Your live account is your entry.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup?type=competition" size="lg" arrow>
                Enter this round
              </Button>
              <Button
                href="/competition/rules"
                variant="onDark"
                size="lg"
              >
                How it works
              </Button>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Band two — the standings. White, so it reads as data rather than as
          more campaign. */}
      <div className="py-10 md:py-14">
        <div className="container-x">
          <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Reveal as="h2" className="h-section text-[24px] md:text-[30px]">
                This round&rsquo;s standings
              </Reveal>
              <Reveal
                as="p"
                delay={0.05}
                className="mt-3 text-[15.5px] leading-relaxed text-body"
              >
                Ranked on closed-trade return since the round opened. Divisions
                run separately so a $20 account is never measured against a
                $25,000 one.
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1}>
            <Leaderboard />
          </Reveal>

          {/* Contest returns are the least typical numbers a broker publishes.
              Showing them without this line would be misleading, so it is not
              optional trim — see the risk notice pattern used site-wide. */}
          <p className="mt-8 rounded-xl bg-warn-50 px-4 py-3 text-[12px] leading-relaxed text-warn-600">
            Competition standings show the highest-performing accounts of the
            round and are not representative of typical results. Trading
            leveraged products carries a high risk of losing money rapidly. Past
            performance does not indicate future results. Prizes settle to the
            winning account within five business days of the round closing.
          </p>
        </div>
      </div>
    </section>
  );
}
