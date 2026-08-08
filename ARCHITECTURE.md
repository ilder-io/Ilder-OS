# Architecture

Ilder OS follows Clean Architecture: dependencies point inward, business
logic doesn't know about Next.js or Prisma, and every layer can be tested
or swapped without touching the layers around it. This document explains
the layers, why the folders are shaped the way they are, and the rules for
extending the product without eroding any of that.

## The four layers

```
┌─────────────────────────────────────────────────┐
│  Presentation   src/app/**, src/components/**    │  ← Next.js pages, UI primitives
├─────────────────────────────────────────────────┤
│  Feature UI     src/features/*/components/**     │  ← module-specific components
├─────────────────────────────────────────────────┤
│  Application    src/features/*/api/*.service.ts  │  ← business logic, orchestration
├─────────────────────────────────────────────────┤
│  Data Access    src/features/*/api/*.repository  │  ← the ONLY layer that queries data
└─────────────────────────────────────────────────┘
```

**The rule that matters most:** a page or component never imports
`@/lib/core/db` (the Prisma client) directly, and never imports a mock data
file from `src/mock/` directly either. It calls a **service**. The service
calls a **repository**. This is what makes "swap mock data for Postgres"
a one-file change instead of a search-and-replace across forty components
— see `content.repository.ts` for the reference implementation, with a
commented-out `PrismaContentRepository` showing the exact shape the real
implementation takes.

```
Page (Server Component)
  → features/content/api/content.service.ts   (business logic: "what pillars exist")
    → features/content/api/content.repository.ts   (data access: "get me the rows")
      → src/mock/content.mock.ts   (today)
      → @/lib/core/db (Prisma)     (once DATABASE_URL is live)
```

## Feature-based folders, not layer-based folders

The top-level split is `src/features/<module>/`, not `src/components/`,
`src/hooks/`, `src/api/` at the root. Everything one module needs —
its components, its Zod schema, its Zustand store, its repository — lives
together:

```
src/features/content/
  api/            content.repository.ts, content.service.ts
  components/     ContentTable, ContentForm, ContentDetail, ...
  hooks/          (reserved for feature-specific data hooks as the module grows)
  schemas/        content.schema.ts       — one Zod schema, used by the form AND the API route
  store/          content.store.ts        — Zustand: filters + view mode only
  types/          content.types.ts        — DTOs this feature emits/consumes
```

This is deliberate: when you're deep in the Sprints module, everything
relevant is one directory, not scattered across four top-level folders by
technical concern. `src/components/` is reserved for things genuinely
shared across features (a `<Button>`, a `<StatCard>`, a chart wrapper) —
if something is used by exactly one feature, it belongs inside that
feature's folder, not in the shared tree.

**Rule for a new file:** if two or more features would import it, it goes
in `src/components/`, `src/lib/`, or `src/hooks/`. If only one feature
uses it, it goes inside that feature's folder — even if it feels generic.
Premature sharing is how shared folders rot.

## Zustand stores hold UI state, never fetched data

Every feature's `store/*.store.ts` holds interaction state only — active
filters, which view mode is selected, which dialog is open. Server data
(content items, sprint rows, OKR progress) is fetched in a Server Component
and passed down as props, or read through a service in a Route Handler.
`content.store.ts` is the reference: it holds `filters` and `view`, and
nothing else. This keeps "what does this screen currently look like" and
"what does the database currently say" from ever getting tangled — a
Zustand store never goes stale relative to the database, because it never
held database data in the first place.

## Why mock data, and how it comes out

Every list/detail page fetches through a **service**, and every service
currently resolves through an in-memory **repository** backed by
`src/mock/*.ts`. Three consequences of that choice:

1. **The whole product is real today.** Every module renders actual UI
   against actual (deterministic, seeded) data — this isn't a Figma file
   or a Storybook stub with three hardcoded rows. Filtering, sorting,
   pagination, and the AI Insights engine's statistics all run against 48
   generated content items with realistic metric relationships baked in.
2. **The swap is scoped.** Because pages never talk to `src/mock/`
   directly — always through a service → repository — moving a module to
   Postgres means writing one `Prisma*Repository` class per feature and
   changing one export. See README.md § "Going to production" for the
   exact steps.
3. **Determinism matters for SSR.** `src/lib/utils.ts` ships a
   `seededRandom(seed)` helper specifically so mock data generation is
   pure — same seed, same output, every render, on both server and client.
   Never use `Math.random()` in a Server Component; it will produce a
   hydration mismatch the instant the client re-renders.

## When to move filtering server-side

`ContentWorkspace` filters its full dataset in the browser
(`useMemo` over the server-fetched array). That's correct for a single
creator's content library — hundreds of rows, not millions. The threshold
to revisit: once a workspace's `ContentItem` count is large enough that
shipping the full list to the client is itself slow (a good rule of thumb
is a few thousand rows, or once a p95 page load exceeds ~500ms attributable
to payload size), move filtering into `content.service.ts` as Prisma
`where` clauses, and paginate with `getPaginationRowModel`'s server-side
mode in TanStack Table. Nothing in the component tree needs to change other
than how `items` is fetched — filters already live in a normalized shape
(`ContentFilters`) that maps directly to a Prisma `where` object.

## Metrics are event-sourced, not mutated in place

`ContentMetricSnapshot` and `AnalyticsSnapshot` are append-only (see
`DATABASE.md`). The application layer is responsible for reducing that
series into "current" values (latest snapshot) or "trend" values (the full
series) — the repository never does this reduction, so different features
can reduce the same underlying data differently (a sparkline wants the
last 14 points; a quarter rollup wants a monthly average) without the data
layer needing to know about either.

## The AI Insights engine is a strategy pattern, on purpose

`src/features/ai-insights/engine/` defines an `InsightEngine` interface
with one method: `generate(ctx) → Promise<Insight[]>`. `RulesInsightEngine`
is the only implementation wired up today, and it's fully deterministic —
group-vs-population statistical comparisons over the content dataset, no
network call. `LLMInsightEngine` is a structural placeholder showing where
a model-backed implementation plugs in later. Nothing in
`features/ai-insights/components/` or the `/ai-insights` page depends on
which engine is active — they only ever see `Insight[]`. Swapping engines
is changing one export in `engine/index.ts`.

## Validation lives once, used twice

Every mutable resource has exactly one Zod schema
(`features/<x>/schemas/<x>.schema.ts`), imported by both the React Hook
Form in the client component and the Route Handler in `src/app/api/`. This
is what keeps client and server validation from drifting — see
`content.schema.ts` used by both `ContentForm.tsx` and
`api/content/route.ts`.

## Multi-tenancy is already in the schema, not bolted on later

Every domain model hangs off `Workspace`, not `User` (see `DATABASE.md`
§ 1). `requireWorkspaceContext()` in `lib/core/auth.ts` is the single seam
that resolves "which Clerk user, which workspace" — every server-side data
access that needs a `workspaceId` gets it from there once a real database
is connected, rather than each feature inventing its own resolution.

## Adding a new module

1. `src/features/<name>/` with `components/`, `api/`, `types/` at minimum.
2. Add the corresponding models to `prisma/schema.prisma`, scoped to
   `Workspace` like everything else.
3. Write `<name>.repository.ts` (interface + mock implementation, Prisma
   implementation commented for later) and `<name>.service.ts`.
4. Add the route under `src/app/(dashboard)/<name>/page.tsx` — a Server
   Component that calls the service and passes data down.
5. Add a `NavItem` in `src/lib/constants.ts` if it belongs in the sidebar.
