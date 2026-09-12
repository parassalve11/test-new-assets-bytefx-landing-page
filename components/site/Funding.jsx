"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Funding.
 *
 * ── What this replaced ────────────────────────────────────────────────────
 *
 * A heading on the left and one composite render on the right — a picture of
 * eight payment marks, cropped square, with Visa sliced off one edge and UPI
 * off the other. It said "we take cards" and nothing else, the marks could not
 * be read at a glance, and 1.9 MB of PNG carried a single sentence.
 *
 * ── The marks ─────────────────────────────────────────────────────────────
 *
 * `public/assets/payment_methods/` ships every logo cut out individually. Each
 * one has its own readable card, while the composite render is used only as a
 * quiet backdrop.
 *
 * ── The band ──────────────────────────────────────────────────────────────
 *
 * This is the site's **second** dark band, and that is deliberate rather than
 * accidental. Everything between Markets and the close is a long light run —
 * conditions, showcase, accounts, mobile — and funding is the last section
 * before the close, which is exactly where that run needs breaking. It carries
 * the hero's treatment layer for layer (`hero-tools`, `hero-tools-grid`,
 * `hero-scrim`, `hero-bloom`), so the page opens and closes on the same
 * surface rather than introducing a third one. Change the hero band and this
 * changes with it.
 *
 * The dark ground is also what the marks wanted. Half of them ship fixed
 * colours that disappear on white — Apple Pay's black wordmark, the navy bank
 * glyph — which is why every one sits on a white `pay-puck`. On a blue band
 * those pucks read as objects rather than as patches.
 *
 * ── What is claimed ───────────────────────────────────────────────────────
 *
 * Provider timings are deliberately omitted. Availability and third-party
 * terms vary, so the section identifies accepted methods without promising a
 * settlement window.
 */

const METHODS = [
  {
    id: "visa",
    name: "Visa",
    image: "/assets/payment_methods/visa.webp",
    // Every logo ships inside a different amount of empty canvas — Visa's
    // wordmark floats in roughly half of its 1254px square, the Bitcoin coin
    // fills most of its own — so each mark is scaled to its own optical size.
    // This is what makes six very different marks read as one size in the row.
    markClassName: "w-[96%]",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    image: "/assets/payment_methods/master_card.webp",
    markClassName: "w-[86%]",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    image: "/assets/payment_methods/apple_pay.webp",
    markClassName: "w-[90%]",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    image: "/assets/payment_methods/crypto.webp",
    markClassName: "w-[72%]",
  },
  {
    id: "usdt",
    name: "USDT",
    image: "/assets/payment_methods/USDT.webp",
    markClassName: "w-[72%]",
  },
  {
    id: "bank-wire",
    name: "Bank wire",
    image: "/assets/payment_methods/bank_wire.webp",
    markClassName: "w-[64%]",
  },
];

/**
 * One method. A link, not a button — it goes to the funding page, and the
 * whole card is the target so the puck and the label are not two separate
 * things to aim at.
 */
function MethodCard({ method }) {
  return (
    <RevealItem as="li" className="min-w-0 list-none">
      <article
        className="hero-proof group/pay flex h-full flex-col items-center gap-3 rounded-2xl px-3 py-5 text-center transition-all duration-300 ease-out outline-none hover:-translate-y-1 hover:border-white/35 focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <span className="pay-puck flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover/pay:scale-105">
          <Image
            src={method.image}
            alt=""
            width={1254}
            height={1254}
            sizes="64px"
            className={cn("h-auto object-contain", method.markClassName)}
          />
        </span>

        <span className="block text-[13.5px] leading-none font-semibold text-white">
          {method.name}
        </span>

      </article>
    </RevealItem>
  );
}

export function Funding() {
  return (
    <section id="funding" className="relative isolate overflow-hidden text-white">
      {/* The band, layer for layer as the hero builds it. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-tools absolute inset-0" />
        <div className="hero-tools-grid absolute inset-0" />

        {/* The composite render, as the backdrop it should always have been.
            It sits *between* the grid and the scrim, so the scrim dims it
            behind the headline and leaves it bright out at the edge — the same
            arrangement that keeps the hero copy legible over its coin stage.
            `pay-backdrop` feathers all four sides, so the crop never lands on
            a straight edge.

            It is deliberately faint. The cards underneath show the same six
            marks at a readable size, so a bright backdrop puts every logo on
            the band twice and reads as a mistake rather than as depth — this
            is texture, not content.

            It also has to sit wholly *inside* the band. The section clips its
            own overflow, so anything hanging over the top edge is cut on a
            straight line no mask can soften — which is exactly what happened
            when this was anchored above the fold of the section. Hidden
            entirely below `md`, where there is no room for it beside the
            copy. */}
        <div className="absolute top-[3%] -right-[10%] hidden w-[42%] max-w-[560px] md:block">
          <Image
            src="/assets/payment_methods/image.webp"
            alt=""
            width={1448}
            height={1086}
            sizes="(min-width: 1280px) 560px, 42vw"
            className="pay-backdrop h-auto w-full opacity-[0.32]"
          />
        </div>

        <div className="hero-scrim absolute inset-0" />
        <div className="hero-bloom absolute inset-0" />
      </div>

      <div className="container-x relative z-10 py-16 md:py-24">
        <div className="funding-glass rounded-[30px] p-5 sm:p-7 md:p-9 lg:p-10">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal as="h2" className="h-section text-white">
              Fast and reliable payment methods.
            </Reveal>
            <Reveal
              as="p"
              delay={0.05}
              className="text-balance-i mt-4 text-[16.5px] leading-relaxed text-white/75"
            >
              Six ways in and out of your account, all of them settled by
              automated, audited processing. Withdrawals always return to the
              method you funded with.
            </Reveal>
            <Reveal delay={0.07}>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3.5 py-2 text-[12.5px] font-semibold text-white backdrop-blur-md">
                <BadgeCheck className="h-4 w-4 text-[#a8f55b]" strokeWidth={2.4} />
                $0 ByteFX fee on deposits and withdrawals
              </span>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="shrink-0">
            <Button href="/signup" size="lg" arrow>
              Open your account
            </Button>
          </Reveal>
        </div>

        <RevealGroup
          as="ul"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
        >
          {METHODS.map((method) => (
            <MethodCard key={method.id} method={method} />
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-3xl text-[13.5px] leading-relaxed text-white/60">
            Method availability and third-party fees can vary by region and
            provider. Review the applicable terms before funding your account.{" "}
            <a
              href="/funding"
              className="font-semibold text-white underline-offset-4 hover:underline"
            >
              Full funding terms
            </a>
            .
          </p>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
