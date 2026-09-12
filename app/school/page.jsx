import { ExternalLink, GraduationCap, PlayCircle } from "lucide-react";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export const metadata = {
  title: "ByteFX School",
  description:
    "Curated third-party video guides for funding a ByteFX account, trading with MT5 mobile, community reviews and demo competitions.",
  alternates: { canonical: "/school" },
};

const GROUPS = [
  {
    id: "funding-and-withdrawals",
    title: "Funding and withdrawals",
    lead: "Start with the account workflow: add funds, confirm the transaction and request a withdrawal.",
    lessons: [
      {
        id: "J15_TrOQZqo",
        title: "ByteFX Deposit & Withdrawal Guide (Step-by-Step)",
        creator: "Prime FX OFFICIAL",
        type: "Third-party funding guide",
      },
    ],
  },
  {
    id: "mt5-mobile",
    title: "MT5 on mobile",
    lead: "Learn the order flow and controls before placing a trade from a phone.",
    lessons: [
      {
        id: "Ux61r_VLhIE",
        title: "How to Trade In MT5 MOBILE Application",
        creator: "FX WOLF",
        type: "Third-party platform tutorial",
      },
    ],
  },
  {
    id: "community-reviews",
    title: "Community reviews",
    lead: "Independent perspectives from trading creators. Treat opinions and performance claims as the creator's own.",
    lessons: [
      {
        id: "uOQGLpE6zeY",
        title: "Best Forex Broker India — ByteFX Review",
        creator: "AU fx Trader",
        type: "Third-party review",
      },
      {
        id: "Ct1BIM4Lqw0",
        title: "ByteFX Honest Review 2026 — Gold Trading Platform",
        creator: "Traders Dynasty",
        type: "Third-party review",
      },
    ],
  },
  {
    id: "demo-competition",
    title: "Demo competition",
    lead: "See how the demo competition experience works before joining an event.",
    lessons: [
      {
        id: "YWco3E9VXCs",
        title: "ByteFX Demo Competition LIVE",
        creator: "InvestSign",
        type: "Third-party competition walkthrough",
      },
    ],
  },
];

function LessonCard({ lesson }) {
  const watchUrl = `https://www.youtube.com/watch?v=${lesson.id}`;

  return (
    <RevealItem
      as="article"
      className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[var(--sh-sm)]"
    >
      <div className="aspect-video overflow-hidden bg-sunken">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${lesson.id}`}
          title={lesson.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <div className="p-5 sm:p-6">
        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.06em] text-brand uppercase">
          {lesson.type}
        </span>
        <h4 className="mt-3 text-[19px] leading-snug font-bold tracking-[-0.02em] text-ink">
          {lesson.title}
        </h4>
        <p className="mt-2 text-[13.5px] text-body">By {lesson.creator}</p>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand transition-colors hover:text-brand-700"
        >
          Watch on YouTube
          <span className="sr-only"> (opens in a new tab)</span>
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.2} />
        </a>
      </div>
    </RevealItem>
  );
}

export default function SchoolPage() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "School" }]}
        title="Learn the platform. Build your process."
        lead="Curated third-party video lessons for the workflows traders use most—from funding an account to placing an order on MT5 mobile."
      >
        <nav aria-label="School topics" className="mt-7 flex flex-wrap gap-2.5">
          {GROUPS.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <PlayCircle className="h-3.5 w-3.5" strokeWidth={2.2} />
              {group.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section
        bg="alt"
        title="ByteFX School"
        lead="Choose a topic and learn at your own pace. New platform and market lessons can be added here without changing the main navigation."
        aside={
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-semibold text-body shadow-xs">
            <GraduationCap className="h-4 w-4 text-brand" strokeWidth={2.2} />
            5 video lessons
          </span>
        }
      >
        <div className="space-y-14 md:space-y-16">
          {GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <Reveal>
                <h3 className="text-[26px] leading-tight font-bold tracking-[-0.025em] text-ink md:text-[30px]">
                  {group.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-body">
                  {group.lead}
                </p>
              </Reveal>
              <RevealGroup
                className={`mt-6 grid gap-5 ${
                  group.lessons.length > 1 ? "md:grid-cols-2" : ""
                }`}
              >
                {group.lessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </RevealGroup>
            </section>
          ))}
        </div>

        <p className="mt-14 rounded-2xl border border-line bg-surface p-5 text-[12.5px] leading-relaxed text-muted shadow-xs">
          Every video on this page is curated third-party content. Opinions,
          performance statements and promotional claims belong to their creators
          and are not guarantees or endorsements by ByteFX. Trading leveraged
          products involves risk.
        </p>
      </Section>

      <FinalCta />
    </main>
  );
}
