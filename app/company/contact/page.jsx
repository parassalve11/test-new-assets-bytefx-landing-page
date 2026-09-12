import Link from "next/link";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PageHero } from "@/components/site/ToolsHero";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Contact us",
  description:
    "Reach ByteFX on live chat, WhatsApp, phone or email — 24 hours a day, six days a week, from the Sydney open to the New York close.",
  alternates: { canonical: "/company/contact" },
};

/**
 * Every channel on this page is one the site already publishes in
 * `Footer.jsx` — the same phone number, the same WhatsApp number, the same
 * support address. Nothing new is invented here, and if a number changes it
 * has to change in both places.
 *
 * TODO [PRODUCT]: there is **no registered office address** on this page,
 * because ByteFX Capital Ltd's entity details are the same compliance item
 * the Trust section is badged for. A contact page that invents an address is
 * worse than one that omits it. Add it with the licence details.
 *
 * There is deliberately **no contact form**. A form that posts nowhere is a
 * dead end that looks like a channel, and every route below reaches a person
 * today. Add one when there is an endpoint to receive it.
 */

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "Live chat",
    detail: "Fastest route",
    copy: "The Atlas launcher sits at the bottom-left of every page. For anything account-specific it hands off to a person.",
    href: "/support",
    action: "Open support",
  },
  {
    icon: Phone,
    title: "WhatsApp",
    detail: "+1 758 572 0353",
    copy: "The same number as the footer. Good for quick questions and for sending a screenshot of what you are seeing.",
    href: "https://wa.me/17585720353",
    action: "Message on WhatsApp",
    external: true,
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+1 758 572 0353",
    copy: "Speak to the desk directly during the 24/6 support window.",
    href: "tel:+17585720353",
    action: "Call the desk",
    external: true,
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@bytefx.com",
    copy: "Best for anything with a document attached — verification, a funding query, a formal complaint.",
    href: "mailto:support@bytefx.com",
    action: "Send an email",
    external: true,
  },
];

const BEFORE = [
  {
    title: "Check the FAQ first",
    copy: "Deposits, withdrawals, leverage, swap-free and platform questions are answered on the support page, usually faster than a reply arrives.",
    href: "/support",
    label: "Read the FAQ",
  },
  {
    title: "Have your account number ready",
    copy: "We cannot discuss a specific account without identifying it, and asking for it is the first thing any channel will do.",
  },
  {
    title: "Never send a password",
    copy: "ByteFX will not ask for your account password or a card PIN on any channel. Anyone who does is not ByteFX.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Company", href: "/company/about" },
          { label: "Contact us" },
        ]}
        title="Talk to a person, 24 hours a day, six days a week."
        lead="Support runs from the Sydney open to the New York close — the same hours the markets you trade are open."
      >
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13.5px] font-medium text-white backdrop-blur-sm">
          <Clock aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          24/6 — closed over the weekend, with the markets
        </p>
      </PageHero>

      <Section
        title="Every way to reach us"
        lead="Four channels, all of them staffed. Pick whichever suits what you are asking."
      >
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <RevealItem
              key={c.title}
              className="flex flex-col rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand">
                  <c.icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[17px] leading-tight font-bold tracking-[-0.02em] text-ink">
                    {c.title}
                  </span>
                  <span className="block text-[13px] text-muted">{c.detail}</span>
                </span>
              </span>

              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-body">
                {c.copy}
              </p>

              {c.external ? (
                <a
                  href={c.href}
                  className="mt-5 inline-flex text-[14px] font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {c.action}
                </a>
              ) : (
                <Link
                  href={c.href}
                  className="mt-5 inline-flex text-[14px] font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {c.action}
                </Link>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section bg="alt" title="Before you write in">
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {BEFORE.map((b) => (
            <RevealItem
              key={b.title}
              className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)]"
            >
              <p className="text-[18px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
                {b.title}
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                {b.copy}
              </p>
              {b.href && (
                <Link
                  href={b.href}
                  className="mt-4 inline-flex text-[14px] font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {b.label}
                </Link>
              )}
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[13px] leading-relaxed text-muted">
            ByteFX support can explain how the platform, funding and account
            terms work. It cannot tell you what to trade — that would be
            personalised investment advice, which we are not licensed to give
            and would not give on a chat window if we were.
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </main>
  );
}
