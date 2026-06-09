"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experiences", href: "#experiences" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* MVN-style: dark glass pill, centered content, no + button */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className={`pointer-events-auto flex items-center justify-center gap-6 rounded-2xl border border-white/10 px-4 transition-colors duration-300 ${
            scrolled
              ? "bg-[#0a0a0a]"
              : "bg-[#111111]"
          } py-2`}
        >
          {/* Logo */}
          <a
            href="#top"
            className="flex shrink-0 items-center focus-ring rounded-2xl px-1 py-0.5"
            aria-label="BuildUp home"
          >
            <Logo height={24} priority />
          </a>

          {/* Nav links — centered, white text on dark pill */}
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-2xl px-3 py-1 text-[13px] font-medium text-white/70 transition-colors hover:text-white focus-ring"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      </header>

      {/* Mobile menu: hamburger toggle button top-right, full-screen dark overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            {/* Mobile hamburger button — top-right corner */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white transition-all focus-ring"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-full flex-col items-center justify-center gap-8 p-8"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.07 }}
                  className="font-display text-5xl font-medium text-white focus-ring"
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile only: hamburger button — top-right, shown when menu closed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 top-4 z-40 grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-[#111111] text-white transition-all focus-ring md:hidden"
          aria-label="Open menu"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
