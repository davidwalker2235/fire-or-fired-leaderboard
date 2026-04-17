import Image from "next/image";
import { Press_Start_2P } from "next/font/google";
import { LeaderboardLive } from "@/app/leaderboard-live";
import {
  LEADERBOARD_URL,
  type LeaderboardEntry,
  toTop10,
} from "@/lib/leaderboard";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

async function fetchTop10(): Promise<LeaderboardEntry[]> {
  const res = await fetch(LEADERBOARD_URL, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Leaderboard HTTP ${res.status}`);
  }
  const data = (await res.json()) as LeaderboardEntry[];
  return toTop10(data);
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

        <LeaderboardLive initialRows={rows} initialError={error} />

        <footer className="mt-5 shrink-0 text-center text-[8px] leading-relaxed sm:mt-7 sm:text-[18px]">
          <span className="arcade-blink inline-block text-[#8da4ff] drop-shadow-[1px_1px_0_#1a1a3e]">
            Scan to play!
          </span>
        </footer>
      </section>
    </div>
  );
}
