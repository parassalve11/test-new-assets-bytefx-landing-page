"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { InstrumentIcon } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";

/**
 * Three trading calculators: pip value, required margin, and profit/loss.
 *
 * ## Why these are trustworthy
 *
 * Everything on this page is arithmetic the reader can check. There is no
 * hidden broker data in the result — each panel prints the formula it used
 * with the reader's own numbers substituted in, so a wrong answer is visibly
 * wrong rather than authoritative. That is the whole design.
 *
 * ## What the numbers come from
 *
 * `contractSize` and `pipSize` are the **conventional** contract specs for
 * each instrument class (100,000 units a standard forex lot, 100 troy ounces
 * for gold, 5,000 for silver, 1,000 barrels for crude). They are prefilled and
 * editable, and the UI says they are defaults to confirm.
 *
 * TODO [PRODUCT]: replace the defaults with ByteFX's own contract
 * specifications once dealing publishes them. They are per-broker, and a
 * trader sizing a position off the wrong contract size gets a wrong answer
 * that looks right. Until then the "confirm in the platform" line under each
 * result stays.
 *
 * The reference prices are the same simulated seed the rest of the site uses;
 * they are starting values for the inputs, not quotes.
 *
 * ## The currency caveat, stated once and honestly
 *
 * Results are in the instrument's **quote currency**. Converting to an account
 * currency needs a live FX rate that this page does not have, so it does not
 * pretend to: where the quote currency differs from USD the panel says so
 * rather than silently reporting the wrong unit.
 */

const INSTRUMENTS = [
  { symbol: "EUR/USD", quote: "USD", price: 1.0874, decimals: 4, contractSize: 100000, pipSize: 0.0001 },
  { symbol: "GBP/USD", quote: "USD", price: 1.2731, decimals: 4, contractSize: 100000, pipSize: 0.0001 },
  { symbol: "USD/JPY", quote: "JPY", price: 154.219, decimals: 3, contractSize: 100000, pipSize: 0.01 },
  { symbol: "AUD/USD", quote: "USD", price: 0.6598, decimals: 4, contractSize: 100000, pipSize: 0.0001 },
  { symbol: "XAU/USD", quote: "USD", price: 2417.84, decimals: 2, contractSize: 100, pipSize: 0.01 },
  { symbol: "XAG/USD", quote: "USD", price: 28.41, decimals: 3, contractSize: 5000, pipSize: 0.001 },
  { symbol: "WTI", quote: "USD", price: 71.42, decimals: 2, contractSize: 1000, pipSize: 0.01 },
  { symbol: "BTC/USD", quote: "USD", price: 76916, decimals: 0, contractSize: 1, pipSize: 1 },
];

const LEVERAGES = [30, 100, 200, 500, 1000, 2000];

const TABS = [
  { id: "pip", label: "Pip value" },
  { id: "margin", label: "Required margin" },
  { id: "pnl", label: "Profit / loss" },
];

const money = (n, dp = 2) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      })
    : "—";

/* ------------------------------------------------------------------ *
 * Field primitives
 * ------------------------------------------------------------------ */

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

const controlClass =
  "mt-2 h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-brand";

function NumberInput({ value, onChange, step = "any", min = 0, ...rest }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(controlClass, "tnum")}
      {...rest}
    />
  );
}

/** The formula, with the reader's own numbers in it. This is the trust. */
function Working({ children }) {
  return (
    <p className="mt-4 rounded-xl bg-sunken px-4 py-3 font-mono text-[12.5px] leading-relaxed break-words text-body">
      {children}
    </p>
  );
}

