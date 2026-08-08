"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/features/products/components/product-form";

export function NewProductButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("products");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newProduct")}
      </Button>
      <ProductForm open={open} onOpenChange={setOpen} />
    </>
  );
}
