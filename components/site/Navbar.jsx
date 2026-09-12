"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bitcoin,
  Building2,
  Calculator,
  ChevronRight,
  CircleDollarSign,
  Download,
  Flame,
  Gem,
  Globe2,
  GraduationCap,
  Landmark,
  LifeBuoy,
  LineChart,
  Menu as MenuIcon,
  MonitorSmartphone,
  Newspaper,
  Rocket,
  ShieldCheck,
  Trophy,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

/* ============================================================
   NAVIGATION DATA
============================================================ */

const TRADING = [
  {
    title: "Account types",
    mobileLabel: "Account types",
    href: "/account-types",
    icon: CircleDollarSign,
    description: "Standard, Pro, Raw and demo accounts.",
  },
  {
    title: "Demo account",
    mobileLabel: "Demo account",
    href: "/demo",
    icon: LineChart,
    description: "Practise with live prices and virtual funds.",
    accent: "green",
  },
  {
    title: "Mobile trading",
    mobileLabel: "Mobile app",
    href: "/#download-app",
    icon: MonitorSmartphone,
    description: "Your account and the markets in one app.",
  },
  {
    title: "Funding & withdrawals",
    mobileLabel: "Funding",
    href: "/funding",
    icon: WalletCards,
    description: "Review supported account funding methods.",
    accent: "green",
  },
  {
    title: "Download centre",
    mobileLabel: "Downloads",
    href: "/download",
    icon: Download,
    description: "Get the platform for every device.",
  },
  {
    title: "Getting started",
    mobileLabel: "Getting started",
    href: "/getting-started",
    icon: Rocket,
    description: "Open, verify and prepare your account.",
    accent: "green",
  },
];

const MARKETS = [
  {
    title: "Forex",
    href: "/markets/forex",
    icon: Globe2,
    description: "Major, minor and exotic currency pairs.",
  },
  {
    title: "Crypto",
    href: "/markets/crypto",
    icon: Bitcoin,
    description: "Round-the-clock digital asset markets.",
    accent: "green",
  },
  {
    title: "Stocks",
    href: "/markets/stocks",
    icon: Building2,
    description: "Leading companies across global exchanges.",
  },
  {
    title: "Commodities",
    href: "/markets/commodities",
    icon: Gem,
    description: "Metals, agriculture and other essentials.",
    accent: "green",
  },
  {
    title: "Indices",
    href: "/markets/indices",
    icon: BarChart3,
    description: "Track major global market benchmarks.",
  },
  {
    title: "Energy",
    href: "/markets/energy",
    icon: Flame,
    description: "WTI, Brent and natural gas markets.",
    accent: "green",
  },
];

const TOOLS = [
  {
    label: "All trading tools",
    href: "/tools",
  },
  {
    label: "Economic calendar",
    href: "/tools/calendar",
  },
  {
    label: "Trading calculators",
    href: "/tools/calculators",
  },
  {
    label: "Market news",
    href: "/tools/news",
  },
];

const LEARN = [
  {
    title: "ByteFX School",
    mobileLabel: "School",
    href: "/school",
    icon: GraduationCap,
    description: "Practical lessons from first trade onward.",
  },
  {
    title: "Market news",
    mobileLabel: "Market news",
    href: "/tools/news",
    icon: Newspaper,
    description: "Stay current with the stories moving markets.",
    accent: "green",
  },
  {
    title: "Economic calendar",
    mobileLabel: "Calendar",
    href: "/tools/calendar",
    icon: Landmark,
    description: "Plan around important global events.",
  },
  {
    title: "Calculators",
    mobileLabel: "Calculators",
    href: "/tools/calculators",
    icon: Calculator,
    description: "Estimate margin, pip value and outcomes.",
    accent: "green",
  },
  {
    title: "Demo competition",
    mobileLabel: "Competition",
    href: "/competition",
    icon: Trophy,
    description: "Put your strategy to the test risk-free.",
  },
  {
    title: "Help centre",
    mobileLabel: "Help centre",
    href: "/support",
    icon: LifeBuoy,
    description: "Clear answers and direct support.",
    accent: "green",
  },
];

const COMPANY = [
  {
    label: "About ByteFX",
    href: "/company/about",
  },
  {
    label: "Why ByteFX",
    href: "/company/why-bytefx",
  },
  {
    label: "Trust & security",
    href: "/company/trust-security",
  },
  {
    label: "Contact us",
    href: "/company/contact",
  },
  {
    label: "Legal & compliance",
    href: "/legal",
  },
];

