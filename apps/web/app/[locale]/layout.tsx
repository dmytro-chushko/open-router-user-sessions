import "@repo/ui/styles.css";
import "../globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import type { ReactNode } from "react";

import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { WebTopBar } from "@/shared/shell/ui/web-top-bar";

const geist = Geist({ subsets: ["latin"] });

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={geist.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="min-h-dvh">
              <header className="sticky top-0 z-50">
                <WebTopBar />
              </header>
              <main className="h-[calc(100dvh-var(--header-mobile-height))] min-h-0 flex-1 overflow-x-clip overflow-y-auto sm:h-[calc(100dvh-var(--header-tablet-height))] md:h-[calc(100dvh-var(--header-height))]">
                <QueryProvider>{children}</QueryProvider>
              </main>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
