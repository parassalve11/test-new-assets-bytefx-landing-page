import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * ByteFX × Thailand — the IB incentive campaign. The page's one saturated,
 * photographic moment, between funding and the final CTA.
 *
 * This is **not** a market-entry or localisation section. It is a partner
 * reward: an Introducing Broker whose referred clients trade 500 lots earns
 * five nights in Thailand. That makes it the last surviving piece of the
 * Partnership section it replaced ("Grow with ByteFX", deleted this pass),
 * which is why both CTAs point at `/partnership` rather than `/signup` — the
 * audience here is brokers, not traders, and sending them to the retail
 * signup form would be the wrong door.
 *
 * **The lockup sits above the H2, breaking the section rule on purpose.** The
 * rule exists because every section used to carry a kicker that restated the
 * heading underneath it ("Markets" over a heading about markets) — a word of
 * chrome on every screen. This is not that: it is a campaign lockup carrying
 * the brand mark, and the H2 below it says something completely different.
 * Do not reintroduce a text kicker anywhere else on the strength of this one.
 *
 * **The logo is the real one, on a white plate.** `Logo.png` sets "Byte" in
 * brand blue (#1357BD), which on this scrim would be about 1.6:1 and
 * unreadable. Rather than recolour the mark, it sits on a `pay-puck` — the
 * same treatment the funding section gives Visa, Apple Pay and the app QR
 * code, and for the same reason: a fixed-colour mark gets the ground it was
 * drawn for instead of being repainted to suit the surface.
 *
 * TODO [CLIENT]: the qualifying period, which account types count toward the
 * 500 lots, whether the five nights include flights, and the campaign end
 * date are all unspecified. The disclaimer below is deliberately generic
 * until those land — do not ship it as the full terms.
 *
 * The photograph is Mu Ko Ang Thong National Marine Park — © Vyacheslav
 * Argenberg, CC BY 4.0 via Wikimedia Commons. Attribution is a **condition**
 * of that licence, not a caption: the credit line at the foot of the section
 * is not optional decoration, and swapping the image means replacing the
 * credit to match.
 *
 * A Bangkok skyline was used first and rejected — the prize is a holiday, so
 * it should look like one rather than like a business district. The swap also
 * dropped a licence problem: the skyline shot was CC BY-**SA**, whose
 * share-alike clause is a poor fit for a commercial site. This one is plain
 * CC BY, so attribution is the only condition.
 *
 * **It is a bright image**, unlike the dusk skyline it replaced — turquoise
 * water across two thirds of the frame. White type therefore depends entirely
 * on the scrim below, which is heavier than it would need to be over a darker
 * photograph. Check any replacement against the copy before swapping it in.
 */
const MECHANIC = [
  {
    figure: "500",
    unit: "lots",
    label: "Traded by the clients you introduce.",
  },
  {
    figure: "5",
    unit: "nights",
    label: "In Thailand, on ByteFX.",
  },
];

export function Thailand() {
  return (
    <section
      id="thailand"
      aria-labelledby="thailand-heading"
      className="relative isolate overflow-hidden"
    >
      {/* `fill` + `sizes="100vw"` lets next/image serve a narrow crop to
          phones rather than the 2200px master. Not `priority` — this sits six
          sections down and must not compete with the hero for LCP. */}
      <Image
        src="/assets/thailand-ang-thong.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={72}
        className="-z-20 object-cover"
      />

      {/* The photograph is bright, so this carries all of the contrast. The
          ramp is left-weighted: the copy sits on near-solid `shell` while the
          islands on the right stay visible rather than being greyed flat. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, rgba(1,6,26,0.95) 0%, rgba(1,6,26,0.88) 36%, rgba(1,6,26,0.62) 72%, rgba(1,6,26,0.46) 100%)",
        }}
      />

      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          {/* Campaign lockup. The plate is what lets the real mark keep its
              own colours on a dark ground. */}
          <Reveal className="flex items-center gap-3">
            <span className="pay-puck inline-flex items-center rounded-xl px-3 py-2">
              <Image
                src="/assets/Logo.webp"
                alt="ByteFX"
                width={384}
                height={82}
                className="h-[22px] w-auto md:h-[26px]"
              />
            </span>
            <span
              aria-hidden="true"
              className="text-[22px] leading-none font-semibold text-go md:text-[26px]"
            >
              &times;
            </span>
            <span className="text-[19px] leading-none font-semibold tracking-[-0.01em] text-white md:text-[23px]">
              Thailand
            </span>
          </Reveal>

          <Reveal
            as="h2"
            id="thailand-heading"
            delay={0.05}
            className="h-section mt-7 text-white"
          >
            Your next client referral could lead to Thailand.
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-white/80"
          >
            Become a ByteFX Introducing Broker and the volume your clients
            trade stops being just a rebate line. Hit the target and the trip
            is yours.
          </Reveal>

          {/* The mechanic, as the two numbers that are the whole offer. */}
          <Reveal
            delay={0.15}
            className="mt-10 flex flex-wrap items-start gap-x-12 gap-y-8"
          >
            {MECHANIC.map((m) => (
              <div key={m.unit} className="max-w-[15rem]">
                <p className="tnum text-white">
                  <span className="text-[44px] leading-none font-bold tracking-[-0.04em]">
                    {m.figure}
                  </span>{" "}
                  <span className="text-[18px] leading-none font-semibold text-white/70">
                    {m.unit}
                  </span>
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/70">
                  {m.label}
                </p>
              </div>
            ))}
          </Reveal>

          {/* Both routes are the partner programme, not the retail signup —
              this section is addressed to brokers. */}
          <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
            <Button href="/partnership" size="lg" arrow>
              Become an IB today
            </Button>
            <Button href="/partnership#terms" variant="onDark" size="lg">
              Programme terms
            </Button>
          </Reveal>

          <Reveal
            as="p"
            delay={0.24}
            className="mt-8 max-w-xl text-[12px] leading-relaxed text-white/50"
          >
            Open to registered ByteFX Introducing Brokers only. Volume is
            counted across the clients you introduce. Qualifying period,
            eligible account types and full terms apply.
          </Reveal>
        </div>
      </div>

      {/* CC BY 4.0 attribution — a licence condition, not a caption. */}
      <p className="absolute right-4 bottom-3 text-[10.5px] text-white/45">
        Mu Ko Ang Thong &middot; Vyacheslav Argenberg &middot;{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          rel="noopener noreferrer nofollow"
          target="_blank"
          className="underline underline-offset-2 hover:text-white/70"
        >
          CC BY 4.0
        </a>
      </p>
    </section>
  );
}
