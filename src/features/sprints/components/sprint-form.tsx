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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { sprintSchema, type SprintFormValues } from "@/features/sprints/schemas/sprint.schema";

const NO_QUARTER = "none";

export function SprintForm({
  open,
  onOpenChange,
  quarters,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  quarters: { id: string; label: string }[];
}) {
  const t = useTranslations("sprints.form");
  const router = useRouter();

  const form = useForm<SprintFormValues>({
    resolver: zodResolver(sprintSchema),
    defaultValues: { name: "", goal: "", hypothesis: "", startsAt: "", endsAt: "", quarterId: "" },
  });

  async function onSubmit(values: SprintFormValues) {
    const res = await fetch("/api/sprints", {
      method: "POST",
      body: JSON.stringify({ ...values, quarterId: values.quarterId || undefined }),
    });
    if (!res.ok) {
      toast.error(t("toastError"));
      return;
    }
    toast.success(t("toastCreated"), { description: values.name });
    onOpenChange(false);
    form.reset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sprint-name">{t("nameLabel")}</Label>
            <Input id="sprint-name" placeholder={t("namePlaceholder")} {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-2xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sprint-goal">{t("goalLabel")}</Label>
            <Textarea id="sprint-goal" rows={2} placeholder={t("goalPlaceholder")} {...form.register("goal")} />
            {form.formState.errors.goal && (
              <p className="text-2xs text-destructive">{form.formState.errors.goal.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sprint-hypothesis">{t("hypothesisLabel")}</Label>
            <Textarea id="sprint-hypothesis" rows={2} placeholder={t("hypothesisPlaceholder")} {...form.register("hypothesis")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sprint-starts">{t("startsLabel")}</Label>
              <Input id="sprint-starts" type="date" {...form.register("startsAt")} />
              {form.formState.errors.startsAt && (
                <p className="text-2xs text-destructive">{form.formState.errors.startsAt.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sprint-ends">{t("endsLabel")}</Label>
              <Input id="sprint-ends" type="date" {...form.register("endsAt")} />
              {form.formState.errors.endsAt && (
                <p className="text-2xs text-destructive">{form.formState.errors.endsAt.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("quarterLabel")}</Label>
            <Select
              defaultValue={NO_QUARTER}
              onValueChange={(v) => form.setValue("quarterId", v === NO_QUARTER ? "" : v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_QUARTER}>{t("noQuarter")}</SelectItem>
                {quarters.map((q) => (
                  <SelectItem key={q.id} value={q.id}>{q.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
