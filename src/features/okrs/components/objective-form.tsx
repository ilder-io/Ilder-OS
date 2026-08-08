"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { objectiveSchema, type ObjectiveFormValues } from "@/features/okrs/schemas/objective.schema";

export function ObjectiveForm({
  open,
  onOpenChange,
  quarters,
  defaultQuarterId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  quarters: { id: string; label: string }[];
  defaultQuarterId: string;
}) {
  const t = useTranslations("okrs.form");
  const router = useRouter();

  const form = useForm<ObjectiveFormValues>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: {
      quarterId: defaultQuarterId,
      title: "",
      description: "",
      keyResults: [{ title: "", targetValue: 0, unit: "%" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "keyResults" });

  async function onSubmit(values: ObjectiveFormValues) {
    const res = await fetch("/api/objectives", { method: "POST", body: JSON.stringify(values) });
    if (!res.ok) {
      toast.error(t("toastError"));
      return;
    }
    toast.success(t("toastCreated"), { description: values.title });
    onOpenChange(false);
    form.reset({ quarterId: defaultQuarterId, title: "", description: "", keyResults: [{ title: "", targetValue: 0, unit: "%" }] });
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
            <Label htmlFor="obj-title">{t("titleLabel")}</Label>
            <Input id="obj-title" placeholder={t("titlePlaceholder")} {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-2xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="obj-description">{t("descriptionLabel")}</Label>
            <Textarea id="obj-description" rows={2} placeholder={t("descriptionPlaceholder")} {...form.register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label>{t("quarterLabel")}</Label>
            <Select
              defaultValue={defaultQuarterId}
              onValueChange={(v) => form.setValue("quarterId", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {quarters.map((q) => (
                  <SelectItem key={q.id} value={q.id}>{q.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("keyResultsLabel")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: "", targetValue: 0, unit: "%" })}
                disabled={fields.length >= 6}
              >
                <Plus className="h-3.5 w-3.5" />
                {t("addKeyResult")}
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[1fr_88px_72px_28px] gap-2 items-start">
                <Input placeholder={t("krTitlePlaceholder")} {...form.register(`keyResults.${index}.title`)} />
                <Input type="number" placeholder={t("krTargetPlaceholder")} {...form.register(`keyResults.${index}.targetValue`)} />
                <Input placeholder={t("krUnitPlaceholder")} {...form.register(`keyResults.${index}.unit`)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  aria-label={t("removeKeyResult")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {form.formState.errors.keyResults?.root && (
              <p className="text-2xs text-destructive">{form.formState.errors.keyResults.root.message}</p>
            )}
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
