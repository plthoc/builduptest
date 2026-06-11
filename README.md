# BuildUp Games

A polished marketing & publishing site for **BuildUp Games** — the Roblox publishing studio behind experiences like *Tapping Frenzy*.

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and a small set of well-chosen dependencies.

## What's in here

- **Hero** with parallax, animated marquee strip, live Roblox stats
- **About** with three pillars and refined scroll reveals
- **Experiences** grid with hover-zoom, rainbow sheen, and live playing/visits
- **Team** cards with aurora halos and shine-on-hover
- **Contact** with topic selector, validated form, and email delivery via Resend
- **Custom cursor** + **scroll progress bar** for that Framer-style polish
- **SEO** — sitemap, robots, OG tags, JSON-LD ready
- **Analytics** — Plausible integration (drop your domain in `.env.local`)
- **Backend** — `/api/contact` (Resend) and `/api/roblox-stats` (Roblox public API + 60s cache)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Used in OG tags, sitemap, canonical URL |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible site domain. Leave empty to disable. |
| `RESEND_API_KEY` | Required for the contact form to send real emails |
| `CONTACT_TO_EMAIL` | Where contact form submissions are delivered |
| `CONTACT_FROM_EMAIL` | The `From:` address (must be a verified domain in Resend) |

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the env vars above in Project Settings → Environment Variables.
4. Add your custom domain in Vercel → Domains, then update the DNS records they give you.
5. Done. Pushes to `main` auto-deploy.

## File map

```
src/
  app/
    layout.tsx           fonts, metadata, analytics script
    page.tsx             section composition
    globals.css          design tokens, utilities
    api/
      contact/route.ts   contact form → Resend
      roblox-stats/route.ts  live Roblox CCU/visits (60s cache)
    sitemap.ts           /sitemap.xml
    robots.ts            /robots.txt
  components/
    sections/            Navbar, Hero, About, Experiences, Team, Contact, Footer
    ui/                  Cursor, ScrollProgress, Logo, Button, MotionPrimitives
  lib/
    site-config.ts       ALL site copy + content lives here. Edit this file to update text.
    utils.ts             cn() classname helper, formatNumber()
```

## Editing content

All copy, team members, games, and contact options live in **`src/lib/site-config.ts`**. Edit that file, save, and the page updates.

## Performance

- All static — runs on Vercel's edge network.
- Images served via `next/image` with AVIF/WebP.
- Roblox stats cached at the edge for 60s.
- Reduced-motion respected everywhere.

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`).
- Focus rings visible only on keyboard.
- `prefers-reduced-motion` honored globally.
- Color contrast checked against WCAG AA.
