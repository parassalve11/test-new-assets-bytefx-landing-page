import { AuthPanel } from "@/components/site/AuthPanel";

export const metadata = {
  title: "Forgot password",
  description: "Request password-reset instructions for your ByteFX account.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <AuthPanel mode="forgot" />
    </main>
  );
}
