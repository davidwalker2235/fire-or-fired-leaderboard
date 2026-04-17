export const LEADERBOARD_URL =
  "https://softwareengineering-gzbrg3f6evdpb5ff.canadacentral-01.azurewebsites.net/api/leaderboard";

export type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
};

export function toTop10(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);
}
