import Image from "next/image";
import { Linkedin } from "lucide-react";
import { BrandGlyph } from "@/components/ui/brand-icons";

const COLUMNS = [
  {
    title: "Markets",
    links: [
      { label: "Forex", href: "/markets/forex" },
      { label: "Crypto", href: "/markets/crypto" },
      { label: "Stocks", href: "/markets/stocks" },
      { label: "Commodities", href: "/markets/commodities" },
      { label: "Indices", href: "/markets/indices" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Account Types", href: "/#accounts" },
      { label: "Competition", href: "/competition" },
      { label: "Partnership", href: "/partnership" },
      { label: "Tools", href: "/tools" },
      { label: "About ByteFX", href: "/company/about" },
      { label: "Why ByteFX", href: "/company/why-bytefx" },
      { label: "Trust & Security", href: "/company/trust-security" },
      { label: "Getting Started", href: "/getting-started" },
      { label: "Support", href: "/support" },
    ],
  },
];

const COMPANY = [
  {
    label: "Registered address",
    value:
      "Ground Floor, The Sotheby Building, Rodney Village, Rodney Bay, Gros-Islet, Saint Lucia.",
  },
  {
    label: "Physical address",
    value: "Office No. 1, Rodney Quay, Rodney Bay, Gros Islet, Saint Lucia.",
  },
  { label: "Registration No.", value: "2025-00893" },
  { label: "Global support", value: "+1-758-572-0353", href: "tel:+17585720353" },
  { label: "Email", value: "support@bytefx.com", href: "mailto:support@bytefx.com" },
];

const LEGAL = [
  {
    title: "Risk Warning",
    body: "Trading Forex, CFDs, and other leveraged financial instruments involves a high level of risk and may not be suitable for all investors. Fully understand the risks involved and ensure that you can afford to sustain a complete loss of your invested capital.",
  },
  {
    title: "Legal Disclaimer",
    body: "The information on this website is general. ByteFX Capital Ltd. cannot be held liable for its relevance or accuracy. We do not provide investment advice. Review our Terms & Conditions for details.",
  },
  {
    title: "Restricted Jurisdictions",
    body: "Services are not offered to residents of the UAE, India, USA, China, Iran, North Korea, and other sanctioned regions.",
  },
];

const POLICIES = [
  { label: "Terms & Conditions", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Risk Disclosure", href: "/legal/risk" },
  { label: "AML Policy", href: "/legal/aml" },
  { label: "Legal & Compliance", href: "/legal" },
];

/* Real brand marks, except LinkedIn which simple-icons no longer ships. */
const SOCIALS = [
  { label: "X", href: "https://x.com", brand: "x" },
  { label: "Instagram", href: "https://instagram.com", brand: "instagram" },
  { label: "Telegram", href: "https://telegram.org", brand: "telegram" },
  { label: "YouTube", href: "https://youtube.com", brand: "youtube" },
  { label: "WhatsApp", href: "https://wa.me/17585720353", brand: "whatsapp" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="platinum-surface relative isolate overflow-hidden border-t border-line-strong/70 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div
        aria-hidden="true"
        className="platinum-grain pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay"
      />

      <div className="container-x relative z-10 py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.05fr_0.95fr_1.25fr] lg:gap-12">
          {/* Brand ------------------------------------------------- */}
          <div className="md:col-span-2 lg:col-span-1">
            <Image
              src="/assets/Logo.webp"
              alt="ByteFX"
              width={384}
              height={82}
              className="h-[33px] w-auto"
            />
            <p className="mt-5 max-w-xs text-[17px] leading-relaxed font-medium text-ink">
              Discover your trading edge.
            </p>

            <p className="mt-8 text-[11px] font-semibold tracking-[0.08em] text-ink/60 uppercase">
              Connect with ByteFX
            </p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong/70 bg-white/45 text-body shadow-xs transition-[transform,color,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white/80 hover:text-brand hover:shadow-sm dark:bg-surface/55 dark:hover:bg-surface/90"
                    >
                      {s.brand ? (
                        <BrandGlyph name={s.brand} className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Link columns ------------------------------------------ */}
          <div className="grid grid-cols-2 gap-8">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-[11px] font-semibold tracking-[0.08em] text-ink/60 uppercase">
                  {col.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="group/link inline-flex items-center gap-2 text-[14px] font-medium text-body transition-colors hover:text-brand"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-ink/20 transition-colors group-hover/link:bg-brand"
                        />
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Company ----------------------------------------------- */}
          <div className="rounded-[24px] border border-white/70 bg-white/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_48px_-36px_rgba(1,6,26,0.34)] sm:p-7 dark:border-white/10 dark:bg-surface/55 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_48px_-30px_rgba(0,0,0,0.5)]">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-ink/60 uppercase">
              Company details
            </h2>
            <dl className="mt-5 space-y-4">
              {COMPANY.map((c) => (
                <div
                  key={c.label}
                  className="border-b border-line-strong/60 pb-4 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[11.5px] font-medium text-ink/60">
                    {c.label}
                  </dt>
                  <dd className="mt-1 text-[13.5px] leading-relaxed text-body">
                    {c.href ? (
                      <a
                        href={c.href}
                        className="font-medium text-brand underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
                      >
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Legal --------------------------------------------------- */}
        <section
          aria-labelledby="footer-legal-title"
          className="mt-12 border-y border-line-strong/70 py-7"
        >
          <h2
            id="footer-legal-title"
            className="text-[11px] font-semibold tracking-[0.08em] text-ink/60 uppercase"
          >
            Legal information
          </h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {LEGAL.map((l) => (
              <article key={l.title} className="border-l border-ink/10 pl-4">
                <h3 className="text-[12.5px] font-semibold text-ink">
                  {l.title}
                </h3>
                <p className="mt-2 text-[12px] leading-[1.65] text-body">
                  {l.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[12.5px] text-body">
            &copy; 2021-2026 ByteFX Capital Ltd. Built for the modern trader.
          </p>
          <ul
            className="flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Legal policies"
          >
            {POLICIES.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  className="text-[12.5px] font-medium text-body transition-colors hover:text-brand"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
