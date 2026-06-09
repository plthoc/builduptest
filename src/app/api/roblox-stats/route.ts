import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
// Always fetch fresh — no ISR cache. Client polls every 30s for live updates.
export const dynamic = "force-dynamic";

type GameStats = {
  placeId: number;
  universeId: number;
  playing: number;
  visits: number;
  name: string;
  favoritedCount: number;
  thumbnail: string;
  updatedAt: number;
};

// Cache placeId → universeId permanently (mapping is immutable).
const universeIdCache = new Map<number, number>();

async function placeToUniverseId(placeId: number): Promise<number | null> {
  if (universeIdCache.has(placeId)) return universeIdCache.get(placeId)!;
  try {
    const r = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 * 30 }, // 30 days
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { universeId?: number };
    if (!data.universeId) return null;
    universeIdCache.set(placeId, data.universeId);
    return data.universeId;
  } catch (e) {
    console.error("[roblox-stats] placeToUniverseId failed", e);
    return null;
  }
}

async function fetchGameStats(universeId: number): Promise<{
  playing: number;
  visits: number;
  name: string;
  favoritedCount: number;
  thumbnail: string;
} | null> {
  try {
    const url = `https://games.roblox.com/v1/games?universeIds=${universeId}`;
    const r = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!r.ok) {
      console.error(`[roblox-stats] universe ${universeId} returned ${r.status}`);
      return null;
    }
    const data = (await r.json()) as {
      data: Array<{
        id: number;
        name: string;
        playing: number;
        visits: number;
        favoritedCount: number;
        thumbnailUrls: string[];
      }>;
    };
    const game = data?.data?.[0];
    if (!game) return null;
    return {
      playing: game.playing ?? 0,
      visits: game.visits ?? 0,
      name: game.name ?? "",
      favoritedCount: game.favoritedCount ?? 0,
      thumbnail: game.thumbnailUrls?.[0] ?? "",
    };
  } catch (e) {
    console.error("[roblox-stats] fetch failed", e);
    return null;
  }
}

export async function GET() {
  // If Roblox is unreachable, return cached/stub data immediately
  const results: GameStats[] = [];

  for (const game of siteConfig.games) {
    if (!game.placeId) continue;
    const universeId = await placeToUniverseId(game.placeId);
    if (!universeId) continue;
    const stats = await fetchGameStats(universeId);
    if (stats) {
      results.push({
        placeId: game.placeId,
        universeId,
        name: stats.name || game.name,
        playing: stats.playing,
        visits: stats.visits,
        favoritedCount: stats.favoritedCount,
        thumbnail: stats.thumbnail || "",
        updatedAt: Date.now(),
      });
    }
  }

  const total = results.reduce(
    (acc, g) => ({ playing: acc.playing + g.playing, visits: acc.visits + g.visits }),
    { playing: 0, visits: 0 },
  );

  const byGame: Record<
    number,
    { playing: number; visits: number; name: string; favoritedCount: number; thumbnail: string; updatedAt: number }
  > = {};
  for (const g of results) {
    byGame[g.placeId] = {
      playing: g.playing,
      visits: g.visits,
      name: g.name,
      favoritedCount: g.favoritedCount,
      thumbnail: g.thumbnail,
      updatedAt: g.updatedAt,
    };
  }

  return NextResponse.json(
    { total, byGame },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=120",
      },
    },
  );
}
