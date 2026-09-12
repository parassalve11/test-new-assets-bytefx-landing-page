import Image from "next/image";
import { Star } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { BrandGlyph } from "@/components/ui/brand-icons";
import { Spotlight } from "../ui/sportlight";
import { cn } from "@/lib/utils";

function StoreBadge({ store }) {
  const apple = store === "apple";

  return (
    <a
      href={apple ? "/download#ios" : "/download#android"}
      aria-label={apple ? "Download on the App Store" : "Get it on Google Play"}
      className="
        group/store
        flex min-h-[52px] items-center gap-2.5
        rounded-xl
        border border-white/[0.12]
        bg-white/[0.055]
        px-4 py-2.5
        text-white
        shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_14px_32px_-22px_rgba(0,0,0,1)]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-[#8ee72f]/45
        hover:bg-white/[0.09]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#8ee72f]
      "
    >
      <BrandGlyph
        name={apple ? "apple" : "googleplay"}
        className="h-6 w-6 shrink-0 text-white"
      />

      <span className="text-left leading-none">
        <span className="block text-[8px] font-medium tracking-[0.04em] text-white/50">
          {apple ? "Download on the" : "GET IT ON"}
        </span>

        <span className="mt-1 block whitespace-nowrap text-[13px] font-semibold tracking-[-0.02em]">
          {apple ? "App Store" : "Google Play"}
        </span>
      </span>
    </a>
  );
}

function Rating() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((star) => (
          <Star
            key={star}
            className="h-[16px] w-[16px] fill-[#8fea2c] text-[#8fea2c]"
            strokeWidth={1.8}
          />
        ))}
      </div>

      <div className="h-4 w-px bg-white/15" />

      <div className="flex items-baseline gap-1.5">
        <span className="text-[13px] font-semibold tracking-[-0.02em] text-white">
          4.9
        </span>

        <span className="text-[11px] text-white/45">
          rated by traders
        </span>
      </div>
    </div>
  );
}

