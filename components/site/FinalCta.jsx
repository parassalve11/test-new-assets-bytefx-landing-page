import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { FinalCtaVisual } from "@/components/site/FinalCtaVisual";

/**
 * The closing section.
 *
 * The three micro-chips that used to sit under the buttons ("Free to open",
 * "No deposit fee", "Verified in minutes") are gone. Two of them repeated
 * things the page had already said — Funding prints the $0 fee, the lead here
 * prints the $20 — and all three competed with the buttons they sat directly
 * beneath. The panel beside them now carries the same promise as a three-step
 * flow, which is the form that actually tells the reader what happens next.
 */
export function FinalCta() {
  return (
    <section
      id="start-trading"
      className="relative isolate overflow-hidden border-y border-brand-100 bg-brand-50"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-[8%] h-72 w-72 rounded-full bg-go/10 blur-[90px]"
      />

      <div className="container-x relative py-14 md:py-18">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <Reveal className="relative z-10 text-center lg:text-left">
            <h2 className="h-section mx-auto max-w-[680px] lg:mx-0">
              Start trading in under five minutes.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-body lg:mx-0">
              Open an account, verify your ID and fund it with $20. Move from
              sign-up to global markets through one clear, guided flow.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button href="/signup" size="lg" arrow>
                Open live account
              </Button>
              <Button href="/demo" variant="ghost" size="lg">
                Try demo
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <FinalCtaVisual />
          </Reveal>
        </div>

        {/* The risk warning belongs here, not only in the footer. */}
        <p className="mt-8 border-t border-brand-100/80 pt-5 text-[12px] leading-relaxed text-muted">
          Trading Forex, CFDs and other leveraged financial instruments involves
          a high level of risk and may not be suitable for all investors. Ensure
          you fully understand the risks involved and can afford to sustain a
          complete loss of your invested capital.
        </p>
      </div>
    </section>
  );
}
