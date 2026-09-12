/**
 * The six market pages, as data.
 *
 * One dynamic route (`app/markets/[slug]`) renders all of them, because they
 * are the same page six times: a claim, a live instrument table, why you would
 * trade this class here, and the session clock. Six hand-built pages would
 * drift apart within a release.
 *
 * ## What is real and what is not
 *
 * **Real, and already published elsewhere on this site:** the 150+ instrument
 * count, the 1:2000 leverage ceiling, the per-account spread floors (1.9 /
 * 1.0 / 0.0 pips), zero commission on Standard and Pro, $8 round turn on Raw,
 * ~20ms execution, 24/6 support, one margin pool across every class.
 *
 * **Simulated:** every price in `symbols`. They come from `lib/quotes.js`,
 * which is a seed plus a random walk. Prices are labelled "indicative" in the
 * UI for that reason and the disclaimer says so in words.
 *
 * **Deliberately absent:** per-instrument spreads, swap rates, contract sizes
 * and trading hours to the minute. Those are broker-specific numbers that
 * ByteFX has not published anywhere, and a market page is exactly where a
 * visitor would take them as a quote. TODO [PRODUCT]: add a `specs` field per
 * symbol once dealing signs the numbers off; the table is built to take two
 * more columns without a redesign.
 */

/** Session windows in UTC, so the clock is honest about what it is showing. */
export const SESSIONS = [
  { id: "sydney", name: "Sydney", open: 21, close: 6 },
  { id: "tokyo", name: "Tokyo", open: 0, close: 9 },
  { id: "london", name: "London", open: 7, close: 16 },
  { id: "newyork", name: "New York", open: 12, close: 21 },
];

