/**
 * Seeds a real Postgres database with data shaped like the mock dataset the
 * UI ships with, so the transition from "demo mode" to "connected to
 * Supabase" doesn't start from an empty workspace. Run with `npm run db:seed`
 * after `npm run db:push` against a real DATABASE_URL.
 *
 * Deliberately NOT imported by any app code — this only runs via the CLI.
 */
import { PrismaClient } from "@prisma/client";
import { MOCK_CONTENT_ITEMS, PILLARS } from "../src/mock/content.mock";
import { MOCK_QUARTERS } from "../src/mock/okrs.mock";
import { MOCK_SPRINTS } from "../src/mock/sprints.mock";
import { MOCK_PRODUCTS } from "../src/mock/products.mock";
import { MOCK_IDEAS } from "../src/mock/ideas.mock";
import { getFollowerGrowth, getViewsGrowth, getEngagementTrend } from "../src/mock/analytics.mock";
import { MOCK_KNOWLEDGE_DOCS } from "../src/mock/knowledge.mock";
import { MOCK_WEEKLY_REVIEWS, MOCK_MONTHLY_REVIEWS } from "../src/mock/reviews.mock";

const db = new PrismaClient();

// Same fixed anchor date the analytics mock generators use internally, so
// the reconstructed `capturedAt` timestamps below line up with the values
// each series returns for a given day-offset.
const SEED_DAYS = 90;
const SEED_NOW = new Date("2026-08-07T00:00:00Z").getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  const workspace = await db.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: { name: "Demo Workspace", slug: "demo-workspace" },
  });

  const pillarByName = new Map<string, string>();
  for (const name of PILLARS) {
    const pillar = await db.pillar.upsert({
      where: { workspaceId_name: { workspaceId: workspace.id, name } },
      update: {},
      create: { workspaceId: workspace.id, name },
    });
    pillarByName.set(name, pillar.id);
  }

  for (const item of MOCK_CONTENT_ITEMS) {
    const pillarId = pillarByName.get(item.pillar);
    const created = await db.contentItem.create({
      data: {
        workspaceId: workspace.id,
        title: item.title,
        platform: item.platform,
        status: item.status,
        pillarId,
        hook: item.hook,
        cta: item.cta,
        durationSecs: item.durationSecs,
        publishedAt: new Date(item.publishedAt),
      },
    });
    await db.contentMetricSnapshot.create({
      data: { contentItemId: created.id, ...item.metrics },
    });
  }

  for (const q of MOCK_QUARTERS) {
    const [quarterNum, yearStr] = q.label.split(" ");
    const year = Number(yearStr);
    const quarter = Number(quarterNum?.replace("Q", ""));
    const quarterRow = await db.quarter.create({
      data: {
        workspaceId: workspace.id,
        year,
        quarter,
        theme: q.theme,
        startsAt: new Date(`${year}-01-01`),
        endsAt: new Date(`${year}-12-31`),
      },
    });
    for (const o of q.objectives) {
      await db.objective.create({
        data: {
          workspaceId: workspace.id,
          quarterId: quarterRow.id,
          title: o.title,
          description: o.description,
          status: o.status,
          keyResults: {
            create: o.keyResults.map((kr) => ({
              title: kr.title,
              targetValue: kr.targetValue,
              currentValue: kr.currentValue,
              unit: kr.unit,
              status: kr.status,
            })),
          },
        },
      });
    }
  }

  for (const s of MOCK_SPRINTS) {
    await db.sprint.create({
      data: {
        workspaceId: workspace.id,
        name: s.name,
        goal: s.goal,
        hypothesis: s.hypothesis,
        status: s.status,
        startsAt: new Date(s.startsAt),
        endsAt: new Date(s.endsAt),
        results: s.results,
        learnings: s.learnings,
        tasks: { create: s.tasks.map((t, i) => ({ title: t.title, status: t.status, order: i })) },
        metrics: { create: s.metrics.map((m) => ({ label: m.label, target: m.target, actual: m.actual })) },
        actionItems: { create: s.actionItems.map((a) => ({ title: a.title, done: a.done })) },
      },
    });
  }

  for (const p of MOCK_PRODUCTS) {
    await db.product.create({
      data: { workspaceId: workspace.id, name: p.name, description: p.description, status: p.status, mrr: p.mrr ?? undefined },
    });
  }

  for (const idea of MOCK_IDEAS) {
    await db.idea.create({
      data: {
        workspaceId: workspace.id,
        title: idea.title,
        notes: idea.notes,
        status: idea.status,
        impact: idea.impact,
        effort: idea.effort,
      },
    });
  }

  // Account-level history (see AnalyticsSnapshot in schema.prisma) — powers
  // the Growth over time charts on Dashboard/Analytics. Reuses the same
  // generators the mock-data build renders directly, so a freshly seeded
  // workspace looks identical whether or not DATABASE_URL is wired up.
  const followerSeries = getFollowerGrowth(SEED_DAYS);
  const viewsSeries = getViewsGrowth(SEED_DAYS);
  const engagementSeries = getEngagementTrend(SEED_DAYS);

  for (let j = 0; j < followerSeries.length; j++) {
    const dayOffset = SEED_DAYS - j;
    const views = viewsSeries[j]?.value ?? 0;
    await db.analyticsSnapshot.create({
      data: {
        workspaceId: workspace.id,
        platform: "YOUTUBE",
        capturedAt: new Date(SEED_NOW - dayOffset * DAY_MS),
        followers: followerSeries[j]?.value ?? 0,
        totalViews: views,
        totalLikes: Math.round(views * 0.05),
        engagementPct: engagementSeries[j]?.value ?? null,
      },
    });
  }

  for (const doc of MOCK_KNOWLEDGE_DOCS) {
    await db.knowledgeDoc.create({
      data: { workspaceId: workspace.id, title: doc.title, content: doc.excerpt, tags: doc.tags },
    });
  }

  // weekStart/monthStart aren't in the mock shape (it stores a pre-formatted
  // label instead) — these anchor dates reproduce the same labels via
  // formatWeekLabel/formatMonthLabel in reviews.repository.ts.
  const WEEKLY_REVIEW_STARTS = ["2026-08-04", "2026-07-28"];
  for (const [i, r] of MOCK_WEEKLY_REVIEWS.entries()) {
    await db.weeklyReview.create({
      data: {
        workspaceId: workspace.id,
        weekStart: new Date(WEEKLY_REVIEW_STARTS[i] ?? WEEKLY_REVIEW_STARTS[0]!),
        wins: r.wins.join("\n"),
        challenges: r.challenges.join("\n"),
        focusNext: r.focusNext.join("\n"),
      },
    });
  }

  const MONTHLY_REVIEW_STARTS = ["2026-07-01"];
  for (const [i, r] of MOCK_MONTHLY_REVIEWS.entries()) {
    await db.monthlyReview.create({
      data: {
        workspaceId: workspace.id,
        monthStart: new Date(MONTHLY_REVIEW_STARTS[i] ?? MONTHLY_REVIEW_STARTS[0]!),
        summary: r.summary,
        highlights: r.highlights.join("\n"),
        lowlights: r.lowlights.join("\n"),
        nextFocus: r.nextFocus.join("\n"),
      },
    });
  }

  console.log(
    `Seeded workspace "${workspace.slug}" with ${MOCK_CONTENT_ITEMS.length} content items and ${followerSeries.length} analytics snapshots.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
