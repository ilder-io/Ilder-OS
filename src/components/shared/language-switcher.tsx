"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setLocale } from "@/i18n/actions";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(async () => {
      await setLocale(next as Locale);
      router.refresh();
    });
  }

  return (
    <Select value={locale} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
      <SelectContent>
        {LOCALES.map((l) => (
          <SelectItem key={l} value={l}>{LOCALE_LABELS[l]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
