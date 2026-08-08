"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Play, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContentStatusBadge } from "@/components/shared/status-badge";
import { PillarDot } from "@/components/shared/pillar-dot";
import { usePlatformLabel } from "@/hooks/use-enum-labels";
import { formatCompactNumber, formatDate } from "@/lib/utils";
import type { ContentItemDTO } from "@/features/content/types/content.types";

export function ContentCard({ item, index = 0 }: { item: ContentItemDTO; index?: number }) {
  const t = useTranslations("content");
  const platformLabel = usePlatformLabel();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.02 }}>
      <Link href={`/content/${item.id}`}>
        <Card className="p-4 h-full flex flex-col gap-3 hover:border-primary/40 transition-colors group">
          <div className="aspect-video rounded-lg bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
            <Play className="h-6 w-6 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xs text-muted-foreground">{platformLabel(item.platform)}</span>
              <ContentStatusBadge status={item.status} />
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{item.title}</p>
            <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
              <PillarDot name={item.pillar} />
              {item.pillar}
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-2 border-t border-border text-2xs font-mono text-muted-foreground">
            <span>{formatDate(item.publishedAt)}</span>
            <span className="flex items-center gap-2">
              <span>{t("viewsCount", { count: formatCompactNumber(item.metrics.views) })}</span>
              <span className="flex items-center gap-0.5 text-success">
                <Users className="h-3 w-3" />+{formatCompactNumber(item.metrics.followersGenerated)}
              </span>
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
