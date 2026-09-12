import { AboutExperience } from "@/components/site/AboutExperience";

export const metadata = {
  title: "About ByteFX",
  description:
    "Discover the thinking behind ByteFX: clear market access, connected account tools and a focused trading experience.",
  alternates: { canonical: "/company/about" },
};

export default function AboutPage() {
  return (
    <main>
      <AboutExperience />
    </main>
  );
}
