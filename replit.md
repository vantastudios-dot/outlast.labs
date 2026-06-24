# Vanta Studios

A digital design and engineering studio website for Vanta Studios, featuring a preloader animation, smooth scrolling, GSAP animations, and a full agency landing page.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Plain HTML/CSS/JS served via Vite (static site — no React used)
- Animations: GSAP + ScrollTrigger, Lenis smooth scroll
- WebGL: Unicorn Studio
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/vanta-studios/index.html` — main page (static HTML)
- `artifacts/vanta-studios/public/style.css` — all styles
- `artifacts/vanta-studios/public/script.js` — GSAP + Lenis + all interactions
- `artifacts/vanta-studios/public/` — fonts, images, case studies, favicon assets
- `artifacts/api-server/` — Express backend (healthz only, expandable)
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- Imported as a plain HTML/CSS/JS static site from Vercel (no Next.js, no React used in frontend)
- Vite serves `index.html` and all `public/` assets at root paths
- All `./public/` relative paths in HTML, CSS, and data-attributes were rewritten to root-relative paths (`/fonts/`, `/marquee/`, etc.) to match Vite's static serving behavior
- React scaffold exists in `src/` but is unused — the site is pure HTML/CSS/JS

## Product

Vanta Studios agency landing page with: preloader animation, hero section with WebGL background grid, approach process, dedicated team section, client work showcase, pricing table, case studies, and footer.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Files in `public/` are served at root by Vite — always use `/filename` not `/public/filename`
- The preloader runs ~1-2 seconds before page content reveals; the black screen is intentional
- GSAP, ScrollTrigger, Lenis, and Unicorn Studio are loaded from CDN in index.html

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
