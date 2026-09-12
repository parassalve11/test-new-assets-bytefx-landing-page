import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Compass,
  Gauge,
  Globe2,
  Layers3,
  LifeBuoy,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const PRINCIPLES = [
  {
    icon: Compass,
    number: "01",
    title: "Clarity first",
    copy: "Conditions, costs and account choices should be understandable before a trade is placed.",
  },
  {
    icon: Gauge,
    number: "02",
    title: "Technology with purpose",
    copy: "Tools should make decisions faster and more informed without getting in the trader’s way.",
  },
  {
    icon: SlidersHorizontal,
    number: "03",
    title: "Control stays with you",
    copy: "One account, clear controls and direct access to the information needed to act with intent.",
  },
];

const EXPERIENCE = [
  {
    icon: Layers3,
    title: "One connected account",
    copy: "Move between markets, account management and platform access without rebuilding your workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Security in every step",
    copy: "Account access, verification and funding are presented with clear safeguards and no hidden shortcuts.",
  },
  {
    icon: LifeBuoy,
    title: "Support when it matters",
    copy: "Practical help is available across the trading week, with direct routes to the right information.",
  },
];

const STATS = [
  { value: "150+", label: "Instruments" },
  { value: "MT5", label: "Trading platform" },
  { value: "24/6", label: "Support access" },
];

