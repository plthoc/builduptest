"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion-primitives";

type RobloxUser = {
  userId: number;
  name: string;
  displayName: string;
  avatarUrl: string;
  hasVerifiedBadge: boolean;
};

// Discord server ID — set this in .env.local as NEXT_PUBLIC_DISCORD_SERVER_ID
// Required for the Discord widget popover to work. Without it the icon falls back
// to opening the invite link in a new tab.
const DISCORD_SERVER_ID = process.env.NEXT_PUBLIC_DISCORD_SERVER_ID ?? "";
const DISCORD_INVITE = "https://discord.gg/buildup";

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

        <RevealStagger className="mx-auto mt-20 flex max-w-2xl flex-col gap-8">
          {siteConfig.team.members.map((m) => (
            <RevealItem key={m.name}>
              <MemberCard {...m} />
            </RevealItem>
          ))}

          {/* Open role card */}
          <RevealItem>
            <a
              href="#contact"
              className="group block w-full rounded-4xl border border-dashed border-line bg-white px-10 py-8 transition-colors hover:border-ink-300 focus-ring sm:px-12"
            >
              <div className="flex items-start justify-between gap-8">
                <div className="flex items-start gap-5">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-surface-50 font-display text-xl font-medium text-ink-700">
                    +
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="font-display text-xl font-bold text-ink-900">
                      Open role
                    </h3>
                    <p className="mt-0.5 text-sm text-ink-500">@buildup</p>
                    <div className="mt-3 w-fit whitespace-nowrap border-b border-ink-200 pb-3">
                      <p className="text-sm font-semibold text-ink-900">
                        Join the studio
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-center text-sm leading-relaxed text-ink-900">
                We&apos;re hiring across creative direction, engineering, and live ops.
              </p>
            </a>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}