function Result({ label, value, unit, note }) {
  return (
    <div className="rounded-[18px] border border-line bg-alt p-6">
      <p className="eyebrow">{label}</p>
      <p className="tnum mt-2 text-[34px] leading-none font-bold tracking-[-0.03em] text-ink">
        {value}
        <span className="ml-1.5 text-[16px] font-semibold text-muted">
          {unit}
        </span>
      </p>
      {note && (
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{note}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The calculator
 * ------------------------------------------------------------------ */

export function Calculators() {
  const [tab, setTab] = useState("pip");
  const [symbol, setSymbol] = useState(INSTRUMENTS[0].symbol);
  const instrument = INSTRUMENTS.find((i) => i.symbol === symbol);

  const [lots, setLots] = useState("1");
  const [contractSize, setContractSize] = useState(String(INSTRUMENTS[0].contractSize));
  const [pipSize, setPipSize] = useState(String(INSTRUMENTS[0].pipSize));
  const [price, setPrice] = useState(String(INSTRUMENTS[0].price));
  const [leverage, setLeverage] = useState(500);
  const [entry, setEntry] = useState(String(INSTRUMENTS[0].price));
  const [exit, setExit] = useState(String(INSTRUMENTS[0].price * 1.01));
  const [side, setSide] = useState("buy");

  // Changing the instrument reseeds every spec-derived field at once, so the
  // inputs can never sit in a half-updated state that produces a plausible
  // but meaningless number.
  const pickInstrument = (next) => {
    const i = INSTRUMENTS.find((x) => x.symbol === next);
    setSymbol(next);
    setContractSize(String(i.contractSize));
    setPipSize(String(i.pipSize));
    setPrice(String(i.price));
    setEntry(String(i.price));
    setExit(String(+(i.price * 1.01).toFixed(i.decimals)));
  };

  const n = (v) => {
    const parsed = Number.parseFloat(v);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const out = useMemo(() => {
    const L = n(lots);
    const C = n(contractSize);
    const P = n(pipSize);
    const px = n(price);
    const units = L * C;

    return {
      units,
      pipValue: units * P,
      notional: units * px,
      margin: (units * px) / leverage,
      pnl: (n(exit) - n(entry)) * units * (side === "buy" ? 1 : -1),
    };
  }, [lots, contractSize, pipSize, price, leverage, entry, exit, side]);

  const ccy = instrument.quote;
  const nonUsd = ccy !== "USD";
  const conversionNote = nonUsd
    ? `Result is in ${ccy}, the quote currency of ${symbol}. Converting to your account currency needs a live ${ccy}/USD rate, which this calculator does not have.`
    : `Result is in ${ccy}, the quote currency of ${symbol}.`;

  return (
    <Section
      title="Trading calculators"
      lead="Size a position, check the margin it ties up, and see what a move is worth before you place it. Every result shows the arithmetic it used."
    >
      <Reveal className="overflow-hidden rounded-[24px] border border-line bg-surface shadow-[var(--sh-md)]">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Calculator"
          className="flex gap-1 border-b border-line bg-alt p-2"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-colors",
                tab === t.id
                  ? "bg-surface text-brand shadow-[var(--sh-xs)]"
                  : "text-body hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.15fr_1fr]">
          {/* Inputs */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Instrument">
                <span className="relative mt-2 flex items-center gap-3">
                  <InstrumentIcon symbol={symbol} size="sm" />
                  <select
                    value={symbol}
                    onChange={(e) => pickInstrument(e.target.value)}
                    className={cn(controlClass, "mt-0 flex-1")}
                  >
                    {INSTRUMENTS.map((i) => (
                      <option key={i.symbol} value={i.symbol}>
                        {i.symbol}
                      </option>
                    ))}
                  </select>
                </span>
              </Field>
            </div>

            <Field label="Volume (lots)">
              <NumberInput value={lots} onChange={setLots} step="0.01" />
            </Field>

            <Field
              label="Contract size"
              hint="Conventional default — confirm in the platform."
            >
              <NumberInput
                value={contractSize}
                onChange={setContractSize}
                step="1"
              />
            </Field>

            {tab === "pip" && (
              <Field
                label="Pip size"
                hint="0.0001 for most pairs, 0.01 for JPY crosses."
              >
                <NumberInput value={pipSize} onChange={setPipSize} step="any" />
              </Field>
            )}

            {tab === "margin" && (
              <>
                <Field label="Price">
                  <NumberInput value={price} onChange={setPrice} step="any" />
                </Field>
                <Field label="Leverage" hint="Up to 1:2000, subject to class and equity.">
                  <select
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className={controlClass}
                  >
                    {LEVERAGES.map((l) => (
                      <option key={l} value={l}>
                        1:{l}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}

            {tab === "pnl" && (
              <>
                <Field label="Entry price">
                  <NumberInput value={entry} onChange={setEntry} step="any" />
                </Field>
                <Field label="Exit price">
                  <NumberInput value={exit} onChange={setExit} step="any" />
                </Field>
                <div className="sm:col-span-2">
                  <span className="block text-[13px] font-semibold text-ink">
                    Direction
                  </span>
                  <div className="mt-2 inline-flex rounded-xl border border-line p-1">
                    {["buy", "sell"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSide(s)}
                        aria-pressed={side === s}
                        className={cn(
                          "rounded-lg px-5 py-2 text-[14px] font-semibold capitalize transition-colors",
                          side === s
                            ? s === "buy"
                              ? "bg-up/12 text-up"
                              : "bg-down/12 text-down"
                            : "text-body hover:text-ink"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Result */}
          <div>
            {tab === "pip" && (
              <>
                <Result
                  label="Value of one pip"
                  value={money(out.pipValue, 2)}
                  unit={ccy}
                  note={conversionNote}
                />
                <Working>
                  {money(n(lots), 2)} lots × {money(n(contractSize), 0)} units ×{" "}
                  {pipSize} = {money(out.pipValue, 2)} {ccy}
                </Working>
              </>
            )}

            {tab === "margin" && (
              <>
                <Result
                  label={`Margin required at 1:${leverage}`}
                  value={money(out.margin, 2)}
                  unit={ccy}
                  note={`Position notional ${money(out.notional, 2)} ${ccy}. ${conversionNote}`}
                />
                <Working>
                  ({money(n(lots), 2)} × {money(n(contractSize), 0)} ×{" "}
                  {money(n(price), instrument.decimals)}) ÷ {leverage} ={" "}
                  {money(out.margin, 2)} {ccy}
                </Working>
              </>
            )}

            {tab === "pnl" && (
              <>
                <Result
                  label={out.pnl >= 0 ? "Profit" : "Loss"}
                  value={money(out.pnl, 2)}
                  unit={ccy}
                  note={`Before spread, commission and swap. ${conversionNote}`}
                />
                <Working>
                  ({money(n(exit), instrument.decimals)} −{" "}
                  {money(n(entry), instrument.decimals)}) × {money(n(lots), 2)} ×{" "}
                  {money(n(contractSize), 0)}
                  {side === "sell" ? " × −1" : ""} = {money(out.pnl, 2)} {ccy}
                </Working>
              </>
            )}

            <p className="mt-5 text-[12.5px] leading-relaxed text-muted">
              For guidance only. Confirm contract specifications and margin
              requirements in the platform before you trade — they are the
              authority, this page is not. Trading on leverage carries a high
              level of risk and you can lose more than you deposit.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
