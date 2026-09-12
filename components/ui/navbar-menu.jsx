"use client";

import { useId, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const panelTransition = {
  type: "spring",
  mass: 0.45,
  damping: 19,
  stiffness: 220,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export function MenuItem({
  setActive,
  active,
  item,
  href = "#",
  selected = false,
  children,
}) {
  const open = active === item;
  const hasChildren = Boolean(children);
  const triggerRef = useRef(null);
  const panelId = useId();

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
  };

  const handleKeyDown = (event) => {
    if (!hasChildren) return;

    if (event.key === "ArrowDown" && event.target === triggerRef.current) {
      event.preventDefault();
      setActive(item);
      requestAnimationFrame(() => {
        document.getElementById(panelId)?.querySelector("a[href]")?.focus();
      });
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setActive(null);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      onMouseEnter={() => setActive(hasChildren ? item : null)}
      onFocusCapture={() => hasChildren && setActive(item)}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
      className="relative flex h-full items-center"
    >
      <Link
        ref={triggerRef}
        href={href}
        aria-haspopup={hasChildren ? "true" : undefined}
        aria-expanded={hasChildren ? open : undefined}
        aria-controls={hasChildren ? panelId : undefined}
        className={cn(
          "group/nav relative flex h-full items-center gap-1.5 whitespace-nowrap px-0.5 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-200",
          open || selected ? "text-brand" : "text-ink hover:text-brand"
        )}
      >
        {item}
        {hasChildren ? (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted transition-transform duration-200 group-hover/nav:text-brand",
              open && "rotate-180 text-brand"
            )}
            strokeWidth={2.3}
          />
        ) : null}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 bottom-0 h-0.5 origin-center rounded-full bg-brand transition-transform duration-200",
            open || selected ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
          )}
        />
      </Link>

      {hasChildren && open ? (
        <motion.div
          initial={{ opacity: 0, y: 9, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={panelTransition}
          className="absolute top-full left-1/2 z-30 -translate-x-1/2 pt-3"
        >
          <div
            id={panelId}
            role="group"
            aria-label={`${item} links`}
            className="nav-mega-panel overflow-hidden rounded-[22px] border border-line bg-surface p-2 shadow-[0_24px_70px_-26px_rgba(1,6,26,.38)]"
          >
            <div className="w-max p-3">{children}</div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

export function Menu({ setActive, className, children }) {
  return (
    <nav
      aria-label="Primary navigation"
      onMouseLeave={() => setActive(null)}
      className={cn("flex h-full items-center gap-7", className)}
    >
      {children}
    </nav>
  );
}

export function HoveredLink({ children, className, ...rest }) {
  return (
    <Link
      {...rest}
      className={cn(
        "group/link flex items-center justify-between gap-4 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand",
        className
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand opacity-0 transition-opacity group-hover/link:opacity-100"
      />
    </Link>
  );
}

export function ProductItem({ title, description, href, icon, accent = "blue" }) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 gap-3 rounded-xl p-2.5 transition-colors hover:bg-alt"
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:-translate-y-0.5",
          accent === "green"
            ? "border-go/20 bg-go-50 text-go-600"
            : "border-brand/15 bg-brand-50 text-brand"
        )}
      >
        {icon}
      </span>
      <span className="block min-w-0">
        <span className="block text-[13.5px] font-semibold text-ink transition-colors group-hover:text-brand">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block max-w-[15rem] text-[11.5px] leading-[1.45] text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
