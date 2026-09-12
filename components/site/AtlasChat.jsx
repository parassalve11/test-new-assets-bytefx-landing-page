"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Atlas AI — the assistant launcher.
 *
 * Atlas used to be a third tab in `MobileApp`'s platform switcher, next to
 * MetaTrader 5 and TradingView. It does not belong there: that switcher's
 * claim is "the same account opens in all of these", and Atlas is not a place
 * you open an account. It is an assistant, so it lives where assistants live —
 * a launcher pinned to the bottom-left of every page, mounted from
 * `app/layout.jsx`.
 *
 * Bottom-**left** on purpose. Bottom-right is where the site's own scroll and
 * cookie furniture goes, and on mobile the right thumb rest is already the
 * busiest corner of the viewport.
 *
 * ## This is a scripted assistant, not a model
 *
 * TODO [PRODUCT]: there is no Atlas endpoint yet. Everything below is a
 * lookup table over facts that are already printed elsewhere on this site —
 * the account specs in `AccountTypes`, the numbers in `Conditions`, the
 * funding line in `Funding`, the platforms in `MobileApp`. It invents
 * nothing, and when it cannot match a question it says so and hands off to
 * `/support` rather than guessing.
 *
 * The header says "Scripted demo" for exactly that reason, and it must keep
 * saying it until this is wired to a real model. When the endpoint lands,
 * replace `answerFor()` with the request, keep `KNOWLEDGE` as the seeded
 * suggestions, and drop the badge.
 *
 * Nothing here is persisted and nothing leaves the browser.
 */

const EASE = [0.22, 1, 0.36, 1];

const GREETING =
  "I'm Atlas, the ByteFX assistant. Ask me about accounts, spreads, leverage, funding or platforms — or pick one of these.";

/**
 * Every answer below is a restatement of something the site already claims.
 * `prompt` is what the suggestion chip shows. Order matters — the first match
 * wins, so put the narrow topics above the broad ones.
 *
 * `match` entries are matched as **word prefixes**, not as bare substrings.
 * That is not a nicety: with `includes`, "what is your refund policy" matched
 * `fund` and got answered, confidently and wrongly, with the deposit-methods
 * line. A prefix boundary still matches the inflections that matter — `fund`
 * catches "funding" and "funds", `trade` catches "trader" and "trading" —
 * while "refund", "drawdown" and "apply" fall through to the fallback, which
 * is where a question this table cannot answer belongs.
 */
