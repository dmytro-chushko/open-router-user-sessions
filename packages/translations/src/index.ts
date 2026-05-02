import en from "./locales/en.json" with { type: "json" };
import uk from "./locales/uk.json" with { type: "json" };

export const defaultLocale = "en" as const;

export const locales = ["en", "uk"] as const;

export type Locale = (typeof locales)[number];

export type Messages = typeof en;

const messageCatalog = {
  en,
  uk,
} as const satisfies Record<Locale, Messages>;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMergeRecords(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const next = override[key];
    const prev = base[key];
    if (isPlainRecord(next) && isPlainRecord(prev)) {
      result[key] = deepMergeRecords(prev, next);
    } else if (next !== undefined) {
      result[key] = next;
    }
  }
  return result;
}

export function getMessagesForLocale(locale: Locale): Messages {
  if (locale === defaultLocale) {
    return messageCatalog[defaultLocale];
  }
  return deepMergeRecords(
    messageCatalog[defaultLocale] as unknown as Record<string, unknown>,
    messageCatalog[locale] as unknown as Record<string, unknown>,
  ) as Messages;
}

export { en, uk };
