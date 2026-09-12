import Link from "next/link";

/**
 * The compact blue band every sub-page opens with — the hero treatment at a
 * smaller size, so an interior page is recognisably the same site without
 * repeating the landing page's full-height hero and its orbit.
 *
 * `crumbs` is a list of `{ label, href }`; the last entry renders as plain
 * text because you do not link the page you are on.
 */
export function PageHero({ crumbs = [], title, lead, children }) {
  return (
    <section className="relative -mt-[84px] overflow-hidden pt-[84px] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-tools absolute inset-0" />
        <div className="hero-tools-grid absolute inset-0" />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="container-x relative py-16 md:py-20">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="text-[13px] text-white/60">
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {i > 0 && (
                  <span aria-hidden="true" className="px-2">
                    /
                  </span>
                )}
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="h-section text-balance-i mt-5 max-w-[19ch] text-white">
          {title}
        </h1>

        {lead && (
          <p className="text-balance-i mt-5 max-w-[54ch] text-[16.5px] leading-relaxed text-white/80">
            {lead}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
