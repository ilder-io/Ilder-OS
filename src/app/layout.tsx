import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_TAGLINE,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7C7DF5",
          colorBackground: "#131316",
          colorText: "#F3F3F6",
          colorTextSecondary: "#9A9AA6",
          borderRadius: "0.625rem",
        },
      }}
    >
      <html lang={locale} className="dark" suppressHydrationWarning>
        <body className="font-sans">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <TooltipProvider delayDuration={200}>
              {children}
            </TooltipProvider>
            <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#1B1B1F", border: "1px solid #232329", color: "#F3F3F6" } }} />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
