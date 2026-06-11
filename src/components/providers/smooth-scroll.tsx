"use client";

import { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initLenis = async () => {
      const LenisMod = await import("lenis");
      const Lenis = LenisMod.default;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Intercept in-page anchor clicks and let Lenis animate to the target.
      // Without this, native <a href="#x"> clicks either get blocked or
      // jump without animation, depending on how Lenis controls the body.
      const onClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
        if (!anchor) return;

        // Respect modifier keys (open in new tab etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (anchor.target && anchor.target !== "" && anchor.target !== "_self") return;

        const href = anchor.getAttribute("href");
        if (!href || href === "#" || href.length < 2) return;

        const el = document.querySelector(href);
        if (!el) return;

        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -72 }); // ~navbar height
        // Keep URL in sync so deep-links still work
        history.replaceState(null, "", href);
      };

      document.addEventListener("click", onClick);

      // Handle initial load with a hash (e.g. landing on /#team)
      if (window.location.hash) {
        const el = document.querySelector(window.location.hash);
        if (el) {
          // Wait a frame so layout settles, then scroll without animation
          requestAnimationFrame(() => {
            lenis.scrollTo(el as HTMLElement, { offset: -72, immediate: true });
          });
        }
      }

      cleanup = () => {
        document.removeEventListener("click", onClick);
        lenis.destroy();
      };
    };

    initLenis();

    return () => {
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
