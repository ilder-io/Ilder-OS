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
import { useProductStatusLabel } from "@/hooks/use-enum-labels";
import { PRODUCT_STATUS_VALUES } from "@/types";
import { productSchema, type ProductFormValues } from "@/features/products/schemas/product.schema";

export function ProductForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useTranslations("products.form");
  const statusLabel = useProductStatusLabel();
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "", status: "CONCEPT", priceDollars: undefined, mrr: undefined },
  });

  async function onSubmit(values: ProductFormValues) {
    const res = await fetch("/api/products", { method: "POST", body: JSON.stringify(values) });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="product-name">{t("nameLabel")}</Label>
            <Input id="product-name" placeholder={t("namePlaceholder")} {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-2xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-description">{t("descriptionLabel")}</Label>
            <Textarea id="product-description" rows={2} placeholder={t("descriptionPlaceholder")} {...form.register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label>{t("statusLabel")}</Label>
            <Select
              defaultValue={form.getValues("status")}
              onValueChange={(v) => form.setValue("status", v as ProductFormValues["status"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRODUCT_STATUS_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>{statusLabel(value)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="product-price">{t("priceLabel")}</Label>
              <Input id="product-price" type="number" min={0} step="0.01" placeholder="49" {...form.register("priceDollars")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-mrr">{t("mrrLabel")}</Label>
              <Input id="product-mrr" type="number" min={0} placeholder="0" {...form.register("mrr")} />
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
