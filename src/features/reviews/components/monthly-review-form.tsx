"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { monthlyReviewSchema, type MonthlyReviewFormValues } from "@/features/reviews/schemas/review.schema";

/** Submitting for a month that already has an entry edits it in place — see
 *  ReviewsRepository.createMonthly's upsert-by-month semantics. */
export function MonthlyReviewForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useTranslations("monthlyReview.form");
  const router = useRouter();

  const form = useForm<MonthlyReviewFormValues>({
    resolver: zodResolver(monthlyReviewSchema),
    defaultValues: { monthStart: "", summary: "", highlights: "", lowlights: "", nextFocus: "" },
  });

  async function onSubmit(values: MonthlyReviewFormValues) {
    const res = await fetch("/api/reviews/monthly", { method: "POST", body: JSON.stringify(values) });
    if (!res.ok) {
      toast.error(t("toastError"));
      return;
    }
    toast.success(t("toastCreated"));
    onOpenChange(false);
    form.reset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="monthStart">{t("monthStartLabel")}</Label>
            <Input id="monthStart" type="month" {...form.register("monthStart")} />
            {form.formState.errors.monthStart && (
              <p className="text-2xs text-destructive">{form.formState.errors.monthStart.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary">{t("summaryLabel")}</Label>
            <Textarea id="summary" rows={2} placeholder={t("summaryPlaceholder")} {...form.register("summary")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="highlights">{t("highlightsLabel")}</Label>
            <Textarea id="highlights" rows={3} placeholder={t("highlightsPlaceholder")} {...form.register("highlights")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lowlights">{t("lowlightsLabel")}</Label>
            <Textarea id="lowlights" rows={3} placeholder={t("lowlightsPlaceholder")} {...form.register("lowlights")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nextFocus">{t("nextFocusLabel")}</Label>
            <Textarea id="nextFocus" rows={3} placeholder={t("nextFocusPlaceholder")} {...form.register("nextFocus")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
