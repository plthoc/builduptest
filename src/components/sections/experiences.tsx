"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion-primitives";
import { formatNumber } from "@/lib/utils";

type GameStats = {
  playing: number;
  visits: number;
  name: string;
  favoritedCount: number;
  thumbnail: string;
  updatedAt: number;
};

export function Experiences() {
  const [statsById, setStatsById] = useState<Record<number, GameStats>>({});

  // Poll every 30s for live updates (title, thumbnail, stats all update)
  useEffect(() => {
    let alive = true;
    const poll = () => {
      fetch("/api/roblox-stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (alive && data?.byGame) setStatsById(data.byGame);
        })
        .catch(() => {});
    };
    poll(); // immediate first fetch
    const interval = setInterval(poll, 30000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  return (
    <section
      id="experiences"
      className="surface-white relative section-pad"
    >
      <div className="container-x">
        <Reveal>
          <div className="eyebrow text-ink-500">{siteConfig.experiences.eyebrow}</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-3 font-display text-display-md font-medium tracking-tight text-ink-900 text-balance">
            <span className="serif-italic">Featured</span> Experiences.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg text-ink-500 text-pretty">
            {siteConfig.experiences.subtitle}
          </p>
        </Reveal>

        <RevealStagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.games.map((game) => {
            const s = statsById[game.placeId];
            return (
              <RevealItem key={game.placeId}>
                <GameCard
                  name={s?.name ?? game.name}
                  studio={game.studio}
                  img={s?.thumbnail ?? game.img}
                  url={game.url}
                  playing={s?.playing ?? 0}
                  visits={s?.visits ?? 0}
                />
              </RevealItem>
            );
          })}

          {/* "Coming soon" card — invites pitches */}
          <RevealItem>
            <a
              href="#contact"
              className="group flex h-full min-h-[420px] flex-col items-center justify-center rounded-4xl border border-dashed border-line bg-surface-50 p-8 text-center transition-colors hover:border-ink-300 hover:bg-white focus-ring"
            >
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-medium text-ink-900">
                Pitch your experience
              </h3>
              <p className="mt-2 max-w-xs text-sm text-ink-500">
                Always looking for the next hit. If you&apos;re building
                something players will love, we want to hear about it.
              </p>
            </a>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}

function GameCard({
  name,
  studio,
  img,
  url,
  playing,
  visits,
}: {
  name: string;
  studio: string;
  img: string;
  url: string;
  playing: number;
  visits: number;
}) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group block overflow-hidden rounded-4xl border border-line bg-white transition-shadow hover:shadow-card focus-ring"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-surface-50">
        <Image
          src={img}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-medium text-ink-900">{name}</h3>
        <p className="mt-1 text-sm text-ink-500">By {studio}</p>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs text-ink-500">
          <span>
            <span className="font-medium text-ink-900">{formatNumber(playing)}</span> playing
          </span>
          <span>
            <span className="font-medium text-ink-900">{formatNumber(visits)}</span> visits
          </span>
        </div>
      </div>
    </motion.a>
  );
}
