"use client";

import { useTranslations } from "next-intl";
import type {
  Platform,
  ContentStatus,
  OKRStatus,
  SprintStatus,
  TaskStatus,
  IdeaStatus,
  ProductStatus,
  InsightCategory,
} from "@/types";

/** Translated label for a `Platform` enum value — namespace `status.platform`. */
export function usePlatformLabel(): (platform: Platform) => string {
  const t = useTranslations("status.platform");
  return (platform) => t(platform);
}

export function useContentStatusLabel(): (status: ContentStatus) => string {
  const t = useTranslations("status.content");
  return (status) => t(status);
}

export function useOKRStatusLabel(): (status: OKRStatus) => string {
  const t = useTranslations("status.okr");
  return (status) => t(status);
}

export function useSprintStatusLabel(): (status: SprintStatus) => string {
  const t = useTranslations("status.sprint");
  return (status) => t(status);
}

export function useTaskStatusLabel(): (status: TaskStatus) => string {
  const t = useTranslations("status.task");
  return (status) => t(status);
}

export function useIdeaStatusLabel(): (status: IdeaStatus) => string {
  const t = useTranslations("status.idea");
  return (status) => t(status);
}

export function useProductStatusLabel(): (status: ProductStatus) => string {
  const t = useTranslations("status.product");
  return (status) => t(status);
}

export function useInsightCategoryLabel(): (category: InsightCategory) => string {
  const t = useTranslations("status.insightCategory");
  return (category) => t(category);
}
