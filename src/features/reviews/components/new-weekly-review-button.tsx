"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeeklyReviewForm } from "@/features/reviews/components/weekly-review-form";

export function NewWeeklyReviewButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("weeklyReview");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newReview")}
      </Button>
      <WeeklyReviewForm open={open} onOpenChange={setOpen} />
    </>
  );
}
