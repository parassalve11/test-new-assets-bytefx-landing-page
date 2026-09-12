import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Green is the ByteFX primary CTA — that is what the brand actually ships on
 * every conversion point. Blue stays for structure, navigation and secondary
 * emphasis. Do not swap them back.
 */
const VARIANTS = {
  // `on-go` and `brand-solid` are the two tokens that do NOT invert with the
  // theme: text on lime stays near-black, and a filled blue button stays dark
  // enough to carry white type. Plain `brand` lightens in dark mode for text
  // and hairlines, which is exactly what a fill must not do.
  primary:
    "bg-go text-on-go shadow-[0_8px_24px_rgba(76,210,1,0.32)] hover:bg-go-hover hover:shadow-[0_12px_30px_rgba(76,210,1,0.4)]",
  blue: "bg-brand-solid text-white shadow-[0_8px_24px_rgba(19,86,190,0.22)] hover:bg-brand-solid-hover hover:shadow-[0_12px_30px_rgba(19,86,190,0.28)]",
  ghost:
    "border border-line-strong bg-surface text-ink hover:border-brand hover:text-brand",
  onDark:
    "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/20",
  quiet: "text-brand hover:text-brand-700",
};

const SIZES = {
  sm: "h-9 px-4 text-[13.5px]",
  md: "h-11 px-5 text-[14.5px]",
  lg: "h-[52px] px-7 text-[15.5px]",
};

export function Button({
  as: Tag = "a",
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn(
        "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {children}
      {arrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2.5}
        />
      )}
    </Tag>
  );
}
