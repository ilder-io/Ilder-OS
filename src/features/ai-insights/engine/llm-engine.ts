import type { Insight, InsightContext, InsightEngine } from "@/features/ai-insights/types/insight.types";

/**
 * Structural placeholder for a future model-backed engine. Not wired up by
 * default (see `engine/index.ts`) — swap `ACTIVE_ENGINE` once a real
 * endpoint exists. The important part is the shape: it satisfies the same
 * `InsightEngine` interface as `RulesInsightEngine`, so nothing in
 * `src/features/ai-insights/components` or the `/ai-insights` page needs
 * to change when this goes live.
 *
 * Intended implementation: pass the same aggregate windows the rules engine
 * computes (never raw per-video rows, to keep the prompt small and
 * predictable) to `ANTHROPIC_API_KEY`-authenticated `/v1/messages`, asking
 * for narrative synthesis across metrics the rules engine can't correlate
 * on its own (e.g. "hook style x platform x day-of-week" interactions).
 */
export class LLMInsightEngine implements InsightEngine {
  readonly id = "llm-engine@unreleased";

  async generate(_ctx: InsightContext): Promise<Insight[]> {
    throw new Error(
      "LLMInsightEngine is a structural placeholder — wire ANTHROPIC_API_KEY and an aggregation " +
        "step before enabling. See ROADMAP.md § AI Insights."
    );
  }
}
