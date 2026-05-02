import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">{t("notFoundTitle")}</h1>
      <Link
        href="/"
        className="w-fit text-sm font-medium text-primary underline"
      >
        {t("notFoundBack")}
      </Link>
    </div>
  );
}
