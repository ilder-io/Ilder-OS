"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaForm } from "@/features/ideas/components/idea-form";

export function NewIdeaButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("ideas");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newIdea")}
      </Button>
      <IdeaForm open={open} onOpenChange={setOpen} />
    </>
  );
}