const KNOWLEDGE = [
  {
    id: "accounts",
    prompt: "Which account should I open?",
    match: ["account", "standard", "pro account", "raw", "which account"],
    answer:
      "Three live accounts. Standard opens at $20 with spreads from 1.9 pips and zero commission. Pro opens at $2,000 with spreads from 1.0 pips, also zero commission. Raw opens at $25,000 with raw spreads from 0.0 pips and $8 round-turn commission. All three run on MetaTrader 5 at 0.01 lot minimum.",
  },
  {
    id: "deposit",
    prompt: "What is the minimum deposit?",
    match: ["minimum deposit", "min deposit", "how much to start", "$20", "20 dollar"],
    answer:
      "$20 on a Standard account. Pro starts at $2,000 and Raw at $25,000. ByteFX charges $0 of its own to fund an account on any method — your payment provider or bank may still apply theirs.",
  },
  {
    id: "spreads",
    prompt: "How tight are the spreads?",
    match: ["spread", "pip", "commission", "cost"],
    answer:
      "From 0.0 pips on Raw, 1.0 pips on Pro and 1.9 pips on Standard. Standard and Pro carry zero commission; Raw is $8 round turn. Spreads are variable on Standard and Pro and raw on Raw.",
  },
  {
    id: "leverage",
    prompt: "What leverage can I get?",
    match: ["leverage", "margin", "1:2000", "2000"],
    answer:
      "Up to 1:2000 on every account type. The ceiling that actually applies depends on the instrument class and your account equity, and leverage that size carries a high level of risk — it magnifies losses exactly as fast as gains.",
  },
  {
    id: "funding",
    prompt: "How do I fund and withdraw?",
    match: [
      "fund",
      "fee",
      "deposit method",
      "withdraw",
      "payment",
      "card",
      "wire",
      "usdt",
      "crypto deposit",
    ],
    answer:
      "Card, bank wire, USDT and crypto, all of it from the app or the client area. ByteFX takes no fee of its own on deposits. Providers and banks apply their own fees and cut-off times, so a wire will not clear as fast as a card.",
  },
  {
    id: "platforms",
    prompt: "Which platforms do you support?",
    match: ["platform", "metatrader", "mt5", "tradingview", "terminal", "mobile app"],
    answer:
      "MetaTrader 5 and TradingView — the same account opens in both, and in the ByteFX mobile app. A position you open on your phone shows up in MT5 immediately; there is no separate balance anywhere.",
  },
  {
    id: "instruments",
    prompt: "What can I trade?",
    match: ["trade", "instrument", "market", "forex", "gold", "metal", "indices", "stock", "share", "crypto"],
    answer:
      "150+ instruments across forex, metals, indices, shares and crypto — and all of them draw on one margin pool, so you are not splitting your balance between markets.",
  },
  {
    id: "safety",
    prompt: "Is my money protected?",
    match: ["safe", "protect", "segregat", "negative balance", "secure", "regulat", "licen"],
    answer:
      "Client money is held separately from ByteFX operating capital, and negative balance protection means a gap or a spike cannot drive your account below zero. For the licensing and entity detail, the Trust & Security page is the authoritative source — I will not paraphrase it.",
  },
  {
    id: "execution",
    prompt: "How fast is execution?",
    match: ["execution", "latency", "slippage", "fast", "20ms", "speed"],
    answer:
      "Around 20ms average execution, 24/6 while the markets are open. Support runs on the same 24/6 schedule.",
  },
  {
    id: "signup",
    prompt: "How do I open an account?",
    match: ["open an account", "sign up", "signup", "register", "get started", "demo"],
    answer:
      "Registration takes a few minutes: complete the form, verify your identity, then fund the account. If you would rather try it first, the demo account runs the same platform on simulated money.",
  },
];

const FALLBACK =
  "I don't have a reliable answer to that one — I'd rather say so than guess. The support team can pick this up properly at /support, 24/6.";

/**
 * A phrase, anchored to the start of a word. `\b` is only applied where the
 * phrase actually begins with a word character, so entries like "$20" and
 * "1:2000" still compile.
 */
