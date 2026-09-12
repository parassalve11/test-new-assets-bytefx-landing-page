import Image from "next/image";
import Link from "next/link";
import { Apple, MonitorSmartphone, Play, Smartphone } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Download",
  description:
    "Get MetaTrader 5 and the ByteFX app on Windows, macOS, iOS and Android — or trade in the browser with WebTrader, with nothing to install.",
  alternates: { canonical: "/download" },
};

/**
 * One download page with four anchors, rather than four thin routes. The
 * platform switcher in `Platforms.jsx` and the store badges in `MobileApp.jsx`
 * both point at `/download#windows`, `#macos`, `#ios` and `#android` — keep
 * those ids.
 *
 * TODO [PRODUCT]: **there are no real download URLs yet.** The App Store and
 * Google Play listings, and the MT5 installer ByteFX distributes, all need
 * real links. Every card below therefore routes to support rather than to a
 * `#` that looks like a button and does nothing, and says in words that the
 * link is not live. Replace `href` on each platform when the listings exist.
 *
 * Never point these at a third-party mirror of the MT5 installer. A trading
 * terminal downloaded from somewhere other than the broker or MetaQuotes is
 * the single most effective way to hand someone an account.
 */

const PLATFORMS = [
  {
    id: "windows",
    icon: MonitorSmartphone,
    name: "Windows",
    copy: "The full MetaTrader 5 desktop terminal — every order type, Expert Advisors and 21 timeframes, running on your live balance.",
  },
  {
    id: "macos",
    icon: Apple,
    name: "macOS",
    copy: "MetaTrader 5 for Mac. If your workflow lives in the browser, WebTrader runs the same account with nothing to install.",
  },
  {
    id: "ios",
    icon: Smartphone,
    name: "iOS",
    copy: "The ByteFX app for iPhone and iPad. Open positions, fund, withdraw and set price alerts without opening a laptop.",
  },
  {
    id: "android",
    icon: Play,
    name: "Android",
    copy: "The ByteFX app for Android phones and tablets, with the same account and the same alerts as every other device.",
  },
];

export default function DownloadPage() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Download" }]}
        title="One account, on whichever device is in front of you."
        lead="A position opened on your phone appears in MetaTrader 5 immediately. There is no second balance anywhere."
      />

      <Section
        title="Choose your platform"
        lead="Download links are being finalised — until they are live, support will send you the correct installer for your device."
      >
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {PLATFORMS.map((p) => (
            <RevealItem
              key={p.id}
              id={p.id}
              className="scroll-mt-28 rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand">
                  <p.icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="text-[19px] leading-tight font-bold tracking-[-0.025em] text-ink">
                  {p.name}
                </span>
              </span>

              <p className="mt-4 text-[14.5px] leading-relaxed text-body">
                {p.copy}
              </p>

              <Link
                href="/support"
                className="mt-5 inline-flex text-[14px] font-semibold text-brand underline-offset-4 hover:underline"
              >
                Ask support for the {p.name} installer
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section bg="alt" align="center" title="Or trade in the browser">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[15.5px] leading-relaxed text-body">
            WebTrader runs the same account in any modern browser, with nothing
            to install and nothing to update. It is the fastest way to place
            your first order, and the right answer on a machine you do not
            control.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-9 flex justify-center">
          <span className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3.5 pr-6">
            {/* Near-black modules on a white quiet zone, in both themes — a
                scanner needs the light ground, so this puck never inverts. */}
            <span className="flex h-[68px] w-[68px] items-center justify-center rounded-lg bg-white p-1">
              <Image
                src="/assets/bytefx-app-qr.svg"
                alt="QR code linking to the ByteFX mobile app"
                width={68}
                height={68}
                className="h-full w-full"
              />
            </span>
            <span className="text-left text-[14px] leading-snug text-body">
              <span className="block font-semibold text-ink">
                Scan to install on mobile
              </span>
              <span className="mt-1 block text-[13px] text-muted">
                Point your phone camera at the code
              </span>
            </span>
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] leading-relaxed text-muted">
            Only ever install a trading terminal from ByteFX or from the
            official app stores. A terminal downloaded from a mirror or sent to
            you in a message is the most direct way to lose control of an
            account.
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </main>
  );
}
