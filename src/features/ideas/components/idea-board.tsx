"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdeaStatusBadge } from "@/components/shared/status-badge";
import { useIdeaStatusLabel } from "@/hooks/use-enum-labels";
import { toast } from "sonner";
import type { IdeaDTO } from "@/features/ideas/types/ideas.types";
import type { IdeaStatus } from "@/types";

const COLUMN_ORDER: IdeaStatus[] = ["INBOX", "SHORTLISTED", "IN_PROGRESS", "SHIPPED"];

function IdeaBoardCard({ idea }: { idea: IdeaDTO }) {
  const t = useTranslations("ideas");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    setDeleting(true);
    const res = await fetch(`/api/ideas/${idea.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("form.toastError"));
      setDeleting(false);
      return;
    }
    toast.success(t("toastDeleted"));
    router.refresh();
  }

  return (
    <Card className="p-3 space-y-1.5">
      <p className="text-xs text-foreground/90">{idea.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xs font-mono text-muted-foreground">I{idea.impact} · E{idea.effort}</span>
        <div className="flex items-center gap-1">
          <IdeaStatusBadge status={idea.status} />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            aria-label={t("delete")}
            disabled={deleting}
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function IdeaBoard({ ideas }: { ideas: IdeaDTO[] }) {
  const ideaStatusLabel = useIdeaStatusLabel();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {COLUMN_ORDER.map((status) => {
        const items = ideas.filter((i) => i.status === status);
        return (
          <div key={status} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">{ideaStatusLabel(status)}</span>
              <span className="text-2xs font-mono text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-1.5">
              {items.map((idea) => (
                <IdeaBoardCard key={idea.id} idea={idea} />
              ))}
              {items.length === 0 && <div className="rounded-md border border-dashed border-border h-14" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
