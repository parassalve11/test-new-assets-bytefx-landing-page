import { AlertTriangle, Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Deliberately plain: hairline columns, no cards, no glow. Restraint reads as
 * credibility in this section.
 *
 * Entity name, registration number, addresses, contacts and the restricted
 * list are taken verbatim from bytefx.com. Anything we cannot source carries
 * a visible [LEGAL REVIEW] badge so it cannot ship by accident.
 */
const FACTS = [
  {
    label: "Registered entity",
    value: "ByteFX Capital Ltd.",
    note: "Registration No. 2025-00893",
  },
  {
    label: "Jurisdiction",
    value: "Saint Lucia",
    note: "Registered and physical offices at Rodney Bay, Gros-Islet",
  },
  {
    label: "Client funds",
    value: "Held in segregated accounts",
    note: "Separate from company operating capital",
    review: true,
  },
  {
    label: "Account security",
    value: "2FA and encrypted transfers",
    note: "Optional two-factor authentication on every login",
    review: true,
  },
];

const CONTACTS = [
  {
    icon: MapPin,
    label: "Registered address",
    value:
      "Ground Floor, The Sotheby Building, Rodney Village, Rodney Bay, Gros-Islet, Saint Lucia",
  },
  { icon: Phone, label: "Global support", value: "+1-758-572-0353" },
  { icon: Mail, label: "Email", value: "support@bytefx.com" },
];

export function Trust() {
  return (
    <Section
      id="trust"
      bg="alt"
      title={
        <>
          Who you are sending money to.
        </>
      }
      lead="The entity, the registration and the safeguards, stated plainly and in one place."
    >
      <Reveal className="grid divide-y divide-line border-y border-line md:grid-cols-4 md:divide-x md:divide-y-0">
        {FACTS.map((f) => (
          <div key={f.label} className="px-0 py-6 md:px-6 md:py-8 md:first:pl-0">
            <p className="eyebrow">{f.label}</p>
            <p className="mt-2.5 text-[17px] leading-snug font-semibold text-ink">
              {f.value}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              {f.note}
            </p>
            {f.review && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded bg-warn-50 px-2 py-1 text-[10.5px] font-semibold tracking-[0.04em] text-warn-600 uppercase">
                <AlertTriangle className="h-3 w-3" strokeWidth={2.6} />
                Legal review
              </p>
            )}
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.06} className="mt-10 grid gap-6 md:grid-cols-3">
        {CONTACTS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunken text-body">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span>
                <span className="eyebrow block">{c.label}</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-body">
                  {c.value}
                </span>
              </span>
            </div>
          );
        })}
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-8 rounded-xl border border-line bg-alt px-5 py-4"
      >
        <p className="text-[13.5px] leading-relaxed text-body">
          <span className="font-semibold text-ink">
            Restricted jurisdictions:
          </span>{" "}
          services are not offered to residents of the UAE, India, USA, China,
          Iran, North Korea, and other sanctioned regions.
        </p>
      </Reveal>
    </Section>
  );
}
