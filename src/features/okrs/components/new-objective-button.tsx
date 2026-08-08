"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObjectiveForm } from "@/features/okrs/components/objective-form";

export function NewObjectiveButton({
  quarters,
  defaultQuarterId,
}: {
  quarters: { id: string; label: string }[];
  defaultQuarterId: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("okrs");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newObjective")}
      </Button>
      <ObjectiveForm open={open} onOpenChange={setOpen} quarters={quarters} defaultQuarterId={defaultQuarterId} />
    </>
  );
}
