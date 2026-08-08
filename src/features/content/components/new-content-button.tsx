"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/features/content/components/content-form";

export function NewContentButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("content");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newContent")}
      </Button>
      <ContentForm open={open} onOpenChange={setOpen} />
    </>
  );
}