/* ============================================================
   DESKTOP DROPDOWN HELPERS
============================================================ */

function PanelLabel({ children }) {
  return (
    <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
      {children}
    </p>
  );
}

function ItemGrid({ items, className }) {
  return (
    <div className={cn("grid gap-0.5", className)}>
      {items.map(({ icon: Icon, ...item }) => (
        <ProductItem
          key={item.title}
          {...item}
          icon={<Icon className="h-4 w-4" strokeWidth={2} />}
        />
      ))}
    </div>
  );
}

/* ============================================================
   ACTIVE NAVIGATION
============================================================ */

function activeGroup(pathname) {
  if (
    pathname.startsWith("/markets") ||
    pathname.startsWith("/tools")
  ) {
    return "Markets & Tools";
  }

  if (
    pathname.startsWith("/school") ||
    pathname.startsWith("/competition") ||
    pathname.startsWith("/support")
  ) {
    return "Learn";
  }

  if (
    pathname.startsWith("/company") ||
    pathname.startsWith("/legal")
  ) {
    return "Company";
  }

  if (pathname.startsWith("/partnership")) {
    return "Partners";
  }

  if (
    pathname.startsWith("/account-types") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/download") ||
    pathname.startsWith("/funding") ||
    pathname.startsWith("/getting-started")
  ) {
    return "Trading";
  }

  return null;
}

