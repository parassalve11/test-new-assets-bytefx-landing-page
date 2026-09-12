import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { PageHero } from "@/components/site/ToolsHero";
import { LEGAL_DOCS, getLegalDoc } from "@/lib/legal-data";

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }) {
  const { doc } = await params;
  const found = getLegalDoc(doc);
  if (!found) return {};

  return {
    title: found.title,
    description: found.summary,
    alternates: { canonical: `/legal/${found.slug}` },
  };
}

export default async function LegalDocPage({ params }) {
  const { doc } = await params;
  const found = getLegalDoc(doc);
  if (!found) notFound();

  const others = LEGAL_DOCS.filter((d) => d.slug !== found.slug);

  return (
    <main>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal" },
          { label: found.short },
        ]}
        title={found.title}
        lead={found.summary}
      />

      <Section>
        {/* A document that is only a scope summary says so at the top, not in
            a footnote. A reader who skims and assumes they have read the terms
            is exactly the failure this banner exists to prevent. */}
        {found.pending && (
          <Reveal className="mb-10 rounded-[20px] border border-line-strong bg-alt p-6 md:p-7">
            <p className="text-[15.5px] leading-relaxed text-ink">
              <strong className="font-semibold">
                This page summarises the document; it is not the document.
              </strong>{" "}
              The binding version is issued at account opening and is available
              from{" "}
              <Link href="/support" className="font-medium text-brand underline">
                support
              </Link>{" "}
              on request. Ask for it before you fund an account, not after.
            </p>
          </Reveal>
        )}

        <RevealGroup className="mx-auto max-w-3xl">
          {found.sections.map((s, i) => (
            <RevealItem
              key={s.heading}
              className={i === 0 ? "" : "mt-9 border-t border-line pt-9"}
            >
              <h2 className="text-[21px] leading-[1.25] font-bold tracking-[-0.025em] text-ink">
                {s.heading}
              </h2>
              <p className="mt-3.5 text-[15.5px] leading-relaxed text-body">
                {s.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl border-t border-line pt-8">
          <p className="eyebrow">Other documents</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {others.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/legal/${d.slug}`}
                  className="text-[14.5px] font-medium text-brand underline-offset-4 hover:underline"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </main>
  );
}
