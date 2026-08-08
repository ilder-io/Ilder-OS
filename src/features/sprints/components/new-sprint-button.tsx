"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SprintForm } from "@/features/sprints/components/sprint-form";

export function NewSprintButton({ quarters }: { quarters: { id: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("sprints");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newSprint")}
      </Button>
      <SprintForm open={open} onOpenChange={setOpen} quarters={quarters} />
    </>
  );
}
