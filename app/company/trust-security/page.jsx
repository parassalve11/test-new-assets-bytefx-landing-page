import { Trust } from "@/components/site/Trust";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata = {
  title: "Trust and Security",
  description:
    "The entity, the registration number, the addresses and the safeguards behind ByteFX Capital Ltd., stated plainly and in one place.",
};

export default function TrustSecurityPage() {
  return (
    <main>
      <Trust />
      <FinalCta />
    </main>
  );
}
