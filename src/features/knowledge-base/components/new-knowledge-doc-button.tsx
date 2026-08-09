"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeDocForm } from "@/features/knowledge-base/components/knowledge-doc-form";

export function NewKnowledgeDocButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("knowledgeBase");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newDoc")}
      </Button>
      <KnowledgeDocForm open={open} onOpenChange={setOpen} />
    </>
  );
}
