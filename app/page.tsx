import Image from "next/image";
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const LEADERBOARD_URL =
  "https://softwareengineering-gzbrg3f6evdpb5ff.canadacentral-01.azurewebsites.net/api/leaderboard";

type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
};

async function fetchTop10(): Promise<LeaderboardEntry[]> {
  const res = await fetch(LEADERBOARD_URL, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`Leaderboard HTTP ${res.status}`);
  }
  const data = (await res.json()) as LeaderboardEntry[];
  return [...data]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);
}

export default async function Home() {
  let rows: LeaderboardEntry[] = [];
  let error: string | null = null;

  try {
    rows = await fetchTop10();
  } catch {
    error = "No se pudo cargar el ranking.";
  }

  return (
    <div className="flex h-dvh min-h-0 w-full flex-row">
      <section className="relative h-full w-1/2 min-w-0 shrink-0 bg-[#0c0c0c]">
        <Image
          src="/cover.jpeg"
          alt="Fire or Fired — portada"
          fill
          className="object-contain object-center"
          priority
          sizes="50vw"
        />
      </section>

      <section
        className={`leaderboard-crt flex h-full w-1/2 min-w-0 shrink-0 flex-col overflow-y-auto border-l-4 border-[#ff9f1c] bg-[#0f0520] px-3 py-5 sm:px-6 sm:py-8 ${pixelFont.className}`}
      >
        <header className="mb-4 shrink-0 text-center sm:mb-6">
          <p className="mb-1 text-[8px] leading-tight tracking-widest text-[#2ec4b6] sm:text-[10px]">
            TOP PLAYERS
          </p>
          <h1 className="text-xs leading-snug text-[#ff9f1c] drop-shadow-[2px_2px_0_#8b2500] sm:text-sm">
            FIRE OR FIRED
          </h1>
          <p className="mt-1 text-[7px] text-[#cbf3f0]/80 sm:text-[9px]">
            HIGH SCORES
          </p>
        </header>

        {error ? (
          <p className="mx-auto max-w-sm shrink-0 text-center text-[9px] leading-relaxed text-[#ff6b6b]">
            {error}
          </p>
        ) : (
          <ol className="mx-auto flex w-full max-w-md flex-1 flex-col gap-1.5 sm:gap-2">
            {rows.map((row, index) => {
              const rank = index + 1;
              const rankStyle =
                rank === 1
                  ? "border-[#ffd60a] text-[#ffd60a]"
                  : rank === 2
                    ? "border-[#c0c0c0] text-[#e8e8e8]"
                    : rank === 3
                      ? "border-[#cd7f32] text-[#e9a66b]"
                      : "border-[#4361ee]/60 text-[#cbf3f0]";

              return (
                <li
                  key={row.id}
                  className={`flex items-center gap-2 border-2 bg-[#1b1033] px-2 py-1.5 shadow-[3px_3px_0_#000] sm:gap-3 sm:px-3 sm:py-2 sm:shadow-[4px_4px_0_#000] ${rankStyle}`}
                >
                  <span className="w-7 shrink-0 text-center text-[8px] sm:w-9 sm:text-[10px]">
                    #{rank}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[8px] sm:text-[10px]">
                    {row.name || "???"}
                  </span>
                  <span className="shrink-0 text-[8px] text-[#ff9f1c] sm:text-[10px]">
                    {row.points}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        <footer className="mt-4 shrink-0 text-center text-[6px] leading-relaxed text-[#4361ee]/70 sm:mt-6 sm:text-[8px]">
          INSERT COIN TO CONTINUE
        </footer>
      </section>
    </div>
  );
}
