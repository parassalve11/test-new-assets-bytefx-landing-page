import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * Section hierarchy is the H2 plus the white / `bg-alt` alternation — nothing
 * above the heading. The kicker line every section used to carry ("Markets",
 * "Funding", "Mobile"…) restated the heading directly underneath it, so it was
 * a word of chrome on every screen and it is gone. Labels *inside* a card or a
 * table still use the `eyebrow` class; that is a different job.
 *
 * `bg` picks the surface: white, `alt`, the arc wash, or the saturated blue
 * band, which inverts its own header to white type.
 */
export function Section({
  id,
  title,
  lead,
  align = "left",
  bg = "white",
  aside,
  className,
  headerClassName,
  children,
}) {
  const onDark = bg === "brand";

  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        bg === "alt" && "bg-alt",
        bg === "wash" && "arc-wash",
        onDark && "band-brand relative overflow-hidden text-white",
        className
      )}
    >
      {onDark && (
        <div className="band-grid pointer-events-none absolute inset-0 opacity-70" />
      )}

      <div className="container-x relative">
        {(title || lead) && (
          <div
            className={cn(
              "mb-10 md:mb-14",
              align === "center" && "mx-auto max-w-2xl text-center",
              aside && "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
              headerClassName
            )}
          >
            <div className={cn(align === "center" ? "" : "max-w-2xl")}>
              {title && (
                <Reveal
                  as="h2"
                  className={cn("h-section", onDark && "text-white")}
                >
                  {title}
                </Reveal>
              )}
              {lead && (
                <Reveal
                  as="p"
                  delay={0.05}
                  className={cn(
                    "mt-4 text-[16.5px] leading-relaxed text-balance-i",
                    onDark ? "text-white/80" : "text-body"
                  )}
                >
                  {lead}
                </Reveal>
              )}
            </div>
            {aside && <div className="shrink-0">{aside}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
