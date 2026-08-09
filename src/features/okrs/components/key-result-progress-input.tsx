"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function KeyResultProgressInput({
  keyResultId,
  currentValue,
}: {
  keyResultId: string;
  currentValue: number;
}) {
  const t = useTranslations("okrs");
  const router = useRouter();
  const [value, setValue] = useState(String(currentValue));
  const [saving, setSaving] = useState(false);

  async function commit() {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed === currentValue) {
      setValue(String(currentValue));
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/key-results/${keyResultId}`, {
      method: "PATCH",
      body: JSON.stringify({ currentValue: parsed }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(t("form.toastError"));
      setValue(String(currentValue));
      return;
    }
    router.refresh();
  }

  return (
    <input
      type="number"
      aria-label={t("krCurrentValueLabel")}
      className="w-14 shrink-0 bg-transparent text-2xs font-mono text-muted-foreground text-right border-b border-dashed border-muted-foreground/40 focus:outline-none focus:border-primary disabled:opacity-60"
      value={value}
      disabled={saving}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}
