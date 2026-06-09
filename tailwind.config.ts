import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MVN Studio surface tokens (from reference)
        surface: {
          0: "#ffffff",      // page (light sections)
          50: "#f5f5f5",     // alt section
          100: "#ededed",
          200: "#e3e3e3",
          900: "#0a0a0a",    // ink / hero
          950: "#050505",    // deepest black
        },
        // MVN Studio accent (orange) — used very sparingly
        accent: {
          DEFAULT: "#ff4d00",
          50: "#fff2e8",
          100: "#ffd9bd",
        },
        // Neutrals
        ink: {
          0: "#ffffff",
          900: "#0a0a0a",
          700: "#1f1f1f",
          500: "#5e5e5e",
          400: "#7a7a7a",
          300: "#a8a8a8",
          200: "#cdcdcd",
        },
        // Subtle border colors
        line: {
          DEFAULT: "rgba(10, 10, 10, 0.08)",
          dark: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Match MVN's display scale — big but contained, doesn't fill the page
        "display-xl": ["clamp(44px, 6.5vw, 96px)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(36px, 5vw, 72px)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(28px, 4vw, 52px)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(22px, 3vw, 36px)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
      },
      boxShadow: {
        "soft": "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        "card": "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.06)",
        "card-dark": "0 1px 2px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
