import { RulesInsightEngine } from "@/features/ai-insights/engine/rules-engine";
import type { InsightEngine } from "@/features/ai-insights/types/insight.types";

/** Single seam for swapping the insight engine. Everything downstream only
 *  imports `ACTIVE_ENGINE`, never a concrete class. */
export const ACTIVE_ENGINE: InsightEngine = new RulesInsightEngine();

export * from "@/features/ai-insights/types/insight.types";
