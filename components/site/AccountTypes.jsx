"use client";

import { Check, Minus } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Standard and Pro carry the identical spec list in the identical order, so
 * the eye compares straight down a column.
 *
 * Raw is not one of those. Its pricing is negotiated on volume, so there is no
 * honest number to put in a "min. deposit" slot and no spec column that means
 * the same thing as its neighbours'. It used to render the spec list anyway,
 * blurred, with the real message revealed on hover — which hid the offer
 * behind an interaction, printed figures nobody was meant to read, and left
 * touch users looking at a smudge. It is now its own card, stated plainly,
 * and the pointer-traced border (`GlowingEffect`) is what marks it out as the
 * different one instead.
 */
const SPEC_ORDER = [
  "Min. deposit",
  "Spread from",
  "Spread type",
  "Commission",
  "Max leverage",
  "Min. volume per trade",
  "Swap-free support",
  "Platform",
];

const ACCOUNTS = [
  {
    id: "standard",
    name: "Standard",
    blurb:
      "The entry point for new traders exploring global markets with zero commission and high flexibility.",
    deposit: "20",
    specs: {
      "Min. deposit": "$20",
      "Spread from": "1.9 pips",
      "Spread type": "Variable",
      Commission: "Zero",
      "Max leverage": "1:2000*",
      "Min. volume per trade": "0.01 lot",
      "Swap-free support": true,
      Platform: "MetaTrader 5",
    },
  },
  {
    id: "pro",
    name: "Pro",
    blurb:
      "For experienced traders who need tighter spreads and stronger execution on higher volume.",
    deposit: "2,000",
    specs: {
      "Min. deposit": "$2,000",
      "Spread from": "1.0 pips",
      "Spread type": "Variable",
      Commission: "Zero",
      "Max leverage": "1:2000*",
      "Min. volume per trade": "0.01 lot",
      "Swap-free support": false,
      Platform: "MetaTrader 5",
    },
  },
];

/**
 * Raw's own card. `highlights` are the three specs that still mean something
 * without a deposit tier attached to them — the rest of the spec grid does
 * not apply to a negotiated plan, so it is not printed.
 */
const RAW = {
  id: "raw",
  name: "Raw",
  eyebrow: "Raw account",
  heading: "Pricing built around your volume.",
  blurb:
    "Raw spreads and direct market access for professionals trading with institutional precision. Tell us how you trade and we’ll shape the right plan with you.",
  highlights: [
    "Raw spreads from 0.0 pips",
    "$8 round turn commission",
    "Swap-free support available",
    "MetaTrader 5, from 0.01 lot",
  ],
};

function SpecValue({ value, inverse = false }) {
  if (value === true) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[14px] font-medium",
          inverse ? "text-white" : "text-ink"
        )}
      >
        <Check
          className={cn(
            "h-3.5 w-3.5",
            inverse ? "text-[#a8f55b]" : "text-go-600"
          )}
          strokeWidth={3}
        />
        Available
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[14px]",
          inverse ? "text-white/60" : "text-muted"
        )}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
        Not included
      </span>
    );
  }
  return (
    <span
      className={cn(
        "tnum text-[14px] font-medium",
        inverse ? "text-white" : "text-ink"
      )}
    >
      {value}
    </span>
  );
}

/**
 * ByteFX card language, taken straight off the original page: a nested frame
 * holding a card that fades white → green tint, a green "$" ahead of the
 * number, green ticks, and a full-width green pill CTA.
 */
