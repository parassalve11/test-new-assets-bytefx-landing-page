import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Support",
  description:
    "Deposits, withdrawals, leverage, swap-free accounts and platform questions — answered. Our team is on chat and email 24 hours a day, six days a week.",
};

export default function SupportPage() {
  return (
    <main>
      <Faq />
      <FinalCta />
    </main>
  );
}
