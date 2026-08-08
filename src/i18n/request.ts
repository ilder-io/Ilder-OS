import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

/**
 * No URL-based i18n routing (no `/en/...` / `/es/...` prefix) — the whole
 * `src/app` tree, Clerk's middleware matcher, and every internal `Link`
 * stay untouched. Locale is just a cookie read server-side per request.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE)?.value as Locale | undefined) ?? DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
