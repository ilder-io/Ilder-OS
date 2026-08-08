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
import { ideaSchema, type IdeaFormValues } from "@/features/ideas/schemas/idea.schema";

export function IdeaForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useTranslations("ideas.form");
  const router = useRouter();

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: { title: "", notes: "", impact: 3, effort: 3 },
  });

  async function onSubmit(values: IdeaFormValues) {
    const res = await fetch("/api/ideas", { method: "POST", body: JSON.stringify(values) });
    if (!res.ok) {
      toast.error(t("toastError"));
      return;
    }
    toast.success(t("toastCreated"), { description: values.title });
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
          <div className="space-y-1.5">
            <Label htmlFor="idea-title">{t("titleLabel")}</Label>
            <Input id="idea-title" placeholder={t("titlePlaceholder")} {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-2xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="idea-notes">{t("notesLabel")}</Label>
            <Textarea id="idea-notes" rows={3} placeholder={t("notesPlaceholder")} {...form.register("notes")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="idea-impact">{t("impactLabel")}</Label>
              <Input id="idea-impact" type="number" min={1} max={5} {...form.register("impact")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="idea-effort">{t("effortLabel")}</Label>
              <Input id="idea-effort" type="number" min={1} max={5} {...form.register("effort")} />
            </div>
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
