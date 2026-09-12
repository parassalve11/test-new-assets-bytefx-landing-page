"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Globe2, Search } from "lucide-react";

import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

/**
 * The country picker on the signup form.
 *
 * A native `<select>` cannot carry a flag, and the emoji flags it would have
 * to fall back on do not render on Windows at all, so this is a listbox built
 * by hand over the SVG set in `public/assets/flags/`. It keeps the shape of a
 * real combobox — a filter field that owns `aria-activedescendant`, arrow
 * keys, Enter, Escape, click-outside — plus a hidden input so the surrounding
 * `<form>` still submits a country.
 *
 * That hidden input deliberately carries no `required`: a zero-size control
 * cannot be focused, and the browser refuses to report a validation message
 * it cannot scroll to, which silently deadlocks the whole form. The signup
 * handler checks for a country itself instead.
 *
 * All 245 rows sit in the DOM at once. That is cheap: the flags are
 * `loading="lazy"`, so only the dozen on screen are fetched, and the filter
 * runs over a lowercased haystack precomputed in `lib/countries.js`.
 */
export function CountrySelect({
  id = "country",
  name = "country",
  value,
  onChange,
  className,
  placeholder = "Select your country",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const listId = useId();
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const triggerRef = useRef(null);
  // Set when the pointer, not the keyboard, moved the active row. Without it
  // the scroll-into-view below fights the mouse: scrolling the list slides a
  // new row under a stationary cursor, that row's mouseenter moves `active`,
  // which scrolls again — a loop that pins the renderer.
  const pointerMoved = useRef(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    // Names that *start* with the query lead — typing "in" should reach India
    // before Argentina, which merely contains it.
    const starts = [];
    const rest = [];
    for (const country of COUNTRIES) {
      if (!country.search.includes(q)) continue;
      (country.name.toLowerCase().startsWith(q) ? starts : rest).push(country);
    }
    return starts.concat(rest);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
    else setQuery("");
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    if (pointerMoved.current) {
      pointerMoved.current = false;
      return;
    }
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => {
        const next = index + step;
        if (next < 0) return results.length - 1;
        if (next >= results.length) return 0;
        return next;
      });
      return;
    }
    if (event.key === "Enter" && open) {
      event.preventDefault();
      const country = results[active];
      if (country) {
        onChange?.(country);
        close();
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value?.code ?? ""} />

      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={onKeyDown}
        className={cn(
          className,
          "relative flex items-center gap-2 pr-10 text-left",
          !value && "text-[#8794ad] dark:text-white/38"
        )}
      >
        {value ? (
          <FlagImage
            country={value}
            className="absolute top-1/2 left-3.5 -translate-y-1/2"
          />
        ) : (
          <Globe2
            aria-hidden="true"
            className="absolute top-1/2 left-3.5 h-[17px] w-[17px] -translate-y-1/2 text-[#7183a3] dark:text-white/42"
            strokeWidth={1.9}
          />
        )}
        <span className="truncate">{value ? value.name : placeholder}</span>
        {value ? (
          <span className="ml-auto shrink-0 pl-2 text-[12.5px] font-semibold tabular-nums text-[#5c6b86] dark:text-white/50">
            {value.dial}
          </span>
        ) : null}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#7183a3] transition-transform duration-200 dark:text-white/42",
            open && "-translate-y-1/2 rotate-180"
          )}
          strokeWidth={2}
        />
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-[#ccd2da] bg-white shadow-[0_28px_60px_-28px_rgba(4,18,43,.55)] dark:border-white/12 dark:bg-[#141a22]">
          <div className="relative border-b border-[#e5e9ef] p-2 dark:border-white/8">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-[#7183a3] dark:text-white/38"
              strokeWidth={1.9}
            />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search countries"
              aria-label="Search countries"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                results[active] ? `${listId}-${results[active].code}` : undefined
              }
              autoComplete="off"
              className="h-10 w-full rounded-lg bg-[#f2f5f9] pr-3 pl-9 text-[13.5px] text-[#101a2e] outline-none placeholder:text-[#8794ad] focus:ring-2 focus:ring-[#1356be]/25 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/34"
            />
          </div>

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Country"
            className="max-h-[262px] overflow-y-auto overscroll-contain py-1"
          >
            {results.map((country, index) => {
              const selected = value?.code === country.code;
              return (
                <li key={country.code}>
                  <button
                    type="button"
                    id={`${listId}-${country.code}`}
                    role="option"
                    aria-selected={selected}
                    data-active={index === active}
                    tabIndex={-1}
                    onMouseEnter={() => {
                      if (index === active) return;
                      pointerMoved.current = true;
                      setActive(index);
                    }}
                    onClick={() => {
                      onChange?.(country);
                      close();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13.5px] text-[#233049] transition-colors dark:text-white/82",
                      index === active && "bg-[#eef3fb] dark:bg-white/[0.07]",
                      selected && "font-semibold"
                    )}
                  >
                    <FlagImage country={country} />
                    <span className="truncate">{country.name}</span>
                    <span className="ml-auto shrink-0 pl-2 text-[12px] tabular-nums text-[#6d7c95] dark:text-white/45">
                      {country.dial}
                    </span>
                    {selected ? (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-[#1356be] dark:text-[#7eb0ff]"
                        strokeWidth={2.6}
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}

            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-[12.5px] text-[#7786a1] dark:text-white/42">
                No country matches “{query}”.
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** One flag, at the 3:2 the source set is drawn in. */
export function FlagImage({ country, className }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- a static SVG has
       nothing for the image optimiser to do, and routing 245 of them through
       it would only add a round trip per row. */
    <img
      src={country.flag}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={21}
      height={14}
      className={cn(
        "h-[14px] w-[21px] shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(1,6,26,.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,.18)]",
        className
      )}
    />
  );
}
