# Roadmap & Scalability Plan

This is not a backlog of nice-to-haves — it's the explicit list of what
this v1 build deliberately deferred, why, and in what order to tackle it.
Every item below was a conscious scope cut, not an oversight.

## Immediate next steps (before real users)

1. **Wire the Prisma repositories.** Every `*.repository.ts` already has a
   commented `Prisma*Repository` implementation matching the mock one.
   Uncomment, connect `DATABASE_URL`, run `db:push` + `db:seed`, flip the
   exported singleton. Content first (it's the reference implementation),
   then Sprints and OKRs (most relationally connected to Content), then
   the rest.
2. **Write mutations.** Every API route currently documents the intended
   contract (`POST /api/content`, `PATCH /api/content/[id]`) but returns
   synthesized responses rather than persisting. Once repositories are
   live, each service needs `create`/`update`/`delete` methods calling
   real Prisma writes.
3. **Enum sync check.** `src/types/index.ts` manually mirrors
   `prisma/schema.prisma` enums (see DATABASE.md § 5). Before this drifts
   in practice, add a small script (`scripts/check-enum-sync.ts`) run in
   CI that parses both and fails the build on mismatch — cheaper than a
   full codegen pipeline for now.
4. **Auth-gate the API routes.** Route handlers currently hardcode
   `"demo-workspace"`. Once `requireWorkspaceContext()` is usable from a
   Route Handler (it already is — same Clerk `auth()` call works there),
   every handler should resolve the workspace from the session instead.

## Platform integrations (metrics stop being manual)

The schema (`ContentMetricSnapshot`, `AnalyticsSnapshot`) already supports
this — it's additive, not a redesign:

1. Add a `platform_connections` table: `workspaceId`, `platform`, OAuth
   tokens (encrypted at rest — use Supabase Vault or an external secrets
   manager, never plain columns), `lastSyncedAt`.
2. One sync job per platform (YouTube Data API, TikTok Display API, Meta
   Graph API for Instagram, X API) — a scheduled Vercel Cron or a
   background worker — that inserts new `ContentMetricSnapshot` /
   `AnalyticsSnapshot` rows. Because these tables are append-only, sync
   jobs never need "upsert" logic, just "insert if this snapshot doesn't
   already exist for this window."
3. Manual entry (already fully built via `ContentForm`) stays as the
   fallback for platforms without a usable API, or for a creator who
   doesn't want to grant OAuth access.

## AI Insights — from rules to model-assisted

`RulesInsightEngine` (deterministic, explainable, instant) is the right
default and should stay available even after an LLM-backed engine exists
— treat it as a fast, free baseline the model-backed engine can be
compared against.

1. Aggregate, don't raw-dump: compute the same group-vs-population windows
   the rules engine already computes, and pass *those* (not per-video raw
   rows) to the model. Keeps the prompt small, keeps costs predictable,
   and keeps the model doing synthesis rather than arithmetic it's worse
   at than the rules engine.
2. Target correlations the rules engine structurally can't reach — e.g.
   "hook phrasing style × platform × day-of-week" three-way interactions,
   or free-text theme extraction across scripts/hooks.
3. Keep both engines behind `InsightEngine`; consider a `CompositeEngine`
   that runs both and dedupes/ranks the combined output rather than a hard
   cutover.
4. Persist generated insights (`AIInsight` table already exists) instead
   of regenerating on every page load — regenerate on a schedule (e.g.
   nightly) or on-demand via a "Refresh insights" action, not per-request.

## Multi-tenancy → teams

The data model already supports this (`WorkspaceMember`, `WorkspaceRole`)
— what's missing is UI and enforcement:

1. An invite flow (`Settings → Members` already has the "Invite a member"
   button stubbed).
2. Role-based UI gating (`VIEWER` shouldn't see create/edit affordances).
3. Row-level checks in every service method — today
   `contentService.listContent(workspaceId)` trusts its caller; once
   multiple people can hit the same API routes, every service method
   needs to verify the calling user is actually a member of
   `workspaceId`, not just pass it through.

## Performance, at scale

- **Filtering moves server-side** once a single workspace's content count
  makes client-side filtering slow — see ARCHITECTURE.md § "When to move
  filtering server-side" for the concrete threshold and the migration
  path (it's additive to `content.service.ts`, not a rewrite).
- **Snapshot table growth**: `ContentMetricSnapshot` and
  `AnalyticsSnapshot` grow unboundedly by design (§ append-only). Once a
  workspace has years of daily snapshots, add a rollup job that
  compresses snapshots older than N months into weekly/monthly
  aggregates in a separate summary table, while keeping raw recent data
  granular. Not needed at v1 scale — flagging so it's not a surprise at
  year two.
- **Dashboard query fan-out**: `/dashboard` currently calls the content
  service, the AI insight engine, and reads three mock modules directly
  in one Server Component. Once these are real Prisma queries, audit for
  N+1s and consider a single `getDashboardSummary(workspaceId)` service
  method that batches them, rather than the page composing four separate
  calls.

## Testing (currently absent — flagged, not silently skipped)

No test suite ships in this v1. Before real usage:

1. Unit tests for `RulesInsightEngine` (pure functions over fixture data —
   the highest-value target, since a wrong insight is a trust-breaking
   bug) and for the Zod schemas (`contentItemSchema` edge cases).
2. Integration tests for API routes once they persist real data (spin up
   a test database, hit routes, assert on Prisma state).
3. Component tests for `ContentWorkspace`'s filter logic — it's the one
   piece of nontrivial client-side business logic (see
   ARCHITECTURE.md's filtering section).

## Explicitly out of scope for this build

- Payment processing for the Products module (Stripe integration) —
  `Product.mrr` and `priceCents` are tracked as facts, not computed from
  a billing system.
- Email delivery for the Newsletter content type — `Platform.NEWSLETTER`
  is a content classification, not an ESP integration.
- White-labeling / custom domains per workspace.