function DownloadPanel({ compact = false }) {
  return (
    <div
      className={cn(
        `
        relative grid items-center gap-3 overflow-hidden
        rounded-[18px]
        border border-white/[0.11]
        bg-black/25
        p-3
        shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_-36px_rgba(0,0,0,1)]
        backdrop-blur-2xl
        `,
        compact
          ? "grid-cols-[74px_minmax(0,1fr)]"
          : "grid-cols-[92px_minmax(0,1fr)]"
      )}
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-16 top-1/2
          h-36 w-36
          -translate-y-1/2
          rounded-full
          bg-[#8fea2c]/10
          blur-[55px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-px
          bg-gradient-to-r
          from-transparent via-white/20 to-transparent
        "
      />

      <div
        className={cn(
          `
          relative z-10
          flex aspect-square items-center justify-center
          overflow-hidden
          rounded-xl
          bg-white
          shadow-[0_12px_30px_-16px_rgba(0,0,0,1)]
          `,
          compact ? "w-[74px] p-2" : "w-[92px] p-2.5"
        )}
      >
        <Image
          src="/assets/bytefx-app-qr.svg"
          alt="QR code for the ByteFX mobile app"
          width={88}
          height={88}
          className="block h-full w-full object-contain"
        />
      </div>

      <div className="relative z-10 min-w-0">
        <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.12em] text-white/40">
          Scan to download
        </p>

        <div
          className={cn(
            "grid gap-2",
            compact ? "sm:grid-cols-2" : "xl:grid-cols-2"
          )}
        >
          <StoreBadge store="apple" />
          <StoreBadge store="google" />
        </div>
      </div>
    </div>
  );
}

function DownloadCopy({ mobile = false }) {
  return (
    <>
      <h2
        className={
          mobile
            ? "text-[36px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[44px]"
            : "text-[clamp(46px,4.2vw,68px)] font-semibold leading-[0.94] tracking-[-0.06em] text-white"
        }
      >
        Markets move.
        <br />
        <span className="text-[#8fea2c]">
          So can you.
        </span>
      </h2>

      <p
        className={
          mobile
            ? "mt-4 max-w-md text-[13px] leading-6 text-white/58"
            : "mt-6 max-w-[32rem] text-[clamp(14px,1vw,16px)] leading-[1.75] text-white/58"
        }
      >
        Monitor positions, manage your account and respond to market
        opportunities from one secure trading experience.
      </p>
    </>
  );
}

export function MobileDownload() {
  return (
    <section
      id="download-app"
      className="relative w-full overflow-hidden bg-[#030403] py-3 sm:py-4 md:py-5"
    >
      {/* ============================================================
          DESKTOP
      ============================================================ */}
      <div
        className="
          relative isolate hidden
          min-h-[660px]
          w-full
          overflow-hidden
          border-y border-white/[0.075]
          bg-black
          md:block
          lg:min-h-[700px]
          xl:min-h-[740px]
        "
      >
        {/* BACKGROUND VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-0
            -z-30
            h-full w-full
            object-cover
            object-center
            opacity-[0.58]
          "
        >
          <source
            src="/assets/mobile/background1.mp4"
            type="video/mp4"
          />
        </video>

        {/* DARK VIDEO TREATMENT */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            -z-20
            bg-black/25
            backdrop-saturate-[0.75]
          "
        />

        {/* background readability */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            -z-10
            bg-[linear-gradient(90deg,rgba(2,3,2,0.38)_0%,rgba(2,3,2,0.26)_38%,rgba(2,3,2,0.64)_62%,rgba(2,3,2,0.94)_100%)]
          "
        />

        {/* vertical vignette */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0 z-0
            bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,transparent_24%,transparent_66%,rgba(0,0,0,0.82)_100%)]
          "
        />

        {/* ==========================================================
            SPOTLIGHT — TOP LEFT
        =========================================================== */}

        <Spotlight
          fill="white"
          className="
            -left-[29%]
            -top-[52%]
            z-[1]
            h-[190%]
            w-[112%]
            opacity-[0.95]
            lg:-left-[23%]
            lg:-top-[56%]
            lg:w-[88%]
          "
        />

        <Spotlight
          fill="#8FEA2C"
          className="
            -left-[37%]
            -top-[40%]
            z-[1]
            h-[175%]
            w-[108%]
            opacity-[0.54]
            lg:-left-[29%]
            lg:-top-[45%]
            lg:w-[82%]
          "
        />

        {/* concentrated source */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-[9%] -top-[28%]
            z-[1]
            h-[63%] w-[43%]
            rounded-full
            bg-white/[0.12]
            blur-[125px]
          "
        />

        {/* green left atmosphere */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-[4%] top-[5%]
            z-[1]
            h-[58%] w-[41%]
            rounded-full
            bg-[#85f128]/[0.11]
            blur-[125px]
          "
        />

        {/* glow below phones */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-[22%] left-[3%]
            z-[1]
            h-[72%] w-[55%]
            rounded-full
            bg-[#74ef25]/[0.11]
            blur-[125px]
          "
        />

        {/* dark atmosphere behind content */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[8%] top-[8%]
            z-[1]
            h-[80%] w-[50%]
            rounded-full
            bg-black/60
            blur-[100px]
          "
        />

        {/* subtle texture */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-0
            z-[2]
            opacity-[0.12]
            bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_0.7px,transparent_0.8px)]
            bg-[length:6px_6px]
          "
        />

        {/* top reflection */}
        <div
          aria-hidden="true"
          className="
            absolute left-[8%] right-[8%] top-0
            z-[5]
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/25
            to-transparent
          "
        />

        {/* ==========================================================
            LEFT — PHONES
        =========================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[1%] left-[4%]
            z-[4]
            h-[13%] w-[48%]
            rounded-[100%]
            bg-[#8fea2c]/[0.08]
            blur-[40px]
          "
        />

        <Reveal
          style={{
            width: "61%",
            left: "-6%",
            bottom: "-2%",
          }}
          className="
            pointer-events-none
            absolute
            z-10
            transition-transform duration-700 ease-out
            motion-safe:hover:-translate-y-1
            motion-safe:hover:scale-[1.006]
          "
          delay={0.02}
        >
          <Image
            src="/assets/mobile/mobiles.webp"
            alt="ByteFX mobile account dashboard and live trading terminal"
            width={1536}
            height={1024}
            sizes="62vw"
            className="
              h-auto
              w-full
              max-w-none
              drop-shadow-[0_50px_48px_rgba(0,0,0,0.68)]
            "
          />
        </Reveal>

        {/* ==========================================================
            RIGHT — CONTENT
        =========================================================== */}

        <Reveal
          className="
            absolute
            right-[clamp(36px,7vw,130px)]
            top-1/2
            z-20
            w-[clamp(400px,34vw,550px)]
            -translate-y-1/2
          "
          delay={0.05}
        >
          <DownloadCopy />

          <div className="mt-6">
            <Rating />
          </div>

          <div className="mt-8 max-w-[470px]">
            <DownloadPanel />
          </div>
        </Reveal>

        {/* right vignette */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-y-0 right-0
            z-[12]
            w-[5%]
            bg-gradient-to-l
            from-black/45
            to-transparent
          "
        />

        {/* bottom border glow */}
        <div
          aria-hidden="true"
          className="
            absolute
            bottom-0
            left-[8%] right-[8%]
            z-[15]
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#8fea2c]/20
            to-transparent
          "
        />
      </div>

      {/* ============================================================
          MOBILE
      ============================================================ */}
      <div
        className="
          relative isolate
          mx-3
          overflow-hidden
          rounded-[26px]
          border border-white/[0.08]
          bg-black
          px-5 pb-6 pt-8
          shadow-[0_35px_90px_-50px_rgba(0,0,0,1)]
          sm:mx-5 sm:px-7
          md:hidden
        "
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-0
            -z-30
            h-full w-full
            object-cover
            opacity-[0.48]
          "
        >
          <source
            src="/assets/mobile/background1.mp4"
            type="video/mp4"
          />
        </video>

        <div
          aria-hidden="true"
          className="
            absolute inset-0
            -z-20
            bg-[linear-gradient(180deg,rgba(3,4,3,0.84)_0%,rgba(3,4,3,0.52)_35%,rgba(3,4,3,0.72)_66%,rgba(2,3,2,0.97)_100%)]
          "
        />

        <Spotlight
          fill="white"
          className="
            -left-[79%]
            -top-[18%]
            z-[1]
            h-[100%]
            w-[190%]
            opacity-[0.82]
          "
        />

        <Spotlight
          fill="#8FEA2C"
          className="
            -left-[88%]
            -top-[9%]
            z-[1]
            h-[92%]
            w-[184%]
            opacity-[0.42]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-[30%] -top-[8%]
            z-[1]
            h-[31%] w-[90%]
            rounded-full
            bg-white/[0.09]
            blur-[72px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2 top-[30%]
            z-[1]
            h-[42%] w-[100%]
            -translate-x-1/2
            rounded-full
            bg-[#81ee29]/[0.10]
            blur-[85px]
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute left-[14%] right-[14%] top-0
            z-[5]
            h-px
            bg-gradient-to-r
            from-transparent via-white/30 to-transparent
          "
        />

        {/* phones first */}
        <Reveal
          className="
            pointer-events-none
            relative z-10
            -mx-[17%]
            -mt-4
            aspect-[3/2]
            w-[134%]
          "
          delay={0.03}
        >
          <Image
            src="/assets/mobile/mobiles.webp"
            alt="ByteFX mobile account dashboard and live trading terminal"
            fill
            sizes="134vw"
            className="
              object-contain
              object-center
              drop-shadow-[0_32px_36px_rgba(0,0,0,0.62)]
            "
          />
        </Reveal>

        {/* content */}
        <Reveal className="relative z-20 -mt-1">
          <DownloadCopy mobile />

          <div className="mt-5">
            <Rating />
          </div>

          <div className="mt-6">
            <DownloadPanel compact />
          </div>
        </Reveal>
      </div>
    </section>
  );
}