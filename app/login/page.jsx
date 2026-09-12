import { AuthPanel } from "@/components/site/AuthPanel";

export const metadata = {
  title: "Login",
  description:
    "Sign in to the ByteFX client area to trade, fund your account and manage withdrawals.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <main>
      <AuthPanel mode="login" />
    </main>
  );
}
