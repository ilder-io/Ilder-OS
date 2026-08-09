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
import { knowledgeDocSchema, type KnowledgeDocFormValues } from "@/features/knowledge-base/schemas/knowledge-doc.schema";

/** Create/edit dialog. Pass `docId` to edit an existing doc (PATCH); omit
 *  it to create a new one (POST). */
export function KnowledgeDocForm({
  open,
  onOpenChange,
  docId,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  docId?: string;
  defaultValues?: Partial<KnowledgeDocFormValues>;
}) {
  const t = useTranslations("knowledgeBase.form");
  const router = useRouter();
  const isEdit = Boolean(docId);

  const form = useForm<KnowledgeDocFormValues>({
    resolver: zodResolver(knowledgeDocSchema),
    defaultValues: { title: "", content: "", tags: "", ...defaultValues },
  });

  async function onSubmit(values: KnowledgeDocFormValues) {
    const res = await fetch(isEdit ? `/api/knowledge-base/${docId}` : "/api/knowledge-base", {
      method: isEdit ? "PATCH" : "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error(t("toastError"));
      return;
    }
    toast.success(isEdit ? t("toastUpdated") : t("toastCreated"), { description: values.title });
    onOpenChange(false);
    form.reset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTitle") : t("newTitle")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">{t("titleLabel")}</Label>
            <Input id="title" placeholder={t("titlePlaceholder")} {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-2xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">{t("contentLabel")}</Label>
            <Textarea id="content" rows={8} placeholder={t("contentPlaceholder")} {...form.register("content")} />
            {form.formState.errors.content && (
              <p className="text-2xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">{t("tagsLabel")}</Label>
            <Input id="tags" placeholder={t("tagsPlaceholder")} {...form.register("tags")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("saving") : isEdit ? t("saveChanges") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
