"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { formatNumber } from "@/lib/utils";

type Stats = { playing: number; visits: number } | null;

const CHARS = "~_-^>v<";
const CELL_W = 14;
const CELL_H = 20;
const ALPHA = 0.18;

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const [stats, setStats] = useState<Stats>(null);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  // Poll every 30s for live CCU + visits
  useEffect(() => {
    let alive = true;
    const poll = () => {
      fetch("/api/roblox-stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (alive && data) setStats(data.total); })
        .catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 30000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  // ASCII wave canvas animation — optimized: ~20fps, low resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let lastTime = 0;
    const FRAME_MS = 50; // 20fps max — smooth but light on CPU

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts: number) => {
      if (ts - lastTime < FRAME_MS) { rafRef.current = requestAnimationFrame(draw); return; }
      lastTime = ts;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / CELL_W);
      const rows = Math.ceil(height / CELL_H);
      const t = timeRef.current;

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const x = col * CELL_W;
          const y = row * CELL_H;
          // Two overlapping waves for natural organic movement
          const w1 = Math.sin(col * 0.06 + t * 0.6) * Math.cos(row * 0.04 + t * 0.4);
          const w2 = Math.sin(col * 0.03 - t * 0.35 + 1.2) * Math.cos(row * 0.05 - t * 0.25);
          const brightness = (w1 + w2 + 2) / 4;
          const gray = Math.floor(30 + brightness * 70);
          ctx.fillStyle = `rgba(${gray},${gray},${gray + 10},${ALPHA})`;
          ctx.font = "13px monospace";
          const idx = Math.floor((col * 0.4 + row * 0.6 + t * 4) % CHARS.length);
          ctx.fillText(CHARS[Math.abs(idx)], x, y);
        }
      }

      timeRef.current += 0.025;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="top" className="surface-hero relative isolate min-h-[100svh] overflow-hidden">
      {/* ASCII wave canvas */}
      <motion.div aria-hidden style={{ y: yBg, opacity }} className="absolute inset-0 -z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>

      {/* Vignettes */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-center pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="font-display text-display-lg font-medium tracking-tight text-white text-balance"
          >
            Building games<br />
            <span className="serif-italic">worth</span> playing.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="mt-6 max-w-md text-base text-white/70"
          >
            Where Roblox ideas come alive — through publishing, design, and live operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="btn-pill btn-light focus-ring">Get Started</a>
            <a href="#about" className="btn-pill btn-ghost text-white focus-ring">Learn More</a>
          </motion.div>
        </div>

        {/* Live Roblox stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          className="mt-14 grid max-w-sm grid-cols-2 gap-3"
        >
          <StatCard value={formatNumber(stats?.playing ?? 0)} label="Total CCU" loading={stats === null} />
          <StatCard value={formatNumber(stats?.visits ?? 0)} label="Total Visits" loading={stats === null} />
        </motion.div>
      </div>

    </section>
  );
}

function StatCard({ value, label, loading }: { value: string; label: string; loading?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="font-display text-3xl font-medium text-white">
        {loading ? <span className="inline-block w-12 animate-pulse rounded bg-white/10" /> : value}
      </div>
      <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}
