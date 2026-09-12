import { Competition } from "@/components/site/Competition";

export const metadata = {
  title: "Trading Competition",
  description:
    "Follow the ByteFX monthly trading competition, compare live-account divisions and see the current leaderboard.",
};

export default function CompetitionPage() {
  return (
    <main>
      <Competition />
    </main>
  );
}