function prefixMatcher(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${/^\w/.test(phrase) ? "\\b" : ""}${escaped}`, "i");
}

const MATCHERS = KNOWLEDGE.map((k) => ({
  answer: k.answer,
  tests: k.match.map(prefixMatcher),
}));

function answerFor(question) {
  const hit = MATCHERS.find((k) => k.tests.some((re) => re.test(question)));
  return hit ? hit.answer : FALLBACK;
}

/** Four openers, so the panel is never a blank prompt box. */
const SUGGESTIONS = KNOWLEDGE.filter((k) =>
  ["accounts", "spreads", "funding", "safety"].includes(k.id)
);

function Bubble({ role, children }) {
  const isAtlas = role === "atlas";
  return (
    <div className={cn("flex", isAtlas ? "justify-start" : "justify-end")}>
      <p
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
          isAtlas
            ? "rounded-bl-md bg-sunken text-body"
            : "rounded-br-md bg-brand-solid text-white"
        )}
      >
        {children}
      </p>
    </div>
  );
}

export function AtlasChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    { id: "greeting", role: "atlas", text: GREETING },
  ]);
  const reduced = useReducedMotion();
  const panelId = useId();
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const seq = useRef(0);

  const send = useCallback((text) => {
    const question = text.trim();
    if (!question) return;
    seq.current += 1;
    const n = seq.current;
    setMessages((prev) => [
      ...prev,
      { id: `q${n}`, role: "user", text: question },
      { id: `a${n}`, role: "atlas", text: answerFor(question) },
    ]);
    setDraft("");
  }, []);

  // Escape closes from anywhere inside the widget, which is the behaviour
  // anyone who has used a dialog expects — and the launcher is the only thing
  // on the page that can trap a keyboard user otherwise.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Pin the transcript to the newest turn. `auto` under reduced motion for
  // the same reason every other scroll on the site is.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTo({
      top: log.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [messages, reduced]);

  return (
    /* Bottom-right, above everything. `z-60` clears the sticky navbar (z-50)
       so the panel is never half-hidden behind the header on a short
       viewport. `pointer-events-none` on the shell, restored on the children,
       keeps the column from swallowing clicks on the page beneath it.

       The column is right-aligned, so the panel and the launcher share their
       right edge and the panel grows leftwards — which is also why it scales
       out of its bottom-right corner rather than its bottom-left. */
    <div className="pointer-events-none fixed right-4 bottom-4 z-60 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="dialog"
            aria-label="Atlas AI assistant"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.26, ease: EASE }}
            style={{ transformOrigin: "bottom right" }}
            className={cn(
              "pointer-events-auto flex w-[min(370px,calc(100vw-2rem))] flex-col",
              "max-h-[min(560px,calc(100dvh-8rem))] overflow-hidden rounded-[20px]",
              "border border-line bg-surface shadow-[var(--sh-xl)]"
            )}
          >
            {/* Header. The blue is the same gradient as the hero band and the
                tools card, so the widget reads as part of the site rather
                than as a bolted-on third-party bubble. */}
            <div className="hero-tools relative flex items-center gap-3 px-4 py-3.5 text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/25">
                <Image
                  src="/assets/mobile-section/atlas.webp"
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="24px"
                  className="h-6 w-6 object-contain"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] leading-tight font-semibold">
                  Atlas AI
                </span>
                <span className="block text-[11.5px] leading-tight text-white/70">
                  ByteFX assistant · 24/6
                </span>
              </span>
              {/* Non-negotiable while `answerFor` is a lookup table. */}
              <span className="rounded-full bg-white/15 px-2 py-[3px] text-[10px] font-semibold tracking-[0.04em] whitespace-nowrap text-white/85 uppercase">
                Scripted demo
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Atlas AI"
                className="-mr-1 shrink-0 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/12 hover:text-white"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex-1 space-y-2.5 overflow-y-auto p-4"
            >
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role}>
                  {m.text}
                </Bubble>
              ))}

              {/* The openers disappear once the conversation starts — they
                  are a way in, not a permanent menu. */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => send(s.prompt)}
                      className="rounded-full border border-line bg-alt px-3 py-1.5 text-[12.5px] font-medium text-body transition-colors hover:border-brand hover:text-brand"
                    >
                      {s.prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-2 border-t border-line px-3 py-2.5"
            >
              <label htmlFor={`${panelId}-input`} className="sr-only">
                Ask Atlas a question
              </label>
              <input
                id={`${panelId}-input`}
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about spreads, funding, leverage…"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-1.5 py-1.5 text-[13.5px] text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-go text-on-go transition-opacity disabled:opacity-35"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.75} />
              </button>
            </form>

            <p className="border-t border-line bg-alt px-4 py-2 text-[11px] leading-snug text-muted">
              Scripted answers drawn from this site. Not financial advice — for
              anything account-specific, contact{" "}
              <a href="/support" className="font-medium text-brand underline">
                support
              </a>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The launcher. It keeps its label on desktop — an unlabelled circle
          in a corner is a guess, and "Atlas AI" is the one thing a first-time
          visitor needs to know before clicking it. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close Atlas AI" : "Open Atlas AI assistant"}
        className={cn(
          "pointer-events-auto group inline-flex items-center gap-2.5 rounded-full",
          "border border-line bg-surface py-1.5 pr-1.5 pl-1.5 shadow-[var(--sh-lg)]",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--sh-xl)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          !open && "sm:pr-4"
        )}
      >
        <span className="hero-tools relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          {open ? (
            <X className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          ) : (
            <>
              <Image
                src="/assets/mobile-section/atlas.webp"
                alt=""
                width={1254}
                height={1254}
                sizes="26px"
                className="h-[26px] w-[26px] object-contain"
              />
              {/* Live dot: support is 24/6 and so is this. */}
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-go ring-2 ring-surface" />
            </>
          )}
        </span>
        {!open && (
          <span className="hidden text-[13.5px] font-semibold whitespace-nowrap text-ink sm:inline">
            Ask Atlas 
          </span>
        )}
      </button>
    </div>
  );
}