function AccountCard({ account }) {
  const isPro = account.id === "pro";

  return (
    <RevealItem
      as="li"
      id={account.id}
      className={cn(
        "card-frame relative flex list-none flex-col scroll-mt-28",
        isPro &&
          "[--frame-top:#dbe8ff] [--frame-bottom:rgba(19,86,190,0.06)] lg:-my-3 dark:[--frame-top:#263750] dark:[--frame-bottom:rgba(19,86,190,0.08)]"
      )}
    >
      {isPro && (
        <span className="absolute top-1 left-1/2 z-10 -translate-x-1/2 rounded-full bg-go px-3 py-1 text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap text-on-go uppercase shadow-sm">
          MOST CHOSEN
        </span>
      )}

      <div className="h-full">
        <div
          className={cn(
            "flex h-full flex-col rounded-[18px] p-6 transition-all duration-200 md:p-7",
            isPro
              ? "border border-white/20 bg-brand-solid shadow-[0_24px_60px_rgba(12,44,120,0.28)] lg:py-9"
              : "card-fade-green border border-line shadow-sm hover:-translate-y-1 hover:border-line-strong hover:shadow-md"
          )}
        >
          <h3
            className={cn(
              "text-[23px] font-bold tracking-[-0.015em]",
              isPro ? "text-white" : "text-ink"
            )}
          >
            {account.name}
          </h3>
          <p
            className={cn(
              "mt-2 min-h-[4.5rem] text-[14.5px] leading-relaxed",
              isPro ? "text-white/72" : "text-body"
            )}
          >
            {account.blurb}
          </p>

          <p
            className={cn(
              "mt-4 flex items-baseline gap-1 border-t pt-5",
              isPro ? "border-white/18" : "border-line"
            )}
          >
            <span
              className={cn(
                "text-[24px] font-bold",
                isPro ? "text-[#a8f55b]" : "text-go-600"
              )}
            >
              $
            </span>
            <span
              className={cn(
                "tnum text-[40px] leading-none font-bold tracking-[-0.025em]",
                isPro ? "text-white" : "text-ink"
              )}
            >
              {account.deposit}
            </span>
            <span
              className={cn(
                "ml-1.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase",
                isPro ? "text-white/60" : "text-muted"
              )}
            >
              Min. deposit
            </span>
          </p>

          <dl
            className={cn(
              "mt-6 flex-1 divide-y border-t",
              isPro
                ? "divide-white/14 border-white/18"
                : "divide-line/70 border-line"
            )}
          >
            {SPEC_ORDER.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <dt
                  className={cn(
                    "text-[13.5px]",
                    isPro ? "text-white/62" : "text-muted"
                  )}
                >
                  {key}
                </dt>
                <dd className="text-right">
                  <SpecValue value={account.specs[key]} inverse={isPro} />
                </dd>
              </div>
            ))}
          </dl>

        <Button
          href={`/signup?account=${account.id}`}
          size="md"
          arrow
          className="mt-7 w-full"
        >
          Open your account
        </Button>
        </div>
      </div>
    </RevealItem>
  );
}

/**
 * The Raw card.
 *
 * It has to sit in the same row and match the same rhythm as the two spec
 * cards — eyebrow where their name sits, the offer where their price sits,
 * proof points where their spec list sits, one CTA at the foot — without
 * pretending to be a third column of the same table.
 *
 * The border is `GlowingEffect`: a brand-hued conic gradient masked to a short
 * arc that follows the pointer around the card's edge. It has been in the repo
 * unused since the Markets bento stopped hosting it, and this is the right
 * home for it — one card on the page is the negotiated one, and a border that
 * responds to the cursor says "talk to us" in a way a static outline cannot.
 * `proximity` means it lights up as the pointer nears the card rather than
 * only once it is inside, and `inactiveZone` keeps it dark when the cursor
 * rests dead centre, where a traced edge would just be noise.
 */
function RawCard() {
  return (
    <RevealItem
      as="li"
      id={RAW.id}
      className="card-frame relative flex list-none flex-col scroll-mt-28 [--frame-top:#e7edf7] [--frame-bottom:rgba(19,86,190,0.05)] dark:[--frame-top:#272d34] dark:[--frame-bottom:rgba(18,21,25,0)]"
    >
      <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md md:p-7">
        <GlowingEffect
          disabled={false}
          glow
          spread={38}
          proximity={72}
          inactiveZone={0.42}
          borderWidth={2}
          movementDuration={1.4}
        />

        <span className="relative text-[10.5px] font-bold tracking-[0.12em] text-brand uppercase">
          {RAW.eyebrow}
        </span>

        <h3 className="relative mt-3 text-[26px] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-ink">
          {RAW.heading}
        </h3>

        <p className="relative mt-4 text-[14.5px] leading-relaxed text-body">
          {RAW.blurb}
        </p>

        <ul className="relative mt-6 flex-1 space-y-3 border-t border-line pt-6">
          {RAW.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-go-50"
              >
                <Check className="h-3 w-3 text-go-600" strokeWidth={3.2} />
              </span>
              <span className="text-[14px] leading-snug text-ink">{item}</span>
            </li>
          ))}
        </ul>

        <Button
          href="/company/contact"
          size="md"
          arrow
          aria-label="Contact ByteFX about a Raw account plan"
          className="relative mt-7 w-full"
        >
          Contact for a plan
        </Button>
      </div>
    </RevealItem>
  );
}

export function AccountTypes() {
  return (
    <Section
      id="accounts"
      bg="alt"
      align="center"
      title={
        <>
          Just one click away to Global Markets
        </>
      }
      lead="Choose from three account types designed to suit beginners through to professionals — transparent pricing, robust execution and tailored features."
    >
      <RevealGroup
        as="ul"
        className="grid gap-5 lg:grid-cols-3 lg:items-stretch lg:gap-6"
      >
        {ACCOUNTS.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
        <RawCard />
      </RevealGroup>

      <p className="mt-8 text-center text-[13.5px] text-muted">
        * Maximum leverage depends on instrument class and account equity.
        Trading on leverage carries a high level of risk.{" "}
        <a
          href="/company/contact"
          className="font-semibold text-brand underline-offset-4 hover:underline"
        >
          Contact us for a custom plan
        </a>
        .
      </p>
    </Section>
  );
}
