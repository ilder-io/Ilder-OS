"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { quarterSchema, type QuarterFormValues } from "@/features/okrs/schemas/quarter.schema";

const QUARTER_OPTIONS = [1, 2, 3, 4] as const;

export function QuarterForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useTranslations("quarterPlanning.form");
  const router = useRouter();

  const form = useForm<QuarterFormValues>({
    resolver: zodResolver(quarterSchema),
    defaultValues: { year: new Date().getFullYear(), quarter: 1, theme: "" },
  });

  async function onSubmit(values: QuarterFormValues) {
    const res = await fetch("/api/quarters", { method: "POST", body: JSON.stringify(values) });
    if (res.status === 409) {
      toast.error(t("toastDuplicate"));
      return;
    }
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quarter-year">{t("yearLabel")}</Label>
              <Input id="quarter-year" type="number" {...form.register("year")} />
              {form.formState.errors.year && (
                <p className="text-2xs text-destructive">{form.formState.errors.year.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>{t("quarterLabel")}</Label>
              <Select
                defaultValue={String(form.getValues("quarter"))}
                onValueChange={(v) => form.setValue("quarter", Number(v))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {QUARTER_OPTIONS.map((q) => (
                    <SelectItem key={q} value={String(q)}>{`Q${q}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quarter-theme">{t("themeLabel")}</Label>
            <Input id="quarter-theme" placeholder={t("themePlaceholder")} {...form.register("theme")} />
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
