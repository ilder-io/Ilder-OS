"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/i18n/config";

export async function setLocale(locale: Locale) {
  if (!LOCALES.includes(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
}
