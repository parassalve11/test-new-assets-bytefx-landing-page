import { AuthPanel } from "@/components/site/AuthPanel";

export const metadata = {
  title: "Verify email",
  description: "Verify the email address connected to your ByteFX account.",
  alternates: { canonical: "/verify-email" },
  robots: { index: false, follow: true },
};

export default function VerifyEmailPage() {
  return (
    <main>
      <AuthPanel mode="verify" />
    </main>
  );
}
