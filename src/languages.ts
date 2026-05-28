export const UI_LOCALES = ["ru", "en", "zh", "hi", "es", "ar", "fr"] as const;
export type UiLocale = (typeof UI_LOCALES)[number];

const UI_LOCALE_SET = new Set<string>(UI_LOCALES);

export function normalizeUiLocale(locale: string | undefined): UiLocale {
  if (!locale) return "en";
  const short = locale.toLowerCase().split(/[-_]/)[0];
  return (UI_LOCALE_SET.has(short) ? short : "en") as UiLocale;
}
