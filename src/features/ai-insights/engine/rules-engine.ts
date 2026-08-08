import { contentService } from "@/features/content/api/content.service";
import type { Insight, InsightContext, InsightEngine } from "@/features/ai-insights/types/insight.types";

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

function pctDelta(sample: number, baseline: number): number {
  if (baseline === 0) return 0;
  return (sample - baseline) / baseline;
}

/**
 * Deterministic, explainable insight generation over the content dataset.
 * No network call, no LLM — every insight here is a plain statistical
 * comparison (group vs. rest-of-population) so it can run instantly and be
 * fully audited. This is `sourceModel: "rules-engine@v1"`.
 *
 * Swap point for the future: implement `InsightEngine` with a model that
 * calls out to an LLM (e.g. summarizing the same underlying aggregates
 * into more nuanced, cross-metric narratives) — see `llm-engine.ts` for the
 * shape that would take. The UI (`ai-insights` feature components) only
 * ever depends on `Insight[]`, never on how it was produced.
 */
export class RulesInsightEngine implements InsightEngine {
  readonly id = "rules-engine@v1";

  async generate(ctx: InsightContext): Promise<Insight[]> {
    const items = await contentService.listContent(ctx.workspaceId);
    const published = items.filter((c) => c.status === "PUBLISHED");
    const insights: Insight[] = [];
    const now = new Date().toISOString();
    let n = 0;
    const nextId = () => `insight-${++n}`;

    // 1. Topic vs retention (e.g. Git content)
    const gitItems = published.filter((c) => c.title.toLowerCase().includes("git"));
    const restForGit = published.filter((c) => !c.title.toLowerCase().includes("git"));
    if (gitItems.length >= 3) {
      const gitRetention = avg(gitItems.map((c) => c.metrics.retentionPct));
      const restRetention = avg(restForGit.map((c) => c.metrics.retentionPct));
      const delta = pctDelta(gitRetention, restRetention);
      if (Math.abs(delta) > 0.05) {
        insights.push({
          id: nextId(),
          category: "CONTENT",
          headline: `Videos about Git have ${Math.round(delta * 100)}% ${delta > 0 ? "higher" : "lower"} retention`,
          detail: `Across ${gitItems.length} Git-focused videos, average retention is ${gitRetention.toFixed(1)}% vs ${restRetention.toFixed(1)}% for everything else. Consider prioritizing Git topics in the next sprint's content queue.`,
          confidence: Math.min(0.95, 0.55 + gitItems.length * 0.03),
          metricDelta: delta,
          sourceModel: this.id,
          createdAt: now,
        });
      }
    }

    // 2. Format (storytelling pillars) vs follower conversion
    const storyPillars = new Set(["Storytime", "Build in Public"]);
    const storyItems = published.filter((c) => storyPillars.has(c.pillar));
    const restForStory = published.filter((c) => !storyPillars.has(c.pillar));
    if (storyItems.length >= 3) {
      const storyConv = avg(storyItems.map((c) => c.metrics.conversionRatePct));
      const restConv = avg(restForStory.map((c) => c.metrics.conversionRatePct));
      const delta = pctDelta(storyConv, restConv);
      if (Math.abs(delta) > 0.05) {
        insights.push({
          id: nextId(),
          category: "CONVERSION",
          headline: `Storytelling videos convert ${Math.round(delta * 100)}% ${delta > 0 ? "more" : "fewer"} followers`,
          detail: `"Storytime" and "Build in Public" content converts profile visits to follows at ${storyConv.toFixed(1)}% vs ${restConv.toFixed(1)}% elsewhere. Personal narrative appears to build more follow-intent than pure tutorial content.`,
          confidence: Math.min(0.92, 0.5 + storyItems.length * 0.03),
          metricDelta: delta,
          sourceModel: this.id,
          createdAt: now,
        });
      }
    }

    // 3. Technical/tutorial content vs saves (bookmarking behavior)
    const techPillars = new Set(["Tech Reviews", "Coding Tutorials"]);
    const techItems = published.filter((c) => techPillars.has(c.pillar));
    const restForTech = published.filter((c) => !techPillars.has(c.pillar));
    if (techItems.length >= 3) {
      const techSaveRate = avg(techItems.map((c) => c.metrics.saves / Math.max(c.metrics.views, 1)));
      const restSaveRate = avg(restForTech.map((c) => c.metrics.saves / Math.max(c.metrics.views, 1)));
      const ratio = restSaveRate > 0 ? techSaveRate / restSaveRate : 1;
      if (ratio > 1.15 || ratio < 0.85) {
        insights.push({
          id: nextId(),
          category: "AUDIENCE",
          headline: `Technology content gets ${ratio.toFixed(1)}x more saves`,
          detail: `Coding Tutorials and Tech Reviews are saved at ${(techSaveRate * 100).toFixed(2)}% of views vs ${(restSaveRate * 100).toFixed(2)}% for other pillars — a strong signal viewers treat it as reference material worth repurposing into a written companion (blog or docs).`,
          confidence: 0.8,
          metricDelta: ratio - 1,
          sourceModel: this.id,
          createdAt: now,
        });
      }
    }

    // 4. Best duration bucket by retention
    const buckets: { label: string; min: number; max: number }[] = [
      { label: "under 60s", min: 0, max: 60 },
      { label: "1-3 minutes", min: 60, max: 180 },
      { label: "3-8 minutes", min: 180, max: 480 },
      { label: "8+ minutes", min: 480, max: Infinity },
    ];
    const byBucket = buckets
      .map((b) => ({
        ...b,
        items: published.filter((c) => c.durationSecs >= b.min && c.durationSecs < b.max),
      }))
      .filter((b) => b.items.length >= 3)
      .map((b) => ({ ...b, retention: avg(b.items.map((c) => c.metrics.retentionPct)) }));
    if (byBucket.length >= 2) {
      const best = byBucket.reduce((a, b) => (b.retention > a.retention ? b : a));
      const overall = avg(published.map((c) => c.metrics.retentionPct));
      const delta = pctDelta(best.retention, overall);
      if (delta > 0.05) {
        insights.push({
          id: nextId(),
          category: "TIMING",
          headline: `Videos ${best.label} hold retention ${Math.round(delta * 100)}% above average`,
          detail: `${best.items.length} published videos in the "${best.label}" range average ${best.retention.toFixed(1)}% retention vs ${overall.toFixed(1)}% overall. Worth defaulting new scripts to this length before editing down or padding up.`,
          confidence: 0.7,
          metricDelta: delta,
          sourceModel: this.id,
          createdAt: now,
        });
      }
    }

    // 5. Risk: platform with below-average retention at meaningful volume
    const byPlatform = new Map<string, typeof published>();
    for (const c of published) {
      byPlatform.set(c.platform, [...(byPlatform.get(c.platform) ?? []), c]);
    }
    const overallRetention = avg(published.map((c) => c.metrics.retentionPct));
    for (const [platform, items] of byPlatform) {
      if (items.length < 4) continue;
      const r = avg(items.map((c) => c.metrics.retentionPct));
      const delta = pctDelta(r, overallRetention);
      if (delta < -0.15) {
        insights.push({
          id: nextId(),
          category: "RISK",
          headline: `${platform.replace(/_/g, " ")} retention is trailing the rest of the portfolio`,
          detail: `${items.length} published items on ${platform.replace(/_/g, " ")} average ${r.toFixed(1)}% retention, ${Math.abs(Math.round(delta * 100))}% below the ${overallRetention.toFixed(1)}% workspace average. Worth a format audit before investing more sprint time there.`,
          confidence: 0.65,
          metricDelta: delta,
          sourceModel: this.id,
          createdAt: now,
        });
        break; // surface the single clearest risk, not one per platform
      }
    }

    return insights.sort((a, b) => b.confidence - a.confidence);
  }
}
