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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-4 pt-8">
          <Image
            src="/erni_academy_logo.PNG"
            alt="ERNI Academy"
            width={320}
            height={72}
            className="h-auto w-full max-w-[min(92%,20rem)] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
          />
        </div>
      </section>

      <section
        className={`leaderboard-crt flex h-full w-1/2 min-w-0 shrink-0 flex-col overflow-y-auto border-l-4 border-[#ff9f1c] bg-[#0f0520] px-4 py-6 sm:px-7 sm:py-9 ${pixelFont.className}`}
      >
        <header className="mb-5 shrink-0 text-center sm:mb-7">
          <p className="mb-1.5 text-[10px] leading-tight tracking-widest text-[#2ec4b6] sm:text-xs">
            TOP PLAYERS
          </p>
          <h1 className="text-sm leading-snug text-[#ff9f1c] drop-shadow-[3px_3px_0_#8b2500] sm:text-base">
            FIRE OR FIRED
          </h1>
          <p className="mt-1.5 text-[9px] text-[#cbf3f0]/80 sm:text-[11px]">
            HIGH SCORES
          </p>
        </header>

        {error ? (
          <p className="mx-auto max-w-sm shrink-0 text-center text-[11px] leading-relaxed text-[#ff6b6b] sm:text-xs">
            {error}
          </p>
        ) : (
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
            <ol className="flex shrink-0 flex-col gap-2 sm:gap-2.5">
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
                    className={`flex items-center gap-2.5 border-[3px] bg-[#1b1033] px-3 py-2 shadow-[4px_4px_0_#000] sm:gap-3.5 sm:px-4 sm:py-2.5 sm:shadow-[5px_5px_0_#000] ${rankStyle}`}
                  >
                    <span className="w-9 shrink-0 text-center text-[10px] sm:w-11 sm:text-xs">
                      #{rank}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[10px] sm:text-xs">
                      {row.name || "???"}
                    </span>
                    <span className="min-w-[2.5rem] shrink-0 text-right text-[10px] text-[#ff9f1c] sm:min-w-[3rem] sm:text-xs">
                      {row.points}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex shrink-0 justify-center sm:mt-7">
              <Image
                src="/qr-game.png"
                alt="Código QR para abrir el juego Fire or Fired"
                width={180}
                height={180}
                className="border-[3px] border-[#4361ee] bg-white p-1 shadow-[4px_4px_0_#000] [image-rendering:pixelated]"
              />
            </div>
          </div>
        )}

        <footer className="mt-5 shrink-0 text-center text-[8px] leading-relaxed sm:mt-7 sm:text-[18px]">
          <span className="arcade-blink inline-block text-[#8da4ff] drop-shadow-[1px_1px_0_#1a1a3e]">
            Scan to play!
          </span>
        </footer>
      </section>
    </div>
  );
}
