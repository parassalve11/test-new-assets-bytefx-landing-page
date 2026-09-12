import { Ticker } from "@/components/site/Ticker";
import { Conditions } from "@/components/site/Conditions";
import { AccountTypes } from "@/components/site/AccountTypes";
import { MobileApp } from "@/components/site/MobileApp";
import { MobileTrading } from "@/components/site/MobileTrading";
import { Funding } from "@/components/site/Funding";
import { FinalCta } from "@/components/site/FinalCta";

/* ──────────────────────────────────────────────────────────────────────────
   SUPPLIED-ARTWORK TEST — temporary, reversible.

   Trying the supplied pre-rendered artwork in place of three composed
   sections, to see whether baked-in banners read better than blocks built
   from live text.

     Hero             → HeroVideoTest             (hero/slide-1…4)
     Markets          → MarketsImageTest          (25–29.webp)
     TradingShowcase  → TradingShowcaseImageTest  (30–33.webp)

   Nothing is deleted. `Hero.jsx`, `Markets.jsx`, `TradingShowcase.jsx` and
   `TradingShowcase.module.css` are all still in components/site/ exactly as
   they were. `Conditions` ("Every number that moves your P&L.") is a different
   section and is untouched — it still sits between the last two below.

   TO REVERT: uncomment the three imports and the three lines in <main> below,
   comment out (or delete) the three *Test components, then delete
   components/site/HeroVideoTest.jsx,
   components/site/MarketsImageTest.jsx,
   components/site/TradingShowcaseImageTest.jsx and
   public/assets/experiment/.
   ────────────────────────────────────────────────────────────────────────── */

// import { Hero } from "@/components/site/Hero";
// import { Markets } from "@/components/site/Markets";
// import { TradingShowcase } from "@/components/site/TradingShowcase";
import { HeroVideoTest } from "@/components/site/HeroVideoTest";
import { MarketsImageTest } from "@/components/site/MarketsImageTest";
import { TradingShowcaseImageTest } from "@/components/site/TradingShowcaseImageTest";

export default function Home() {
  return (
    <main>
      {/* <Hero /> */}
      <HeroVideoTest />
      <Ticker />
      {/* <Markets /> */}
      <MarketsImageTest />
      <Conditions />
      {/* <TradingShowcase /> */}
      <TradingShowcaseImageTest />
      <AccountTypes />
      <MobileTrading />
      <MobileApp />
      <Funding />
      <FinalCta />
    </main>
  );
}
