import Link from "next/link";
import { AlertTriangle, ArrowRight, FileText } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PageHero } from "@/components/site/ToolsHero";
import { LEGAL_DOCS } from "@/lib/legal-data";

export const metadata = {
  title: "Legal",
  description:
    "Terms and conditions, privacy policy, risk disclosure and AML/KYC policy — what each document covers and where to get the binding copy.",
  alternates: { canonical: "/legal" },
};

/**
 * The legal hub. `pending` documents are labelled as pending on their own card
 * rather than looking identical to the one that is complete — see the note at
 * the top of `lib/legal-data.js` for why the binding text is not invented.
 */
export default function LegalPage() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Legal" }]}
        title="The documents, and what each one is for."
        lead="Four documents govern your relationship with ByteFX. This page says what each covers, which are published in full, and how to obtain the binding copy of the rest."
      />

      <Section title="Documents">
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {LEGAL_DOCS.map((d) => (
            <RevealItem key={d.slug}>
              <Link
                href={`/legal/${d.slug}`}
                className="group flex h-full flex-col rounded-[20px] border border-line bg-surface p-7 shadow-[var(--sh-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-[var(--sh-lg)] motion-reduce:transform-none"
              >
                <span className="flex items-start justify-between gap-4">
                  <span
                    className={
                      d.slug === "risk"
                        ? "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-down/10 text-down"
                        : "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand"
                    }
                  >
                    {d.slug === "risk" ? (
                      <AlertTriangle aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <FileText aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                    )}
                  </span>
                  <span
                    className={
                      d.pending
                        ? "rounded-full border border-line bg-alt px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-muted"
                        : "rounded-full bg-go/10 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-go-600"
                    }
                  >
                    {d.pending ? "Summary only" : "Published in full"}
                  </span>
                </span>

                <span className="mt-5 block text-[20px] leading-[1.2] font-bold tracking-[-0.025em] text-ink transition-colors group-hover:text-brand">
                  {d.title}
                </span>
                <span className="mt-2.5 block flex-1 text-[14.5px] leading-relaxed text-body">
                  {d.summary}
                </span>

                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand">
                  Read
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[13px] leading-relaxed text-muted">
            Where a document is marked “summary only”, the page describes its
            scope; the binding version is issued at account opening and is
            available from support on request. Read the risk disclosure before
            you fund an account — it is published in full and it is the one
            that changes decisions.
          </p>
        </Reveal>
      </Section>
    </main>
  );
}
