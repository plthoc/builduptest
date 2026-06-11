"use client";

import Image from "next/image";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion-primitives";

export function About() {
  return (
    <section
      id="about"
      className="surface-light relative section-pad"
    >
      <div className="container-x">
        {/* Section heading — single line, matches reference */}
        <Reveal>
          <h2 className="font-display text-display-md font-medium tracking-tight text-ink-900 text-balance">
            We help build Roblox{" "}
            <span className="serif-italic">experiences</span> that matter most.
          </h2>
        </Reveal>

        {/* Two-column block: image card on left, copy on right */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left — image card (16:10, matches reference proportions) */}
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-4xl bg-ink-900">
              <Image
                src="https://imgs.search.brave.com/eMeST4eN6gFvOaeebe1fDdI4epn9aTCIhZFVP6ZJ_1M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z2FtZXNwb3QuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy9vcmln/aW5hbC8xODYxLzE4/NjE2OTc1LzQ2MDEx/NjUtYmVzdC1yb2Js/b3gtZ2FtZXMtcml2/YWxzLmpwZw"
                alt="Roblox Rivals gameplay"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                unoptimized
              />
            </div>
          </Reveal>

          {/* Right — copy */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="eyebrow text-ink-500">Our Approach</div>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink-900 text-balance md:text-4xl">
                Turning ideas into games that keep players coming back.
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-base leading-relaxed text-ink-500 text-pretty">
                We work across strategy, design, and engineering to help studios
                ship Roblox games that grow — without sacrificing quality.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-4 text-base leading-relaxed text-ink-500 text-pretty">
                Every project is shaped by real player needs, strong creative
                direction, and systems built to scale over time.
              </p>
            </Reveal>

            <RevealStagger className="mt-10 grid grid-cols-2 gap-3">
              <RevealItem>
                <PillStat value="0" label="Live CCU" sub="across portfolio" />
              </RevealItem>
              <RevealItem>
                <PillStat value="0" label="Visits" sub="lifetime" />
              </RevealItem>
              <RevealItem>
                <PillStat value="0" label="Favorites" sub="from players" />
              </RevealItem>
              <RevealItem>
                <PillStat value="0" label="Studios" sub="in network" />
              </RevealItem>
            </RevealStagger>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillStat({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="font-display text-2xl font-medium text-ink-900 md:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-ink-900">{label}</div>
      <div className="mt-0.5 text-xs text-ink-500">{sub}</div>
    </div>
  );
}
