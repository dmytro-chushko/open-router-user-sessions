import { Button } from "@repo/ui";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export async function HomeAuthCta() {
  const t = await getTranslations("home");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild variant="default">
        <Link href="/register">{t("signUp")}</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/login">{t("signIn")}</Link>
      </Button>
    </div>
  );
}
