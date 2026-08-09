"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { KnowledgeDocForm } from "@/features/knowledge-base/components/knowledge-doc-form";
import type { KnowledgeDocDTO } from "@/features/knowledge-base/types/knowledge-base.types";

export function KnowledgeDocCard({ doc }: { doc: KnowledgeDocDTO }) {
  const t = useTranslations("knowledgeBase");
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    setDeleting(true);
    const res = await fetch(`/api/knowledge-base/${doc.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("form.toastError"));
      setDeleting(false);
      return;
    }
    toast.success(t("toastDeleted"));
    router.refresh();
  }

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-start gap-2.5">
        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{doc.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.excerpt}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={deleting} onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-1.5">
          {doc.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
        <span className="text-2xs text-muted-foreground font-mono">{formatDate(doc.updatedAt)}</span>
      </div>

      <KnowledgeDocForm
        open={editOpen}
        onOpenChange={setEditOpen}
        docId={doc.id}
        defaultValues={{ title: doc.title, content: doc.content, tags: doc.tags.join(", ") }}
      />
    </Card>
  );
}
