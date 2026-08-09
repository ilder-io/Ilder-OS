"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function WeeklyReviewDeleteButton({ id }: { id: string }) {
  const t = useTranslations("weeklyReview");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    setDeleting(true);
    const res = await fetch(`/api/reviews/weekly/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("form.toastError"));
      setDeleting(false);
      return;
    }
    toast.success(t("toastDeleted"));
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={deleting} onClick={onDelete}>
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
