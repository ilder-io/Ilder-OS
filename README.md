# Ilder OS

**The operating system for a personal brand.**

Not an analytics dashboard. Ilder OS is where a creator business actually
runs: what to make, whether it worked, what to build next, and whether the
quarter is on track — one system instead of six disconnected spreadsheets
and a notes app.

This repository is a real, structured Next.js 15 codebase — every screen
described in the brief is implemented and renders against deterministic
mock data, so the whole product is inspectable and demo-able before a
single environment variable is set. Wiring it to a live Postgres database
is a scoped, documented swap (see "Going to production" below), not a
rewrite.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19 | Server Components for data-heavy pages, streaming, typed routes |
| Language | TypeScript (strict) | Every domain model, form, and API contract is typed end-to-end |
| Styling | Tailwind CSS + shadcn/ui primitives | Fast iteration without sacrificing a distinctive design system |
| Data | PostgreSQL via Supabase, Prisma ORM | Relational — content, OKRs, and sprints are genuinely joined data |
| Auth | Clerk | Handles multi-workspace membership out of the box |
| Charts | Recharts | Composable, themeable, good defaults for dashboards |
| Forms | React Hook Form + Zod | One schema validates both client forms and API routes |
| Tables | TanStack Table | Sorting/pagination for the Content module without reinventing it |
| Client state | Zustand | Small, scoped stores per feature — never a global data cache |
| Motion | Framer Motion | Used sparingly: layout transitions, staggered card reveals |

See `ARCHITECTURE.md` for how these fit together and why the codebase is
organized the way it is, and `DATABASE.md` for the schema's reasoning.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Clerk + Supabase keys — see below
npm run dev
```

> **Note on `npm install`:** this project pins React 19, and a couple of
> ecosystem packages (recharts, some Radix utilities) have historically
> been slow to declare React 19 support in their own `peerDependencies`
> even though they work fine at runtime. `package.json` already pins
> `recharts@^2.15.0` (the first version with React 19 in its peer range)
> and overrides `react-is` to match, and `.npmrc` sets
> `legacy-peer-deps=true` as a safety net for anything smaller that still
> lags. If you ever see an `ERESOLVE` error anyway (e.g. after bumping a
> dependency), `npm install --legacy-peer-deps` resolves it without
> forcing a broken install.

The app runs and every module is fully browsable **without** touching
`.env.local` first, because all reads go through a repository/service layer
backed by `src/mock/*.ts` (see ARCHITECTURE.md § "Why mock data, and how it
comes out"). Clerk auth is still required to pass `middleware.ts` — set at
minimum `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from a
free Clerk project to sign in locally.

### Environment variables

See `.env.example` for the full list. At minimum for local dev:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — from clerk.com
- `DATABASE_URL`, `DIRECT_URL` — from a Supabase project, only needed once
  you move off mock data (see below)

---

## Project structure

```
prisma/schema.prisma       All 20 domain models — read the header comment first
src/
  app/                     Routes only. Every page composes features; none contain business logic.
    (auth)/                Sign-in / sign-up, Clerk-hosted
    (dashboard)/           Every authenticated module — one folder per route
    api/                   REST handlers: parse → call service → shape response
  components/
    ui/                    shadcn-style primitives (Button, Card, Dialog, ...) — no business logic
    layout/                Sidebar, Topbar, Command palette, Mobile nav
    charts/                Recharts wrappers themed to the design tokens
    shared/                Cross-feature building blocks (StatCard, StatusBadge, EmptyState)
  features/<name>/         One folder per module — see ARCHITECTURE.md
    components/            Feature-specific UI
    api/                   repository.ts (data access) + service.ts (business logic)
    schemas/               Zod schemas (client + server validation)
    store/                 Zustand store for that feature's UI state only
    types/                 DTOs and domain types for that feature
  lib/
    core/                  db.ts (Prisma client), auth.ts (Clerk → workspace resolution)
    utils.ts, constants.ts
  mock/                    Deterministic mock data generators — the "demo mode" data source
docs/                      Extended documentation (this file's companions)
```

Full rationale for this layout — and the rule for where a new file goes —
is in `ARCHITECTURE.md`.

---

## Modules

Every module in the brief is implemented:

- **Dashboard** — cross-module overview: growth, active sprint, quarter
  progress, recent content, top AI insights
- **Content** — table + grid views, filters, full metrics (views, likes,
  comments, shares, saves, followers generated, watch time, retention,
  profile visits, conversion rate), create/edit form
- **Analytics** — growth trends (followers/views/engagement/retention/watch
  time), best publishing time heatmap, best/worst videos, top hooks/CTAs/
  series, pillar and duration performance
- **OKRs** — objectives, key results, progress rollups, quarter grouping
- **Quarter Planning** — theme-setting view tying objectives to sprints
- **Sprints** — goal, hypothesis, kanban task board, metrics, results,
  learnings, action items
- **Weekly / Monthly Review** — structured retro templates
- **Products** — MRR, status pipeline (concept → building → live → sunset)
- **Ideas Backlog** — impact/effort matrix + status kanban
- **AI Insights** — a real rules-based engine computing statistical deltas
  from the content dataset (see `src/features/ai-insights/engine`)
- **Knowledge Base** — tagged internal docs
- **Settings** — workspace, members, integrations, billing

---

## Going to production

The mock-data layer exists so the whole product is real and clickable on
day one. Moving a module off mock data is a **repository swap**, not a
rewrite — every service already codes against an interface:

1. Set `DATABASE_URL` / `DIRECT_URL` to a Supabase Postgres instance.
2. `npm run db:push` (or `db:migrate` once you want tracked migrations).
3. `npm run db:seed` to load the same dataset the UI currently mocks, so the
   demo and the real database agree.
4. In each feature's `api/*.repository.ts`, uncomment the
   `Prisma*Repository` class (already written, already implements the same
   interface as the mock) and swap the exported singleton.
5. Delete the corresponding file(s) under `src/mock/` once nothing imports
   them.

`src/features/content/api/content.repository.ts` is the reference example —
every other feature follows the identical pattern.

---

## Scripts

```bash
npm run dev          # local dev server
npm run build         # production build
npm run lint          # eslint
npm run typecheck     # tsc --noEmit
npm run db:push        # push schema to DATABASE_URL (no migration history)
npm run db:migrate     # create + apply a tracked migration
npm run db:seed        # load demo data into a real database
npm run db:studio      # Prisma Studio
```

---

## Documentation

- `ARCHITECTURE.md` — Clean Architecture layers, why the folders are shaped
  this way, and the rules for adding a new module
- `DATABASE.md` — schema walkthrough, the append-only metrics pattern, and
  indexing notes
- `ROADMAP.md` — what's deliberately deferred, and the order to build it in
