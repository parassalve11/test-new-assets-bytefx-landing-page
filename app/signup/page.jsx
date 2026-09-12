import { AuthPanel } from "@/components/site/AuthPanel";

export const metadata = {
  title: "Open an account",
  description:
    "Register, verify and fund a ByteFX account. Standard opens from $20, on MetaTrader 5 and TradingView.",
  alternates: { canonical: "/signup" },
  robots: { index: true, follow: true },
};

export default function SignupPage() {
  return (
    <main>
      <AuthPanel mode="signup" />
    </main>
  );
}
