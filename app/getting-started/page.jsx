import { HowItWorks } from "@/components/site/HowItWorks";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Getting Started",
  description:
    "Sign up, verify, add funds, trade. Most ByteFX accounts are funded and trading the same day — here is the whole sequence in four steps.",
};

export default function GettingStartedPage() {
  return (
    <main>
      <HowItWorks />
      <FinalCta />
    </main>
  );
}
