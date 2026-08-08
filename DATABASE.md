# Database

`prisma/schema.prisma` is the single source of truth — this document is a
guided walkthrough of the decisions in it, not a duplicate of the field
list. Read the schema file's own header comment first; this expands on it.

## 1. Everything hangs off `Workspace`, not `User`

```
User ──< WorkspaceMember >── Workspace ──< ContentItem, Objective, Sprint, ... (everything)
```

Ilder OS ships as a single-creator product, but the expensive mistake would
be modeling every domain table with a direct `userId` foreign key. If the
product ever needs a second person in the workspace — an editor, a VA, a
strategist reviewing OKRs — every single table would need a migration to
introduce a join model. By routing every table through `Workspace` from
the start, adding a second human to a workspace is exactly one new
`WorkspaceMember` row. `WorkspaceRole` (`OWNER / ADMIN / EDITOR / VIEWER`)
already exists for when permission checks matter.

`requireWorkspaceContext()` (`src/lib/core/auth.ts`) is the one place that
resolves a Clerk session into a `{ user, workspace }` pair, provisioning
both on first sign-in. Every server-side data access should get its
`workspaceId` from there, not by re-deriving it.

## 2. Metrics are append-only snapshots, not mutable columns

`ContentMetricSnapshot` and `AnalyticsSnapshot` are **event tables**: every
sync (or manual update) inserts a new row rather than updating one. This
single decision is what makes several brief requirements possible without
a separate time-series database:

- **Views/Followers Growth charts** — the trend *is* the row history.
- **Retention over time** — same pattern, one level down (per-video instead
  of per-account).
- **"Best videos" vs. "worst videos"** — computed by reducing to the latest
  snapshot per `ContentItem`, but nothing stops a future "trending up"
  insight from comparing the last two snapshots per item instead.

The tradeoff: reads need a `WHERE contentItemId = ? ORDER BY capturedAt DESC
LIMIT 1` (or a window function) to get "current" values, rather than a flat
`SELECT`. Both `ContentMetricSnapshot` and `AnalyticsSnapshot` are indexed
on `(parentId, capturedAt)` specifically for this access pattern. This is
the same modeling pattern you'd reach for with Stripe events or any
metrics pipeline — mutate-in-place always eventually loses the "what did
this look like last week" question, which is a core feature here, not an
edge case.

## 3. OKRs and Sprints are quarter-scoped but not quarter-locked

`Objective.quarterId` is required; `Sprint.quarterId` is optional. A sprint
can exist without being tied to a specific quarter's OKRs (e.g. a
maintenance sprint, or a sprint that predates formal quarter planning),
but every Objective must belong to one — Objectives without a quarter
don't make sense in this product's mental model, sprints occasionally do.

## 4. `Pillar` and `Series` are first-class models, not free-text columns

Content brief called for both fields on every `ContentItem`. They're
modeled as their own tables (unique per workspace) rather than a plain
string column so that:

- Analytics can group/join on them cheaply (`getPillarPerformance` today
  reduces mock data in memory; the Prisma equivalent is a `groupBy`).
- Renaming a pillar workspace-wide is one `UPDATE`, not a find-and-replace
  across every `ContentItem` row.
- A future "pillar settings" screen (color, description, archive) has
  somewhere to live.

## 5. Enums are duplicated as TypeScript unions on purpose

`src/types/index.ts` hand-mirrors every Prisma enum as a plain string
union. This isn't drift risk being ignored — it's a deliberate boundary:
Client Components cannot import `@prisma/client` (it's a Node-only,
fairly heavy package), so any type shared with client code needs a
Prisma-independent definition somewhere. The contract, stated explicitly
in that file's header comment: any enum change in `schema.prisma` gets
mirrored in `src/types/index.ts` in the same change. See `ROADMAP.md` for
turning this into an automated check (codegen or a lint rule) rather than
a documented convention.

## 6. Indexes

Every foreign-key-heavy query path used by the mock-data-equivalent
functions in `src/mock/analytics.mock.ts` has a matching index once the
real repository is live:

- `ContentItem(workspaceId, status)`, `(workspaceId, platform)`,
  `(workspaceId, publishedAt)` — the three filters `ContentFilters` exposes
  plus the default sort.
- `ContentMetricSnapshot(contentItemId, capturedAt)`,
  `AnalyticsSnapshot(workspaceId, platform, capturedAt)` — the "current
  value" and "trend series" access patterns from § 2.
- `Objective(workspaceId, quarterId)`, `Sprint(workspaceId, status)`,
  `Idea(workspaceId, status)` — list-by-workspace, filter-by-status being
  the dominant query shape across every planning module.

## 7. What's intentionally NOT modeled yet

- **Platform API credentials / OAuth tokens** for auto-syncing metrics —
  the schema assumes metrics arrive (via manual entry or a future sync
  job) as `ContentMetricSnapshot` rows, but doesn't yet model *where they
  came from*. See ROADMAP.md § "Platform integrations".
- **Comments/collaboration** on any entity (e.g. a comment thread on a
  Sprint retro) — no table for this yet; would follow the same
  `workspaceId`-scoped pattern as everything else.
- **Soft deletes** — every model uses hard relations with `onDelete:
  Cascade`. Fine for a single-creator product; reconsider before this ever
  supports teams, where "someone else's edit deleted my sprint" is a much
  worse failure mode than for a solo user.
