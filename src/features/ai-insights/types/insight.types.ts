import type { InsightCategory } from "@/types";

export interface Insight {
  id: string;
  category: InsightCategory;
  headline: string;
  detail: string;
  confidence: number; // 0-1
  metricDelta?: number; // signed, e.g. 0.31 for "+31%"
  sourceModel: string;
  pinned?: boolean;
  createdAt: string;
}

/** Everything an engine needs to reason about the workspace. Kept narrow
 *  and serializable on purpose — this is the contract a future LLM-backed
 *  engine (or an external inference service) has to satisfy too. */
export interface InsightContext {
  workspaceId: string;
  windowDays: number;
}

export interface InsightEngine {
  readonly id: string;
  generate(ctx: InsightContext): Promise<Insight[]>;
}
