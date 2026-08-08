"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function KeyResultDeleteButton({ keyResultId }: { keyResultId: string }) {
  const t = useTranslations("okrs");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!window.confirm(t("confirmDeleteKr"))) return;
    setDeleting(true);
    const res = await fetch(`/api/key-results/${keyResultId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("form.toastError"));
      setDeleting(false);
      return;
    }
    toast.success(t("toastKrDeleted"));
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-5 w-5 text-muted-foreground/60 hover:text-destructive shrink-0"
      aria-label={t("deleteKr")}
      disabled={deleting}
      onClick={onDelete}
    >
      <X className="h-3 w-3" />
    </Button>
  );
}
