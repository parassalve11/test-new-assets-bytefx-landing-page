import { Poppins } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AtlasChat } from "@/components/site/AtlasChat";
import { SiteShell } from "@/components/site/SiteShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL("https://www.bytefx.com"),
  title: {
    default: "ByteFX | Trading Platform for Forex, Crypto, Indices & Stocks",
    template: "%s | ByteFX",
  },
  description:
    "Trade 150+ instruments with leverage up to 1:2000, spreads from 0.0 pips and ~20ms execution. Standard, Pro and Raw accounts on MetaTrader 5.",
  icons: {
    icon: [
      {
        url: "/assets/payment_methods/bytefx-logo.webp",
        type: "image/webp",
      },
    ],
    shortcut: "/assets/payment_methods/bytefx-logo.webp",
    apple: "/assets/payment_methods/bytefx-logo.webp",
  },
  openGraph: {
    title: "ByteFX | Discover your trading edge",
    description:
      "150+ instruments. Leverage up to 1:2000. Spreads from 0.0 pips. ~20ms execution.",
    type: "website",
  },
};

export const viewport = {
  // ThemeToggle keeps this in sync after a manual mode change.
  themeColor: "#f4f6f8",
  width: "device-width",
  initialScale: 1,
};

/**
 * Resolve the saved theme before first paint. On a first visit, follow the
 * device preference; after the navbar toggle is used, the explicit choice
 * wins on every route and reload.
 */
const THEME_SCRIPT = `(function(){try{var saved=localStorage.getItem("bytefx:theme");var theme=saved==="dark"||saved==="light"?saved:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",theme);document.documentElement.style.colorScheme=theme}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`;

/**
 * Chrome lives here, not in the pages: the announcement bar, the sticky navbar,
 * the footer and the Atlas assistant are identical on the landing page and
 * every sub-page, and the navbar's scroll/menu state survives client-side
 * navigation this way.
 *
 * `AtlasChat` renders last so its fixed launcher is the final thing in the
 * stacking context — it has to sit over the footer as well as the page.
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={poppins.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <SiteShell
          announcement={<AnnouncementBar />}
          navbar={<Navbar />}
          footer={<Footer />}
          atlas={<AtlasChat />}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
