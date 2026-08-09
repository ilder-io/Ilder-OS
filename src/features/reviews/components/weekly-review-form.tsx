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
import { weeklyReviewSchema, type WeeklyReviewFormValues } from "@/features/reviews/schemas/review.schema";

/** Submitting for a week that already has an entry edits it in place — see
 *  ReviewsRepository.createWeekly's upsert-by-week semantics. */
export function WeeklyReviewForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useTranslations("weeklyReview.form");
  const router = useRouter();

  const form = useForm<WeeklyReviewFormValues>({
    resolver: zodResolver(weeklyReviewSchema),
    defaultValues: { weekStart: "", wins: "", challenges: "", focusNext: "" },
  });

  async function onSubmit(values: WeeklyReviewFormValues) {
    const res = await fetch("/api/reviews/weekly", { method: "POST", body: JSON.stringify(values) });
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
            <Label htmlFor="weekStart">{t("weekStartLabel")}</Label>
            <Input id="weekStart" type="date" {...form.register("weekStart")} />
            {form.formState.errors.weekStart && (
              <p className="text-2xs text-destructive">{form.formState.errors.weekStart.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wins">{t("winsLabel")}</Label>
            <Textarea id="wins" rows={3} placeholder={t("winsPlaceholder")} {...form.register("wins")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="challenges">{t("challengesLabel")}</Label>
            <Textarea id="challenges" rows={3} placeholder={t("challengesPlaceholder")} {...form.register("challenges")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="focusNext">{t("focusNextLabel")}</Label>
            <Textarea id="focusNext" rows={3} placeholder={t("focusNextPlaceholder")} {...form.register("focusNext")} />
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
