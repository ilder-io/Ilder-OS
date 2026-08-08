"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuarterForm } from "@/features/okrs/components/quarter-form";

export function NewQuarterButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("quarterPlanning");
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {t("newQuarter")}
      </Button>
      <QuarterForm open={open} onOpenChange={setOpen} />
    </>
  );
}
