"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthlyReviewForm } from "@/features/reviews/components/monthly-review-form";

export function NewMonthlyReviewButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("monthlyReview");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newReview")}
      </Button>
      <MonthlyReviewForm open={open} onOpenChange={setOpen} />
    </>
  );
}