function isCurrent(pathname, href) {
  if (href.includes("#")) return false;

  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

/* ============================================================
   NAVBAR
============================================================ */

export function Navbar() {
  const pathname = usePathname();

  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);

  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  const selected = activeGroup(pathname);

  /* ------------------------------------------------------------
     Close navigation when route changes
  ------------------------------------------------------------- */

  useEffect(() => {
    setActive(null);
    setOpen(false);
  }, [pathname]);

  /* ------------------------------------------------------------
     Mobile drawer accessibility
  ------------------------------------------------------------- */

  useEffect(() => {
    if (!open) return undefined;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);

        requestAnimationFrame(() => {
          menuButtonRef.current?.focus();
        });

        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        drawerRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";

      document.removeEventListener(
        "keydown",
        onKeyDown
      );

      window.removeEventListener(
        "resize",
        onResize
      );
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);

    requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  };

  /* ------------------------------------------------------------
     Mobile navigation
  ------------------------------------------------------------- */

  const mobileGroups = [
    {
      label: "Trading",
      links: TRADING.map((item) => ({
        label: item.mobileLabel,
        href: item.href,
      })),
    },
    {
      label: "Markets",
      links: MARKETS.map((item) => ({
        label: item.title,
        href: item.href,
      })),
    },
    {
      label: "Learn & tools",
      links: LEARN.map((item) => ({
        label: item.mobileLabel,
        href: item.href,
      })),
    },
    {
      label: "Company",
      links: COMPANY,
    },
  ];

  return (
    <header
      style={open ? { zIndex: 80 } : undefined}
      className="
        site-navbar-shell
        sticky
        top-0
        z-50
        w-full

        border-0
        border-transparent

        bg-transparent

        shadow-none

        backdrop-blur-none

        transition-none

        dark:bg-transparent
      "
    >
      {/* ========================================================
          MAIN NAVBAR
      ========================================================= */}

      <div
        className="
          container-x
          flex
          h-[72px]
          items-center
          justify-between
          gap-5

          lg:h-[76px]
        "
      >
        {/* ======================================================
            LOGO
        ======================================================= */}

        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="ByteFX home"
        >
          <Image
            src="/assets/Logo.webp"
            alt="ByteFX"
            width={384}
            height={82}
            priority
            className="h-[27px] w-auto lg:h-[29px]"
          />
        </Link>

        {/* ======================================================
            DESKTOP NAVIGATION
        ======================================================= */}

        <Menu
          setActive={setActive}
          className="hidden xl:flex"
        >
          {/* ----------------------------------------------------
              TRADING
          ----------------------------------------------------- */}

          <MenuItem
            setActive={setActive}
            active={active}
            item="Trading"
            href="/account-types"
            selected={selected === "Trading"}
          >
            <div className="grid w-[44rem] grid-cols-2 gap-4">
              <section>
                <PanelLabel>
                  Accounts & access
                </PanelLabel>

                <ItemGrid
                  items={TRADING.slice(0, 4)}
                  className="grid-cols-2"
                />
              </section>

              <section>
                <PanelLabel>
                  Start trading
                </PanelLabel>

                <ItemGrid
                  items={TRADING.slice(4)}
                />

                <Link
                  href="/signup"
                  className="
                    group/cta
                    mt-2
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    bg-brand-solid
                    px-4
                    py-3
                    text-white
                    transition-colors
                    hover:bg-brand-solid-hover
                  "
                >
                  <span>
                    <span className="block text-[12.5px] font-semibold">
                      Open a live account
                    </span>

                    <span className="mt-0.5 block text-[10.5px] text-white/68">
                      Get started in minutes
                    </span>
                  </span>

                  <ChevronRight
                    className="
                      h-4
                      w-4
                      transition-transform
                      group-hover/cta:translate-x-0.5
                    "
                  />
                </Link>
              </section>
            </div>
          </MenuItem>

          {/* ----------------------------------------------------
              MARKETS & TOOLS
          ----------------------------------------------------- */}

          <MenuItem
            setActive={setActive}
            active={active}
            item="Markets & Tools"
            href="/markets"
            selected={selected === "Markets & Tools"}
          >
            <div className="grid w-[50rem] grid-cols-[1fr_14rem] gap-5">
              <section>
                <PanelLabel>
                  Markets
                </PanelLabel>

                <ItemGrid
                  items={MARKETS}
                  className="grid-cols-2"
                />
              </section>

              <section className="border-l border-line pl-4">
                <PanelLabel>
                  Trader tools
                </PanelLabel>

                <div className="grid gap-0.5">
                  {TOOLS.map((item) => (
                    <HoveredLink
                      key={item.href}
                      href={item.href}
                    >
                      {item.label}
                    </HoveredLink>
                  ))}
                </div>
              </section>
            </div>
          </MenuItem>

          {/* ----------------------------------------------------
              LEARN
          ----------------------------------------------------- */}

          <MenuItem
            setActive={setActive}
            active={active}
            item="Learn"
            href="/school"
            selected={selected === "Learn"}
          >
            <div className="w-[42rem]">
              <PanelLabel>
                Knowledge hub
              </PanelLabel>

              <ItemGrid
                items={LEARN}
                className="grid-cols-2"
              />
            </div>
          </MenuItem>

          {/* ----------------------------------------------------
              COMPANY
          ----------------------------------------------------- */}

          <MenuItem
            setActive={setActive}
            active={active}
            item="Company"
            href="/company/about"
            selected={selected === "Company"}
          >
            <div className="grid w-[35rem] grid-cols-[1fr_14rem] gap-5">
              <section>
                <PanelLabel>
                  About ByteFX
                </PanelLabel>

                <div className="grid grid-cols-2 gap-0.5">
                  {COMPANY.map((item) => (
                    <HoveredLink
                      key={item.href}
                      href={item.href}
                    >
                      {item.label}
                    </HoveredLink>
                  ))}
                </div>
              </section>

              <Link
                href="/company/trust-security"
                className="
                  group/trust
                  flex
                  flex-col
                  justify-between
                  rounded-2xl
                  border
                  border-brand/15
                  bg-brand-50
                  p-4
                  text-brand
                  transition-colors
                  hover:border-brand/30
                "
              >
                <ShieldCheck
                  className="h-6 w-6"
                  strokeWidth={1.8}
                />

                <span className="mt-8">
                  <span className="block text-[13px] font-semibold">
                    Built around trust
                  </span>

                  <span className="mt-1 block text-[10.5px] leading-relaxed text-body">
                    See how your account is protected.
                  </span>
                </span>
              </Link>
            </div>
          </MenuItem>

          {/* ----------------------------------------------------
              PARTNERS
          ----------------------------------------------------- */}

          <MenuItem
            setActive={setActive}
            active={active}
            item="Partners"
            href="/partnership"
            selected={selected === "Partners"}
          />
        </Menu>

        {/* ======================================================
            RIGHT ACTIONS
        ======================================================= */}

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <span
            className="
              hidden
              h-6
              w-px
              bg-black/10
              dark:bg-white/15
              xl:block
            "
            aria-hidden="true"
          />

          {/* Login */}

          <Link
            href="/login"
            className="
              hidden
              rounded-full
              px-2
              py-2
              text-[14px]
              font-semibold
              text-ink
              transition-colors
              hover:text-brand
              sm:inline-flex
            "
          >
            Log in
          </Link>

          {/* Open account */}

          <Button
            as={Link}
            href="/signup"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Open account
          </Button>

          {/* Mobile hamburger */}

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-full

              border
              border-black/10

              bg-transparent

              text-ink

              shadow-none

              backdrop-blur-none

              transition-all
              duration-200

              hover:border-brand/40
              hover:bg-black/[0.035]
              hover:text-brand

              dark:border-white/15
              dark:bg-transparent
              dark:hover:border-brand/50
              dark:hover:bg-white/[0.05]

              xl:hidden
            "
          >
            <MenuIcon
              className="h-5 w-5"
              strokeWidth={2.1}
            />
          </button>
        </div>
      </div>

      {/* ========================================================
          MOBILE DRAWER
      ========================================================= */}

      {open ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* dark overlay */}

          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMenu}
            className="
              absolute
              inset-0
              bg-black/45
              backdrop-blur-sm
              dark:bg-black/60
            "
          />

          {/* drawer */}

          <div
            ref={drawerRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="
              absolute
              inset-y-0
              right-0

              flex
              w-[92%]
              max-w-[430px]
              flex-col

              border-l
              border-line

              bg-surface

              shadow-[0_0_70px_-20px_rgba(0,0,0,.48)]
            "
          >
            {/* ==================================================
                DRAWER HEADER
            =================================================== */}

            <div
              className="
                flex
                h-[72px]
                shrink-0
                items-center
                justify-between

                border-b
                border-line

                px-5
              "
            >
              <Link
                href="/"
                onClick={closeMenu}
                aria-label="ByteFX home"
              >
                <Image
                  src="/assets/Logo.webp"
                  alt="ByteFX"
                  width={384}
                  height={82}
                  className="h-[26px] w-auto"
                />
              </Link>

              <div className="flex items-center gap-2">
                <ThemeToggle />

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close navigation"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-full

                    border
                    border-line

                    bg-transparent

                    text-ink

                    transition-colors

                    hover:border-brand/35
                    hover:text-brand
                  "
                >
                  <X
                    className="h-4.5 w-4.5"
                    strokeWidth={2.2}
                  />
                </button>
              </div>
            </div>

            {/* ==================================================
                MOBILE LINKS
            =================================================== */}

            <nav
              aria-label="Mobile navigation"
              className="
                flex-1
                overflow-y-auto
                px-5
                py-5
              "
            >
              {mobileGroups.map((group) => (
                <section
                  key={group.label}
                  className="mb-6 last:mb-0"
                >
                  <p
                    className="
                      mb-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-muted
                    "
                  >
                    {group.label}
                  </p>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {group.links.map((item) => (
                      <Link
                        key={`${group.label}-${item.href}-${item.label}`}
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          `
                          rounded-lg
                          py-2.5
                          text-[13.5px]
                          font-medium
                          transition-colors
                          hover:text-brand
                          `,
                          isCurrent(
                            pathname,
                            item.href
                          )
                            ? "text-brand"
                            : "text-ink"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}

              {/* Partner link */}

              <Link
                href="/partnership"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  justify-between

                  rounded-xl

                  border
                  border-line

                  bg-alt

                  px-4
                  py-3.5

                  text-[13.5px]
                  font-semibold
                  text-ink

                  transition-colors

                  hover:border-brand/25
                  hover:text-brand
                "
              >
                Partner with ByteFX

                <Users
                  className="h-4 w-4 text-brand"
                  strokeWidth={2}
                />
              </Link>
            </nav>

            {/* ==================================================
                MOBILE BOTTOM ACTIONS
            =================================================== */}

            <div
              className="
                grid
                shrink-0
                grid-cols-2
                gap-3

                border-t
                border-line

                bg-alt/65

                px-5
                py-5
              "
            >
              <Button
                as={Link}
                href="/login"
                variant="ghost"
                size="md"
                onClick={closeMenu}
              >
                Log in
              </Button>

              <Button
                as={Link}
                href="/signup"
                size="md"
                onClick={closeMenu}
              >
                Open account
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}