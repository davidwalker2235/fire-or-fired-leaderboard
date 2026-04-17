"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  type LeaderboardEntry,
  toTop10,
} from "@/lib/leaderboard";

const POLL_MS = 60_000;

type Props = {
  initialRows: LeaderboardEntry[];
  initialError: string | null;
};

async function fetchTop10FromApi(): Promise<LeaderboardEntry[]> {
  const res = await fetch("/api/leaderboard", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("bad_response");
  }
  const data = (await res.json()) as LeaderboardEntry[];
  return toTop10(data);
}

export function LeaderboardLive({ initialRows, initialError }: Props) {
  const [rows, setRows] = useState<LeaderboardEntry[]>(initialRows);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const nextRows = await fetchTop10FromApi();
        if (cancelled) return;
        setRows(nextRows);
        setError(null);
      } catch {
        /* Mantenemos el último ranking válido; el error solo aplica a la carga inicial */
      }
    }

    if (initialError) {
      void refresh();
    }

    const id = window.setInterval(refresh, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [initialError]);

  if (error) {
    return (
      <p className="mx-auto max-w-sm shrink-0 text-center text-[11px] leading-relaxed text-[#ff6b6b] sm:text-xs">
        {error}
      </p>
    );
  }

  return (
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
  );
}
