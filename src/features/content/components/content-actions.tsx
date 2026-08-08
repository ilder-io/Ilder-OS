"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/features/content/components/content-form";
import type { ContentItemDTO } from "@/features/content/types/content.types";
import type { ContentItemFormValues } from "@/features/content/schemas/content.schema";

export function ContentActions({ item }: { item: ContentItemDTO }) {
  const t = useTranslations("content");
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const defaultValues: Partial<ContentItemFormValues> = {
    title: item.title,
    platform: item.platform,
    status: item.status,
    pillar: item.pillar,
    series: item.series ?? "",
    hook: item.hook,
    cta: item.cta,
    script: item.script,
    durationSecs: item.durationSecs,
  };

  async function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    setDeleting(true);
    const res = await fetch(`/api/content/${item.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("form.toastError"));
      setDeleting(false);
      return;
    }
    toast.success(t("toastDeleted"));
    router.push("/content");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Pencil className="h-3.5 w-3.5" />
        {t("edit")}
      </Button>
      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" disabled={deleting} onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5" />
        {t("delete")}
      </Button>
      <ContentForm open={editOpen} onOpenChange={setEditOpen} contentId={item.id} defaultValues={defaultValues} />
    </div>
  );
}
