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
import { contentItemSchema, type ContentItemFormValues } from "@/features/content/schemas/content.schema";
import { usePlatformLabel, useContentStatusLabel } from "@/hooks/use-enum-labels";
import { PLATFORM_VALUES, CONTENT_STATUS_VALUES } from "@/types";

/**
 * Create/edit dialog. Pass `contentId` to edit an existing item (PATCH);
 * omit it to create a new one (POST). Both routes validate against the
 * same `contentItemSchema` the form already resolves against.
 */
export function ContentForm({
  open,
  onOpenChange,
  contentId,
  defaultValues,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contentId?: string;
  defaultValues?: Partial<ContentItemFormValues>;
  onSubmitted?: (values: ContentItemFormValues) => void;
}) {
  const t = useTranslations("content.form");
  const platformLabel = usePlatformLabel();
  const statusLabel = useContentStatusLabel();
  const router = useRouter();
  const isEdit = Boolean(contentId);

  const form = useForm<ContentItemFormValues>({
    resolver: zodResolver(contentItemSchema),
    defaultValues: {
      title: "",
      platform: "YOUTUBE",
      status: "IDEA",
      pillar: "",
      series: "",
      hook: "",
      cta: "",
      script: "",
      durationSecs: undefined,
      ...defaultValues,
    },
  });

  async function onSubmit(values: ContentItemFormValues) {
    const res = await fetch(isEdit ? `/api/content/${contentId}` : "/api/content", {
      method: isEdit ? "PATCH" : "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error(t("toastError"));
      return;
    }
    toast.success(isEdit ? t("toastUpdated") : t("toastCreated"), {
      description: values.title,
    });
    onSubmitted?.(values);
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("platformLabel")}</Label>
              <Select
                defaultValue={form.getValues("platform")}
                onValueChange={(v) => form.setValue("platform", v as ContentItemFormValues["platform"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLATFORM_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>{platformLabel(value)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t("statusLabel")}</Label>
              <Select
                defaultValue={form.getValues("status")}
                onValueChange={(v) => form.setValue("status", v as ContentItemFormValues["status"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_STATUS_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>{statusLabel(value)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pillar">{t("pillarLabel")}</Label>
              <Input id="pillar" placeholder={t("pillarPlaceholder")} {...form.register("pillar")} />
              {form.formState.errors.pillar && (
                <p className="text-2xs text-destructive">{form.formState.errors.pillar.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationSecs">{t("durationLabel")}</Label>
              <Input id="durationSecs" type="number" placeholder="180" {...form.register("durationSecs")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="series">{t("seriesLabel")}</Label>
            <Input id="series" placeholder={t("seriesPlaceholder")} {...form.register("series")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hook">{t("hookLabel")}</Label>
            <Input id="hook" placeholder={t("hookPlaceholder")} {...form.register("hook")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cta">{t("ctaLabel")}</Label>
            <Input id="cta" placeholder={t("ctaPlaceholder")} {...form.register("cta")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="script">{t("scriptLabel")}</Label>
            <Textarea id="script" rows={5} placeholder={t("scriptPlaceholder")} {...form.register("script")} />
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
