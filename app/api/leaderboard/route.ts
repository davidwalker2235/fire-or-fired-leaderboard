import { NextResponse } from "next/server";
import { LEADERBOARD_URL } from "@/lib/leaderboard";

export async function GET() {
  try {
    const res = await fetch(LEADERBOARD_URL, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "upstream_error" },
        { status: 502 },
      );
    }
    const data: unknown = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