export const MARKETS = [
  {
    slug: "forex",
    name: "Forex",
    title: "Forex",
    headline: "The market that never closes for the weekend it hasn't reached.",
    lead: "Majors, minors and crosses, 24 hours a day from the Sydney open to the New York close. One margin pool with everything else you trade.",
    why: [
      {
        title: "Priced against the market, not a markup",
        copy: "Variable spreads that track the underlying book. On Raw they start at 0.0 pips with an $8 round-turn commission instead of a widened quote.",
      },
      {
        title: "Leverage up to 1:2000",
        copy: "The ceiling that applies depends on the instrument class and your account equity. Leverage that size magnifies losses exactly as fast as gains.",
      },
      {
        title: "Execution measured, not asserted",
        copy: "Around 20ms from the click to the confirmation, measured across our own bridge.",
      },
    ],
    symbols: [
      { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0874, decimals: 4, change: 0.14 },
      { symbol: "GBP/USD", name: "British Pound / US Dollar", price: 1.2731, decimals: 4, change: -0.08 },
      { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", price: 154.219, decimals: 3, change: -0.17 },
      { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", price: 0.8842, decimals: 4, change: 0.09 },
      { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", price: 0.6598, decimals: 4, change: 0.22 },
      { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", price: 1.3712, decimals: 4, change: -0.11 },
    ],
  },
  {
    slug: "crypto",
    name: "Crypto",
    title: "Crypto",
    headline: "Crypto on the same balance as everything else.",
    lead: "Trade the majors as CFDs without a separate wallet, a separate exchange account or a separate margin pool.",
    why: [
      {
        title: "No wallet, no exchange account",
        copy: "You are trading the price, not custodying the asset. Nothing to transfer, nothing to lose a key to.",
      },
      {
        title: "One balance, every market",
        copy: "The same equity backs your crypto position and your forex position. You are not splitting capital across venues.",
      },
      {
        title: "Fund in crypto if you prefer",
        copy: "USDT and crypto deposits are supported alongside card and bank wire, with no ByteFX fee of its own.",
      },
    ],
    symbols: [
      { symbol: "BTC/USD", name: "Bitcoin / US Dollar", price: 76916.0, decimals: 0, change: -0.23 },
      { symbol: "ETH/USD", name: "Ethereum / US Dollar", price: 2913.55, decimals: 2, change: 1.06 },
    ],
  },
  {
    slug: "stocks",
    name: "Stocks",
    title: "Shares",
    headline: "The companies you already follow, as CFDs.",
    lead: "Take a position on single names long or short, on margin, from the same account you trade forex and metals in.",
    why: [
      {
        title: "Long or short, either way",
        copy: "A share CFD is symmetrical. You are not restricted to buying and waiting for the position to come back.",
      },
      {
        title: "Margin, not the full notional",
        copy: "You post margin rather than the whole position value — which is leverage, and it magnifies losses as fast as gains.",
      },
      {
        title: "Zero commission on Standard and Pro",
        copy: "The cost is in the spread on those two account types. Raw prices it the other way: raw spreads plus $8 round turn.",
      },
    ],
    symbols: [
      { symbol: "AAPL", name: "Apple Inc.", price: 228.42, decimals: 2, change: 0.41 },
      { symbol: "NVDA", name: "NVIDIA Corporation", price: 138.76, decimals: 2, change: 1.34 },
      { symbol: "TSLA", name: "Tesla, Inc.", price: 251.09, decimals: 2, change: -0.87 },
      { symbol: "GOOGL", name: "Alphabet Inc. Class A", price: 172.63, decimals: 2, change: 0.28 },
      { symbol: "META", name: "Meta Platforms, Inc.", price: 583.14, decimals: 2, change: 0.66 },
    ],
  },
  {
    slug: "indices",
    name: "Indices",
    title: "Indices",
    headline: "A whole market in one position.",
    lead: "The benchmark indices, as CFDs, without assembling and rebalancing a basket of single names yourself.",
    why: [
      {
        title: "One ticket, one exposure",
        copy: "An index CFD gives you the direction of the whole benchmark without the cost and drift of holding its constituents.",
      },
      {
        title: "Both directions",
        copy: "Short an index as easily as you buy it — no borrow to arrange, no separate instrument to find.",
      },
      {
        title: "Around the cash session",
        copy: "Index CFDs trade well beyond the underlying exchange's own hours, so a move overnight is not a move you can only watch.",
      },
    ],
    symbols: [
      { symbol: "US30", name: "Dow Jones Industrial Average", price: 41562.4, decimals: 1, change: 0.31 },
      { symbol: "NAS100", name: "Nasdaq 100", price: 21149.6, decimals: 1, change: 0.48 },
      { symbol: "SPX500", name: "S&P 500", price: 5734.9, decimals: 1, change: 0.19 },
      { symbol: "GER40", name: "DAX 40", price: 19284.5, decimals: 1, change: 0.24 },
      { symbol: "UK100", name: "FTSE 100", price: 8291.3, decimals: 1, change: -0.06 },
    ],
  },
  {
    slug: "commodities",
    name: "Commodities",
    title: "Metals",
    headline: "Gold and silver, priced in dollars, traded on margin.",
    lead: "The classic hedge, on the same account and the same margin pool as everything else you hold.",
    why: [
      {
        title: "Gold trades nearly around the clock",
        copy: "XAU/USD runs through the Asian, European and US sessions, so a position is not stranded between them.",
      },
      {
        title: "Swap-free support available",
        copy: "Standard and Raw accounts support swap-free. Pro does not — see the account comparison for the full row.",
      },
      {
        title: "Uncorrelated by design",
        copy: "Metals are on the same balance as your forex and index positions, which is what makes hedging across them practical.",
      },
    ],
    symbols: [
      { symbol: "XAU/USD", name: "Gold / US Dollar", price: 2417.84, decimals: 2, change: 0.62 },
      { symbol: "XAG/USD", name: "Silver / US Dollar", price: 28.41, decimals: 3, change: 0.37 },
    ],
  },
  {
    slug: "energy",
    name: "Energy",
    title: "Energy",
    headline: "Crude, both benchmarks, on margin.",
    lead: "WTI and Brent as CFDs — the two contracts the whole energy complex is quoted against.",
    why: [
      {
        title: "Both benchmarks, one account",
        copy: "WTI and Brent side by side, so the spread between them is a position you can actually take.",
      },
      {
        title: "No barrels, no expiry to roll yourself",
        copy: "A CFD settles in cash. You are trading the price of the contract, not arranging delivery of the commodity.",
      },
      {
        title: "Short as easily as long",
        copy: "Energy moves in both directions and often violently. The instrument does not favour one of them.",
      },
    ],
    symbols: [
      { symbol: "WTI", name: "West Texas Intermediate Crude", price: 71.42, decimals: 2, change: -0.44 },
      { symbol: "BRENT", name: "Brent Crude", price: 74.86, decimals: 2, change: -0.38 },
    ],
  },
];

export function getMarket(slug) {
  return MARKETS.find((m) => m.slug === slug);
}