export function AboutExperience() {
  return (
    <div className="overflow-hidden bg-canvas">
      <section className="relative isolate overflow-hidden border-b border-line py-16 md:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_28%,rgba(76,210,1,.14),transparent_27%),radial-gradient(circle_at_18%_18%,rgba(19,86,190,.12),transparent_31%)]" />
        <div className="hero-tools-grid pointer-events-none absolute inset-0 -z-10 opacity-35" />

        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/18 bg-brand-50 px-3.5 py-2 text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-go" />
              About ByteFX
            </p>
            <h1 className="mt-7 max-w-[11ch] text-[clamp(46px,6vw,78px)] font-semibold leading-[0.98] tracking-[-0.06em] text-ink">
              Markets move. Your experience should stay clear.
            </h1>
            <p className="mt-7 max-w-[57ch] text-[15px] leading-[1.8] text-body md:text-[17px]">
              ByteFX brings trading, account tools and market access into one
              focused experience—designed to make every step easier to
              understand and every decision easier to own.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" size="lg" arrow className="w-full sm:w-auto">
                Open an account
              </Button>
              <Button href="/company/trust-security" variant="ghost" size="lg" className="w-full sm:w-auto">
                Trust & security
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            <div className="relative mx-auto aspect-[1.16] max-w-[680px] overflow-hidden rounded-[34px] border border-white/12 bg-[#07120b] shadow-[0_38px_100px_-45px_rgba(0,0,0,.72)]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/about/crypto-rain-poster.webp"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/assets/about/crypto_rain.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(3,11,7,.96)_0%,rgba(3,12,7,.78)_38%,rgba(3,12,7,.2)_68%,rgba(3,12,7,.42)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(0,0,0,.68)_100%)]" />

              <div className="absolute inset-y-0 left-0 flex w-[58%] flex-col justify-between p-7 sm:p-10">
                <Image
                  src="/assets/Logo.webp"
                  alt="ByteFX"
                  width={384}
                  height={82}
                  className="h-[25px] w-auto brightness-0 invert sm:h-[29px]"
                />
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">
                    Our focus
                  </p>
                  <p className="mt-3 max-w-[18ch] text-[25px] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[34px]">
                    A sharper route to global markets.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-5 right-5 rounded-2xl border border-white/16 bg-black/28 px-4 py-3 text-white backdrop-blur-xl sm:bottom-7 sm:right-7">
                <span className="flex items-center gap-2 text-[11px] font-medium text-white/78">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#75e73b] opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#75e73b]" />
                  </span>
                  Built for live markets
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealGroup className="container-x mt-14 grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-surface/72 shadow-[0_18px_55px_-40px_rgba(1,6,26,.5)] backdrop-blur-xl md:mt-20">
          {STATS.map((stat) => (
            <RevealItem key={stat.label} className="border-r border-line px-3 py-5 text-center last:border-r-0 sm:px-6 sm:py-6">
              <p className="text-[21px] font-semibold tracking-[-0.04em] text-ink sm:text-[28px]">{stat.value}</p>
              <p className="mt-1 text-[9.5px] font-medium tracking-[0.08em] text-muted uppercase sm:text-[11px]">{stat.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-alt py-20 md:py-28">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">How we think</p>
            <h2 className="mt-4 text-[clamp(36px,4.8vw,60px)] font-semibold leading-[1.02] tracking-[-0.055em] text-ink">
              Professional trading should feel considered, not complicated.
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
            {PRINCIPLES.map(({ icon: Icon, ...item }) => (
              <RevealItem key={item.number} className="group rounded-[26px] border border-line bg-surface p-6 shadow-[0_18px_55px_-42px_rgba(1,6,26,.48)] transition duration-300 hover:-translate-y-1 hover:border-brand/25 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-muted">{item.number}</span>
                </div>
                <h3 className="mt-9 text-[21px] font-semibold tracking-[-0.035em] text-ink">{item.title}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.75] text-body">{item.copy}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
          <Reveal className="relative overflow-hidden rounded-[30px] border border-line bg-[#f5f7fa] shadow-[0_28px_80px_-48px_rgba(1,6,26,.5)] dark:bg-[#111820]">
            <Image
              src="/assets/company_stocks.webp"
              alt="Popular global share markets available through ByteFX"
              width={1672}
              height={941}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full dark:opacity-90"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">Market access</p>
            <h2 className="mt-4 text-[clamp(36px,4.4vw,56px)] font-semibold leading-[1.03] tracking-[-0.055em] text-ink">
              More opportunity. One familiar workflow.
            </h2>
            <p className="mt-6 text-[15px] leading-[1.8] text-body">
              Move across forex, shares, indices, metals, energy and crypto
              without changing the way you manage your account. The aim is a
              consistent experience from discovery through execution.
            </p>
            <ul className="mt-7 space-y-3.5">
              {["Clear market categories and contract information", "Account choices built around different trading styles", "Desktop and mobile access through established platforms"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-go/12 text-[#2aa400]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/markets" className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-brand">
              Explore all markets
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#07120d] py-20 text-white md:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#8fec43] uppercase">The ByteFX experience</p>
            <h2 className="mt-4 text-[clamp(38px,5vw,62px)] font-semibold leading-[1.02] tracking-[-0.055em] text-white">
              The account stays connected wherever you trade.
            </h2>
            <p className="mt-6 max-w-[55ch] text-[15px] leading-[1.8] text-white/62">
              Review your account, follow the market and respond from the same
              mobile experience—without reducing the interface to noise.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {EXPERIENCE.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-[#8fec43]" strokeWidth={1.9} />
                  <h3 className="mt-4 text-[13.5px] font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-white/48">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[460px] overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_64%_54%,rgba(76,210,1,.18),transparent_34%),linear-gradient(145deg,#0a1f13,#041009)] sm:min-h-[560px]">
            <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-2 text-[10px] font-medium tracking-[0.1em] text-white/55 uppercase backdrop-blur-xl sm:left-8 sm:top-8">
              Mobile trading
            </div>
            <Image
              src="/assets/mobile/mobiles.webp"
              alt="ByteFX mobile account and trading screens"
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="absolute bottom-[-1%] left-1/2 h-auto w-[124%] max-w-none -translate-x-1/2 drop-shadow-[0_38px_38px_rgba(0,0,0,.42)] sm:w-[112%]"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 text-center md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(76,210,1,.12),transparent_42%)]" aria-hidden="true" />
        <Reveal className="container-x relative mx-auto max-w-4xl">
          <Globe2 className="mx-auto h-7 w-7 text-brand" strokeWidth={1.8} />
          <h2 className="mt-6 text-[clamp(38px,5vw,64px)] font-semibold leading-[1.02] tracking-[-0.055em] text-ink">
            Build your trading approach on a clearer foundation.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.8] text-body">
            Explore the account options, practise with a demo, or speak with
            support before deciding what fits.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/signup" size="lg" arrow className="w-full sm:w-auto">Open an account</Button>
            <Button href="/demo" variant="ghost" size="lg" className="w-full sm:w-auto">Try a demo</Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
