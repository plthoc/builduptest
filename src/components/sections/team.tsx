"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion-primitives";

export function Team() {
  return (
    <section
      id="team"
      className="surface-light relative section-pad"
    >
      <div className="container-x">
        <Reveal>
          <div className="eyebrow text-ink-500">{siteConfig.team.eyebrow}</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-3 font-display text-display-md font-medium tracking-tight text-ink-900 text-balance">
            The leaders behind <span className="serif-italic">BuildUp</span>.
          </h2>
        </Reveal>

        <RevealStagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.team.members.map((m) => (
            <RevealItem key={m.name}>
              <MemberCard {...m} />
            </RevealItem>
          ))}

          {/* Open role card */}
          <RevealItem>
            <a
              href="#contact"
              className="group flex h-full min-h-[360px] flex-col items-start justify-between rounded-4xl border border-dashed border-line bg-white p-7 transition-colors hover:border-ink-300 focus-ring"
            >
              <div className="eyebrow text-ink-500">Open role</div>
              <div>
                <h3 className="mt-3 font-display text-2xl font-medium text-ink-900">
                  Join the studio
                </h3>
                <p className="mt-2 text-sm text-ink-500">
                  We&apos;re hiring across creative direction, engineering, and live ops.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-transform group-hover:translate-x-1">
                Get in touch
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}

function MemberCard({
  name,
  role,
  img,
  url,
}: {
  name: string;
  role: string;
  img: string;
  url: string;
}) {
  const isLink = url !== "#";
  return (
    <a
      href={url}
      target={isLink ? "_blank" : undefined}
      rel={isLink ? "noopener noreferrer" : undefined}
      className="group block overflow-hidden rounded-4xl border border-line bg-white transition-shadow hover:shadow-card focus-ring"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-50">
        <Image
          src={img}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          unoptimized
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-medium text-ink-900">{name}</h3>
        <p className="mt-1 text-sm text-ink-500">{role}</p>
      </div>
    </a>
  );
}
