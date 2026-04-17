"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const COVER_SRC = "/cover.jpeg";
const ANIM_1 = "/Animation1.mp4";
const ANIM_2 = "/Animation2.mp4";
const ANIM_3 = "/Animation3.mp4";
const ANIM_4 = "/Animation4.mp4";

const WAIT_MS = 60_000;

/**
 * … → Anim3 → cover + 1 min → Anim4 → cover + 1 min → (bucle desde Anim1)
 */
type Phase =
  | "cover_before_1"
  | "playing_1"
  | "cover_before_2"
  | "playing_2"
  | "cover_before_3"
  | "playing_3"
  | "cover_before_4"
  | "playing_4";

export function LeftPanel() {
  const [phase, setPhase] = useState<Phase>("cover_before_1");
  const waitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      phase !== "cover_before_1" &&
      phase !== "cover_before_2" &&
      phase !== "cover_before_3" &&
      phase !== "cover_before_4"
    ) {
      return;
    }

    waitTimerRef.current = window.setTimeout(() => {
      waitTimerRef.current = null;
      setPhase((p) => {
        if (p === "cover_before_1") return "playing_1";
        if (p === "cover_before_2") return "playing_2";
        if (p === "cover_before_3") return "playing_3";
        if (p === "cover_before_4") return "playing_4";
        return p;
      });
    }, WAIT_MS);

    return () => {
      if (waitTimerRef.current !== null) {
        window.clearTimeout(waitTimerRef.current);
        waitTimerRef.current = null;
      }
    };
  }, [phase]);

  const handleVideoEnded = () => {
    setPhase((p) => {
      if (p === "playing_1") return "cover_before_2";
      if (p === "playing_2") return "cover_before_3";
      if (p === "playing_3") return "cover_before_4";
      if (p === "playing_4") return "cover_before_1";
      return p;
    });
  };

  const playing =
    phase === "playing_1" ||
    phase === "playing_2" ||
    phase === "playing_3" ||
    phase === "playing_4";
  const videoSrc =
    phase === "playing_1"
      ? ANIM_1
      : phase === "playing_2"
        ? ANIM_2
        : phase === "playing_3"
          ? ANIM_3
          : phase === "playing_4"
            ? ANIM_4
            : null;

  return (
    <section className="relative h-full w-1/2 min-w-0 shrink-0 bg-[#0c0c0c]">
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${playing ? "opacity-0" : "opacity-100"}`}
        aria-hidden={playing}
      >
        <Image
          src={COVER_SRC}
          alt="Fire or Fired — portada"
          fill
          className="object-contain object-center"
          priority
          sizes="50vw"
        />
      </div>

      {playing && videoSrc !== null && (
        <video
          key={videoSrc}
          className="absolute inset-0 z-10 h-full w-full bg-[#0c0c0c] object-contain"
          src={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-4 pt-8">
        <Image
          src="/erni_academy_logo.PNG"
          alt="ERNI Academy"
          width={320}
          height={72}
          className="h-auto w-full max-w-[min(92%,20rem)] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
        />
      </div>
    </section>
  );
}
