"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function QuarterDeleteButton({ quarterId }: { quarterId: string }) {
  const t = useTranslations("quarterPlanning");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    setDeleting(true);
    const res = await fetch(`/api/quarters/${quarterId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("form.toastError"));
      setDeleting(false);
      return;
    }
    toast.success(t("toastDeleted"));
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
      aria-label={t("delete")}
      disabled={deleting}
      onClick={onDelete}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