function MemberCard({
  name,
  handle,
  role,
  quote,
  img,
  robloxUserId,
  discordUsername,
  links,
}: {
  name: string;
  handle: string;
  role: string;
  quote: string;
  img: string;
  robloxUserId?: number;
  discordUsername?: string;
  links?: Array<{ type: "roblox" | "discord"; href: string; label: string }>;
}) {
  const live = useRobloxUser(robloxUserId);
  const [discordOpen, setDiscordOpen] = useState(false);

  // Live avatar + handle when available, fall back to the static config
  const avatarUrl = live?.avatarUrl || img;
  const displayHandle =
    live?.name && live.name.length > 0 ? `@${live.name}` : handle;

  return (
    <div className="block w-full rounded-4xl border border-line bg-white px-10 py-8 sm:px-12">
      <div className="flex items-start justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-surface-50">
            <Image
              src={avatarUrl}
              alt={live?.displayName || name}
              fill
              sizes="64px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="font-display text-xl font-bold text-ink-900">
              {live?.displayName || name}
            </h3>
            <p className="mt-0.5 text-sm text-ink-500">{displayHandle}</p>
            <div className="mt-3 w-fit whitespace-nowrap border-b border-ink-200 pb-3">
              <p className="text-sm font-semibold text-ink-900">{role}</p>
            </div>
          </div>
        </div>

        {links?.length ? (
          <div className="flex flex-shrink-0 items-start gap-3 pt-1">
            {links.map((link) =>
              link.type === "discord" ? (
                <button
                  key={link.type}
                  type="button"
                  onClick={() => setDiscordOpen(true)}
                  aria-label={`Open Discord for ${discordUsername ?? name}`}
                  className="inline-flex items-center justify-center text-ink-700 transition-colors hover:text-ink-900"
                >
                  <TeamIcon type="discord" />
                </button>
              ) : (
                <a
                  key={link.type}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex items-center justify-center text-ink-700 transition-colors hover:text-ink-900"
                >
                  <TeamIcon type="roblox" />
                </a>
              ),
            )}
          </div>
        ) : null}
      </div>

      <p className="mt-8 text-center text-sm leading-relaxed text-ink-900">
        &ldquo;{quote}&rdquo;
      </p>

      <AnimatePresence>
        {discordOpen && (
          <DiscordPopover
            username={discordUsername ?? ""}
            displayName={live?.displayName || name}
            onClose={() => setDiscordOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Live Roblox profile data — refreshes every 5 minutes. */
function useRobloxUser(userId?: number): RobloxUser | null {
  const [user, setUser] = useState<RobloxUser | null>(null);

  useEffect(() => {
    if (!userId) return;
    let alive = true;

    const fetchUser = async () => {
      try {
        const r = await fetch(`/api/roblox-user?ids=${userId}`);
        if (!r.ok) return;
        const data = (await r.json()) as { users?: RobloxUser[] };
        if (alive && data.users?.[0]) setUser(data.users[0]);
      } catch {
        // Silent fallback to static config
      }
    };

    fetchUser();
    const interval = setInterval(fetchUser, 5 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [userId]);

  return user;
}

function DiscordPopover({
  username,
  displayName,
  onClose,
}: {
  username: string;
  displayName: string;
  onClose: () => void;
}) {
  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const widgetUrl = DISCORD_SERVER_ID
    ? `https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.96, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 8, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1c] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#5865F2]/15 text-[#5865F2]">
              <TeamIcon type="discord" sizeClass="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{displayName}</div>
              <div className="text-xs text-white/50">
                {username ? `@${username}` : "Discord member"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {widgetUrl ? (
            <iframe
              title={`Discord widget for ${displayName}`}
              src={widgetUrl}
              className="h-80 w-full rounded-2xl border-0"
            />
          ) : (
            <div className="space-y-3 text-sm text-white/70">
              <p>
                The Discord widget isn&apos;t configured yet. To enable the live
                member list popup:
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-white/60">
                <li>Server Settings → Widget → Enable Widget</li>
                <li>
                  Copy the Server ID and add it to your env as{" "}
                  <code className="rounded bg-white/5 px-1 py-0.5 text-xs">
                    NEXT_PUBLIC_DISCORD_SERVER_ID
                  </code>
                </li>
              </ol>
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5865F2] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#4752C4]"
              >
                Open Discord invite
              </a>
            </div>
          )}
        </div>

        {widgetUrl && (
          <div className="border-t border-white/5 px-5 py-3">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5865F2] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#4752C4]"
            >
              Open Discord
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function TeamIcon({
  type,
  sizeClass = "h-6 w-6",
}: {
  type: "roblox" | "discord";
  sizeClass?: string;
}) {
  if (type === "discord") {
    return (
      <svg
        viewBox="0 0 127 127"
        className={sizeClass}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36a77.7,77.7,0,0,0,6.89-11.18A68.42,68.42,0,0,1,28.88,76.8c.585-.445,1.15-.9,1.7-1.36a77.06,77.06,0,0,0,66.83,0c.52.46,1.08.917,1.67,1.39a68.68,68.68,0,0,1-11.01,9.73,76.21,76.21,0,0,0,6.89,11.08A105.5,105.5,0,0,0,126.75,80.21h0C129.77,55.03,122.74,31.16,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60.55,31,53.88s5.07-11.86,11.45-11.86c6.39,0,11.63,5.29,11.52,11.86,0,6.67-5.15,11.81-11.48,11.81Zm42.97,0C79.15,65.69,74,60.55,74,53.88s5.07-11.86,11.45-11.86c6.44,0,11.66,5.29,11.52,11.86,0,6.67-5.15,11.81-11.48,11.81Z" />
      </svg>
    );
  }

  // Roblox icon — real logo (slanted square)
  return (
    <svg
      viewBox="0 0 24 24"
      className={sizeClass}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.926 23.998 0 18.892 5.075.002 24 5.108ZM15.348 10.09l-5.282-1.453-1.414 5.273 5.282 1.453z" />
    </svg>
  );
}
