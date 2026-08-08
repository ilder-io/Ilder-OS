"use client";

import { Badge } from "@/components/ui/badge";
import {
  useContentStatusLabel,
  useOKRStatusLabel,
  useSprintStatusLabel,
  useIdeaStatusLabel,
  useProductStatusLabel,
} from "@/hooks/use-enum-labels";
import type { ContentStatus, OKRStatus, SprintStatus, IdeaStatus, ProductStatus } from "@/types";

const CONTENT_VARIANT: Record<ContentStatus, "default" | "secondary" | "success" | "warning" | "muted"> = {
  IDEA: "muted",
  SCRIPTING: "secondary",
  FILMING: "secondary",
  EDITING: "warning",
  SCHEDULED: "default",
  PUBLISHED: "success",
  ARCHIVED: "muted",
};

const OKR_VARIANT: Record<OKRStatus, "default" | "secondary" | "success" | "warning" | "destructive" | "muted"> = {
  NOT_STARTED: "muted",
  ON_TRACK: "success",
  AT_RISK: "warning",
  OFF_TRACK: "destructive",
  COMPLETED: "default",
};

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const label = useContentStatusLabel();
  return <Badge variant={CONTENT_VARIANT[status]}>{label(status)}</Badge>;
}

export function OKRStatusBadge({ status }: { status: OKRStatus }) {
  const label = useOKRStatusLabel();
  return <Badge variant={OKR_VARIANT[status]}>{label(status)}</Badge>;
}

const SPRINT_VARIANT: Record<SprintStatus, "muted" | "default" | "success"> = {
  PLANNED: "muted",
  ACTIVE: "default",
  COMPLETED: "success",
};
export function SprintStatusBadge({ status }: { status: SprintStatus }) {
  const label = useSprintStatusLabel();
  return <Badge variant={SPRINT_VARIANT[status]}>{label(status)}</Badge>;
}

const IDEA_VARIANT: Record<IdeaStatus, "muted" | "secondary" | "default" | "success" | "destructive"> = {
  INBOX: "muted",
  SHORTLISTED: "secondary",
  IN_PROGRESS: "default",
  SHIPPED: "success",
  DISCARDED: "destructive",
};
export function IdeaStatusBadge({ status }: { status: IdeaStatus }) {
  const label = useIdeaStatusLabel();
  return <Badge variant={IDEA_VARIANT[status]}>{label(status)}</Badge>;
}

const PRODUCT_VARIANT: Record<ProductStatus, "muted" | "secondary" | "success" | "warning"> = {
  CONCEPT: "muted",
  BUILDING: "secondary",
  LIVE: "success",
  SUNSET: "warning",
};
export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const label = useProductStatusLabel();
  return <Badge variant={PRODUCT_VARIANT[status]}>{label(status)}</Badge>;
}
