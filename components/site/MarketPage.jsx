"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { InstrumentIcon } from "@/components/ui/asset-icon";
import { SessionClock } from "@/components/ui/session-clock";
import { MARKETS } from "@/lib/markets-data";
import { useQuoteFeed } from "@/lib/quotes";
import { cn } from "@/lib/utils";

/**
 * One page, six markets. See `lib/markets-data.js` for what is real here and
 * what is simulated — the short version is that every number except the prices
 * is already published elsewhere on this site, and the prices are labelled
 * indicative because they come from the same random walk the ticker runs on.
 *
 * The interactive parts are the two a visitor actually uses on a market page:
 * a sortable, filterable instrument table, and a session clock that says which
 * markets are open *right now*. Neither is decoration — a market page whose
 * table you cannot sort is a screenshot.
 */

const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ *
 * Instrument table
 * ------------------------------------------------------------------ */

const COLUMNS = [
  { id: "symbol", label: "Instrument", align: "left" },
  { id: "price", label: "Indicative price", align: "right" },
  { id: "change", label: "Change", align: "right" },
];

function QuoteTable({ market }) {
  const { quotes, flash } = useQuoteFeed(market.symbols);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ by: "symbol", dir: "asc" });
  const reduced = useReducedMotion();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? quotes.filter(
          (r) =>
            r.symbol.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q)
        )
      : quotes;

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.by === "symbol") return a.symbol.localeCompare(b.symbol) * dir;
      return (a[sort.by] - b[sort.by]) * dir;
    });
  }, [quotes, query, sort]);

  const toggle = (id) =>
    setSort((s) =>
      s.by === id
        ? { by: id, dir: s.dir === "asc" ? "desc" : "asc" }
        : { by: id, dir: id === "symbol" ? "asc" : "desc" }
    );

  const searchId = `market-search-${market.slug}`;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor={searchId} className="sr-only">
          Filter {market.name} instruments
        </label>
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            id={searchId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${market.symbols.length} instruments`}
            autoComplete="off"
            className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-10 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
          />
        </div>
        <p className="text-[12.5px] text-muted">
          Indicative prices, updated live. Not a dealable quote.
        </p>
      </div>

      {/* The table scrolls inside its own box rather than pushing the page
          sideways — the one rule a wide table on a responsive page has. */}
      <div className="overflow-x-auto rounded-[20px] border border-line bg-surface shadow-[var(--sh-sm)]">
        <table className="w-full min-w-[560px] text-left">
          <caption className="sr-only">
            {market.name} instruments with indicative prices and daily change
          </caption>
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((c) => {
                const active = sort.by === c.id;
                return (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={
                      active
                        ? sort.dir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    className={cn(
                      "px-5 py-3.5",
                      c.align === "right" && "text-right"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      className={cn(
                        "eyebrow inline-flex items-center gap-1.5 transition-colors hover:text-brand",
                        active ? "text-brand" : "text-muted"
                      )}
                    >
                      {c.label}
                      <span aria-hidden="true" className="text-[9px]">
                        {active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const up = r.change >= 0;
              const Icon = up ? TrendingUp : TrendingDown;
              const flashing =
                market.symbols[flash.index]?.symbol === r.symbol
                  ? flash.dir
                  : undefined;

              return (
                <tr
                  key={r.symbol}
                  className="border-b border-line transition-colors last:border-b-0 hover:bg-alt"
                >
                  <th scope="row" className="px-5 py-4 font-normal">
                    <span className="flex items-center gap-3">
                      <InstrumentIcon symbol={r.symbol} size="sm" />
                      <span className="min-w-0">
                        <span className="block text-[14.5px] font-semibold text-ink">
                          {r.symbol}
                        </span>
                        <span className="block truncate text-[12.5px] text-muted">
                          {r.name}
                        </span>
                      </span>
                    </span>
                  </th>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={cn(
                        "tnum rounded px-1 text-[14.5px] text-ink",
                        !reduced && flashing === "up" && "tick-up",
                        !reduced && flashing === "down" && "tick-down"
                      )}
                    >
                      {r.price.toLocaleString("en-US", {
                        minimumFractionDigits: r.decimals,
                        maximumFractionDigits: r.decimals,
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={cn(
                        "tnum inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12.5px] font-semibold",
                        up ? "bg-up/8 text-up" : "bg-down/8 text-down"
                      )}
                    >
                      <Icon className="h-3 w-3" strokeWidth={2.6} />
                      {up ? "+" : ""}
                      {r.change.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-5 py-10 text-center text-[14px] text-muted"
                >
                  Nothing matches “{query}”. ByteFX lists 150+ instruments —
                  the full book is in the platform.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export function MarketPage({ market }) {
  const reduced = useReducedMotion();
  const others = MARKETS.filter((m) => m.slug !== market.slug);

  return (
    <>
      {/* The band is the hero treatment at a smaller size — same gradient,
          same grid — so a market page is recognisably the same site without
          repeating the landing page's full-height hero. */}
      <section className="relative -mt-[84px] overflow-hidden pt-[84px] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="hero-tools absolute inset-0" />
          <div className="hero-tools-grid absolute inset-0" />
          <div className="hero-scrim absolute inset-0" />
        </div>

        <div className="container-x relative py-16 md:py-20">
          <motion.nav
            aria-label="Breadcrumb"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-[13px] text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <Link href="/markets" className="transition-colors hover:text-white">
              Markets
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span className="text-white">{market.name}</span>
          </motion.nav>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
            className="h-section text-balance-i mt-5 max-w-[19ch] text-white"
          >
            {market.headline}
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
            className="text-balance-i mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-white/80"
          >
            {market.lead}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button href="/signup" size="lg" arrow className="w-full sm:w-auto">
              Open live account
            </Button>
            <Button
              href="/demo"
              variant="onDark"
              size="lg"
              className="w-full sm:w-auto"
            >
              Try demo
            </Button>
          </motion.div>
        </div>
      </section>

      <Section
        title={`${market.title} on ByteFX`}
        lead="Live indicative prices, sortable and filterable. Every instrument below settles into the same margin pool as the rest of your account."
      >
        <QuoteTable market={market} />

        <Reveal delay={0.06} className="mt-10">
          <p className="mb-4 text-center text-[13.5px] text-muted">
            Market sessions, right now — all times UTC
          </p>
          <SessionClock />
        </Reveal>
      </Section>

      <Section bg="alt" title={`Why trade ${market.name.toLowerCase()} here`}>
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {market.why.map((w) => (
            <RevealItem
              key={w.title}
              className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <p className="text-[18px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
                {w.title}
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                {w.copy}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-8">
          <p className="text-[13px] leading-relaxed text-muted">
            Prices shown on this page are indicative and generated for
            illustration; they are not a dealable quote and not an offer.
            Maximum leverage depends on instrument class and account equity.
            Trading on leverage carries a high level of risk and you can lose
            more than you deposit.
          </p>
        </Reveal>
      </Section>

      <Section title="Other markets" align="center">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((m) => (
            <RevealItem key={m.slug}>
              <Link
                href={`/markets/${m.slug}`}
                className="group block h-full rounded-[18px] border border-line bg-surface p-6 shadow-[var(--sh-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--sh-md)] motion-reduce:transform-none"
              >
                <span className="flex items-center gap-3">
                  <InstrumentIcon symbol={m.symbols[0].symbol} size="sm" />
                  <span className="text-[15.5px] font-semibold text-ink transition-colors group-hover:text-brand">
                    {m.name}
                  </span>
                </span>
                <span className="mt-3 block text-[13.5px] leading-relaxed text-body">
                  {m.symbols.length} instrument
                  {m.symbols.length === 1 ? "" : "s"} listed here
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
