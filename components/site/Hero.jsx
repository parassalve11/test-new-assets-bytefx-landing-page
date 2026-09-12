import Image from "next/image";
import {
  Headphones,
  WalletCards,
  CircleCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function Rise({ delay = 0, y = 20, className, children, as = "div" }) {
  const Tag = as;

  return (
    <Tag
      className={`hero-rise ${className ?? ""}`}
      style={{
        "--hero-rise-delay": `${delay}s`,
        "--hero-rise-y": `${y}px`,
      }}
    >
      {children}
    </Tag>
  );
}

function ProofPuck({ children }) {
  return (
    <span
      className="
        landing-hero-puck
        flex h-10 w-10 shrink-0
        items-center justify-center
        rounded-xl
      "
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function ProofBadge({ icon, value, label }) {
  return (
    <span
      className="
        landing-hero-proof
        inline-flex min-h-14
        items-center gap-2.5
        rounded-2xl
        py-2 pr-4 pl-2.5
        text-left
      "
    >
      <ProofPuck>
        {icon === "mt5" ? (
          <Image
            src="/assets/mobile-section/meta-treader.webp"
            alt=""
            width={1254}
            height={1254}
            sizes="40px"
            className="h-8 w-8 object-contain"
          />
        ) : icon === "deposit" ? (
          <WalletCards
            className="h-[19px] w-[19px] text-brand"
            strokeWidth={2}
          />
        ) : (
          <Headphones
            className="h-[19px] w-[19px] text-brand"
            strokeWidth={2}
          />
        )}
      </ProofPuck>

      <span className="leading-none">
        <span className="landing-hero-proof-value block whitespace-nowrap text-[13px] font-semibold">
          {value}
        </span>

        <span className="landing-hero-proof-label mt-1 block whitespace-nowrap text-[10.5px] font-medium">
          {label}
        </span>
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section
      className="
        landing-hero
        relative
        -mt-20
        flex
        min-h-[calc(100svh+72px)]
        items-center
        overflow-hidden
        pt-20
        sm:-mt-[84px]
        sm:pt-[84px]
      "
    >
      {/* Background artwork */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="landing-hero-art absolute inset-0" />
        <div className="landing-hero-scrim absolute inset-0" />
        <div className="landing-hero-glow absolute inset-0" />
      </div>

      {/* Content */}
      <div className="container-x relative z-10 w-full py-20 md:py-24 lg:py-28">
        <div
          className="
            landing-hero-copy
            mx-auto
            max-w-[680px]
            text-center
            md:mx-0
            md:text-left
          "
        >
          {/* Premium eyebrow
          <Rise delay={0.03}>
            <div
              className="
                landing-hero-eyebrow
                mx-auto
                inline-flex
                items-center
                gap-2.5
                rounded-full
                px-3.5
                py-2
                md:mx-0
              "
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>

              <span className="text-[10px] font-semibold tracking-[0.17em] uppercase">
                Global markets · MetaTrader 5
              </span>
            </div>
          </Rise> */}

          {/* Main headline */}
          <Rise
            as="h1"
            delay={0.09}
            y={28}
            className="
              landing-hero-heading
              font-domyyoji
              mt-7
              max-w-[670px]
              text-[48px]
              leading-[0.98]
              font-bold
              tracking-[-0.045em]
              sm:text-[58px]
              lg:text-[70px]
              xl:text-[76px]
            "
          >
            <span className="landing-hero-title-main block">
              Markets move fast.
            </span>

            <span className="landing-hero-title-brand mt-1 block text-brand">
              Move with clarity.
            </span>
          </Rise>

          {/* Description */}
          <Rise
            as="p"
            delay={0.16}
            className="
              landing-hero-lead
              mx-auto
              mt-7
              max-w-[570px]
              text-[15.5px]
              leading-[1.75]
              sm:text-[16.5px]
              md:mx-0
            "
          >
            Trade forex, metals, indices and crypto through{" "}
            <span className="landing-hero-lead-strong">
              MetaTrader 5
            </span>
            , with clear conditions and dedicated support built around the
            markets.
          </Rise>

          {/* Small trust line */}
          
          {/* CTA */}
          <Rise
            delay={0.25}
            className="
              mt-9
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
              md:justify-start
            "
          >
            <Button
              href="/signup"
              size="lg"
              arrow
              className="landing-hero-primary w-full sm:w-auto"
            >
              Open live account
            </Button>

            <Button
              href="/demo"
              size="lg"
              variant="ghost"
              className="landing-hero-secondary w-full sm:w-auto"
            >
              Explore demo
            </Button>
          </Rise>

          {/* Trading proof cards */}
          <Rise
            delay={0.31}
            className="
              mt-9
              flex
              max-w-[660px]
              flex-wrap
              items-center
              justify-center
              gap-2.5
              md:justify-start
            "
          >
            <ProofBadge
              icon="mt5"
              value="MetaTrader 5"
              label="Trading platform"
            />

            <ProofBadge
              icon="deposit"
              value="$20 minimum"
              label="Opening deposit"
            />

            <ProofBadge
              icon="support"
              value="24/6 support"
              label="Client assistance"
            />
          </Rise>
        </div>
      </div>
    </section>
  );
}