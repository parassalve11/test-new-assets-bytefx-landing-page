import Image from "next/image";
import { ArrowRight } from "lucide-react";
import traderAsset from "@/public/assets/show_case/ChatGPT Image Aug 28, 2026, 02_19_03 PM.webp";
import toolsAsset from "@/public/assets/show_case/ChatGPT Image Aug 28, 2026, 02_21_02 PM.webp";
import competitionAsset from "@/public/assets/show_case/ChatGPT Image Aug 28, 2026, 02_30_08 PM (1).webp";
import copyTradingAsset from "@/public/assets/show_case/7fefebc6-0bec-412e-bd12-10687ce7e5ff.webp";
import styles from "./TradingShowcase.module.css";

const SHOWCASE_ASSETS = {
  trader: traderAsset,
  tools: toolsAsset,
  competition: competitionAsset,
  copyTrading: copyTradingAsset,
};

function ActionLink({ href, children, large = false, light = false, className = "" }) {
  return (
    <a
      href={href}
      className={`${styles.linkAction} ${large ? styles.linkActionLarge : ""} ${
        light ? styles.linkActionLight : ""
      } ${className}`}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" strokeWidth={2} />
    </a>
  );
}

function CandleChart() {
  const candles = [
    [202, 244, 220, 235],
    [148, 227, 172, 205],
    [112, 188, 132, 166],
    [70, 165, 94, 133],
    [46, 116, 68, 98],
    [84, 155, 104, 132],
    [104, 187, 129, 166],
    [79, 150, 98, 127],
    [29, 112, 52, 88],
    [22, 91, 39, 68],
    [91, 165, 109, 143],
    [122, 208, 145, 181],
  ];

  return (
    <svg
      className={styles.candles}
      viewBox="0 0 360 270"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {candles.map(([high, low, open, close], index) => {
        const x = 12 + index * 29;
        const bodyY = Math.min(open, close);
        const bodyHeight = Math.max(14, Math.abs(close - open));
        return (
          <g key={x}>
            <line x1={x + 8} y1={high} x2={x + 8} y2={low} />
            <rect x={x} y={bodyY} width="16" height={bodyHeight} rx="1.5" />
          </g>
        );
      })}
    </svg>
  );
}

function MainCard() {
  return (
    <article className={`${styles.card} ${styles.mainCard}`}>
      <CandleChart />

      <div className={styles.mainCopy}>
        <h3 className={styles.mainTitle}>Trade with Better Conditions</h3>
        <p className={styles.mainLead}>
          Tighter spreads, faster execution, and lower costs on every trade.
        </p>
        <ActionLink href="/getting-started" large>
          Start Trading with ByteFX
        </ActionLink>
      </div>

      {/* Source file is 1202x1309 (0.918 ratio) — matches these props */}
      <Image
        src={SHOWCASE_ASSETS.trader}
        alt="A ByteFX trader checking the markets on his phone"
        width={1202}
        height={1309}
        sizes="(min-width: 1100px) 620px, (min-width: 640px) 520px, 420px"
        unoptimized
        className={styles.traderImage}
      />
    </article>
  );
}

function ToolsCard() {
  return (
    <article className={`${styles.card} ${styles.toolsCard}`}>
      <div className={styles.featureCopy}>
        <h3>ByteFX Enhanced Trading Tools</h3>
        <p>
          Powerful platforms and market tools designed to keep you ahead of
          every move.
        </p>
        <ActionLink href="#platforms" light>
          Explore Tools
        </ActionLink>
      </div>

      <div className={styles.toolsGrid} aria-hidden="true" />
      {/* Source file is actually 1536x1024 (1.5 ratio), was mislabeled
          1448x1086 (1.333) — corrected so Next generates the right
          srcset and CLS placeholder */}
      <Image
        src={SHOWCASE_ASSETS.tools}
        alt="ByteFX trading tools shown on a phone and laptop"
        width={1536}
        height={1024}
        sizes="(min-width: 1100px) 460px, 520px"
        unoptimized
        className={styles.toolsImage}
      />
      {/* <span className={styles.trendBadge} aria-hidden="true">
        <TrendingUp strokeWidth={1.8} />
      </span> */}
    </article>
  );
}

function CompetitionCard() {
  return (
    <article className={`${styles.card} ${styles.promoCard} ${styles.competitionCard}`}>
      <div className={styles.promoCopy}>
        <h3>Compete. Trade. Win.</h3>
        <p>
          Join live trading competitions and compete for your share of exciting
          cash prizes.
        </p>
        <ActionLink href="/competition" light>
          Join Competition
        </ActionLink>
      </div>
      {/* Source file is 1448x1086 (1.333 ratio) — matches these props */}
      <Image
        src={SHOWCASE_ASSETS.competition}
        alt="Trading competition trophy and prize pool"
        width={1448}
        height={1086}
        sizes="(min-width: 1100px) 390px, (min-width: 640px) 360px, 330px"
        unoptimized
        className={styles.competitionImage}
      />
    </article>
  );
}

function CopyCard() {
  return (
    <article className={`${styles.card} ${styles.promoCard} ${styles.copyCard}`}>
      <div className={styles.promoCopy}>
        <h3>Copy Top Traders. Grow Together.</h3>
        <p>
          Follow proven strategies and mirror experienced traders while staying
          in control.
        </p>
      </div>
      {/* Source file is actually 1122x1402 (0.8 ratio, PORTRAIT) — was
          mislabeled 1448x1086 (1.333, landscape), which is why the CSS
          previously had to squash it with a non-uniform scale(). Fixed
          at the source instead of masking it with a transform. */}
      <Image
        src={SHOWCASE_ASSETS.copyTrading}
        alt="Top-performing copy trader statistics"
        width={1122}
        height={1402}
        sizes="(min-width: 1100px) 245px, 235px"
        className={styles.copyImage}
      />
    </article>
  );
}

export function TradingShowcase() {
  return (
    <section
      id="trading-showcase"
      className={styles.section}
      aria-labelledby="trading-showcase-title"
    >
      <h2 id="trading-showcase-title" className={styles.srOnly}>
        Everything you need to trade, grow, and earn with ByteFX
      </h2>
      <div className={styles.grid}>
        <MainCard />
        <ToolsCard />
        <div className={styles.promoRow}>
          <CompetitionCard />
          <CopyCard />
        </div>
      </div>
    </section>
  );
}
