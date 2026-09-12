/**
 * The legal documents, as data for `app/legal/[doc]`.
 *
 * ## The rule this file follows
 *
 * **Binding legal text is not written here.** A fabricated set of terms, a
 * fabricated privacy policy or a fabricated AML policy on a real broker's site
 * is not a placeholder — it is a document a client could rely on and a
 * regulator could read, and neither of them would care that it was meant as
 * scaffolding. So for terms, privacy and AML this file carries an honest
 * *summary of scope*: what the document covers, what a reader should expect to
 * find in it, and where the binding copy actually comes from.
 *
 * TODO [LEGAL]: replace `sections` for `terms`, `privacy` and `aml` with the
 * executed documents, and delete each page's `pending` flag. Do not fill them
 * in from another broker's site — jurisdiction, entity and licence conditions
 * all change the text.
 *
 * ## The one exception
 *
 * `risk` is written in full. A risk disclosure warns the reader *against* the
 * product, its content is factual about how leveraged CFDs behave rather than
 * contractual, and the site already carries the same warning in shorter form
 * in `FinalCta` and under the account comparison. Publishing it is safe and
 * omitting it would be worse than useless. It still needs a compliance read
 * before launch for jurisdiction-specific wording.
 */

export const LEGAL_DOCS = [
  {
    slug: "terms",
    title: "Terms and conditions",
    short: "Terms",
    summary:
      "The client agreement: what ByteFX undertakes to do, what you undertake to do, and how the relationship ends.",
    pending: true,
    sections: [
      {
        heading: "What this document governs",
        body: "The contract between you and ByteFX Capital Ltd covering account opening, order handling and execution, margin and liquidation, fees and charges, and the circumstances in which either side may close the relationship.",
      },
      {
        heading: "What you should expect to find in it",
        body: "Eligibility and jurisdiction restrictions; how orders are received, transmitted and executed; the margin call and stop-out levels that apply to your account type; how ByteFX may vary spreads, swaps and leverage and with what notice; the complaints procedure; and the governing law.",
      },
      {
        heading: "How to get the binding copy",
        body: "The executed client agreement is issued at account opening and is the version that binds you. Support can send you the current version before you apply — ask for it, and read it before you fund an account rather than after.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    short: "Privacy",
    summary:
      "What personal data ByteFX collects, why it is collected, how long it is kept and who it is shared with.",
    pending: true,
    sections: [
      {
        heading: "What this document governs",
        body: "The handling of your personal data — the identity documents you supply at verification, the payment details used to fund and withdraw, your trading activity, and the technical data your browser and the platform generate.",
      },
      {
        heading: "What you should expect to find in it",
        body: "The lawful basis for each category of processing; the retention period for identity and transaction records, which anti-money-laundering law sets rather than us; the third parties data is shared with, such as payment processors, verification providers and the liquidity chain; whether data leaves your jurisdiction; and how to exercise access, correction and erasure rights.",
      },
      {
        heading: "What we can tell you today",
        body: "ByteFX will never ask for your account password or a card PIN on any support channel, and support cannot see your password. Anyone who asks for either is not ByteFX.",
      },
      {
        heading: "How to get the binding copy",
        body: "Request the current privacy policy from support before you submit verification documents.",
      },
    ],
  },
  {
    slug: "risk",
    title: "Risk disclosure",
    short: "Risk",
    summary:
      "Trading leveraged products carries a high level of risk. You can lose more than you deposit. Read this before you fund an account.",
    pending: false,
    sections: [
      {
        heading: "Leverage magnifies losses exactly as fast as gains",
        body: "ByteFX offers leverage of up to 1:2000, subject to instrument class and account equity. At 1:2000 a move of 0.05% against you wipes out the margin backing the position. Leverage is not a feature that makes trading safer or cheaper — it increases the size of the position your deposit controls, and therefore the size of the loss a given move produces.",
      },
      {
        heading: "You can lose more than you deposit",
        body: "In fast or gapping markets a position can be closed at a materially worse price than your stop level, because a stop is an instruction to trade at the next available price, not a guarantee of that price. ByteFX applies negative balance protection, so your account cannot be driven below zero — but you can still lose the entire balance, and losing it is a normal outcome rather than an exceptional one.",
      },
      {
        heading: "CFDs are not ownership",
        body: "Every instrument on ByteFX is a contract for difference. You do not own the share, the metal, the barrel or the coin, and you receive none of the rights that ownership carries — no voting, no delivery, no custody of a crypto asset. You are trading the price.",
      },
      {
        heading: "Costs accrue whether or not the position moves",
        body: "The spread is paid on entry. Raw accounts pay $8 round-turn commission in addition. Positions held overnight are subject to swap on account types without swap-free support. A position that moves nowhere for a week does not cost nothing.",
      },
      {
        heading: "Past performance says nothing about the future",
        body: "Historical charts, backtests, demo results and other people's returns are not indicators of what your account will do. A strategy that worked in one volatility regime frequently fails in the next.",
      },
      {
        heading: "A demo account is not a rehearsal for a live one",
        body: "Demo fills are simulated and always available; live fills meet real liquidity and sometimes are not. More importantly, a demo cannot show you how you behave when the money is your own, which is the variable that decides most outcomes.",
      },
      {
        heading: "Trade only with money you can afford to lose",
        body: "Do not fund a trading account with money you need for housing, debt, dependants or an emergency. If you do not understand how margin, stop-outs or swaps work, do not trade on leverage until you do — and if you need advice on whether these products suit you, take it from a licensed adviser. ByteFX does not provide personalised investment advice.",
      },
    ],
  },
  {
    slug: "aml",
    title: "AML and KYC policy",
    short: "AML / KYC",
    summary:
      "The anti-money-laundering and identity verification obligations that apply to every account, and why verification is not optional.",
    pending: true,
    sections: [
      {
        heading: "What this document governs",
        body: "The identity verification, source-of-funds checks, transaction monitoring and record-keeping ByteFX carries out to meet its anti-money-laundering obligations.",
      },
      {
        heading: "What you should expect to find in it",
        body: "The documents accepted as proof of identity and address; when a source-of-funds declaration is required; the third-party payment rule — funds must arrive from and return to an account in your own name; the circumstances in which a withdrawal is held pending checks; and how long records are retained after an account closes.",
      },
      {
        heading: "What we can tell you today",
        body: "Verification is a legal requirement, not a ByteFX preference, and it cannot be waived. Deposits and withdrawals must use a payment method in your own name; a transfer from a third party will be returned rather than credited.",
      },
      {
        heading: "How to get the binding copy",
        body: "Request the current AML and KYC policy from support. If a check delays a withdrawal, support can tell you what is outstanding.",
      },
    ],
  },
];

export function getLegalDoc(slug) {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
