export const SOURCE_LANGUAGE_OPTIONS = [
  { code: "ru", labelKey: "languages.ru", speechLocale: "ru-RU" },
  { code: "en", labelKey: "languages.en", speechLocale: "en-US" },
  { code: "es", labelKey: "languages.es", speechLocale: "es-ES" },
  { code: "fr", labelKey: "languages.fr", speechLocale: "fr-FR" },
  { code: "hi", labelKey: "languages.hi", speechLocale: "hi-IN" },
  { code: "zh", labelKey: "languages.zh", speechLocale: "zh-CN" },
  { code: "ar", labelKey: "languages.ar", speechLocale: "ar-SA" },
] as const;

export type SourceLanguageCode = (typeof SOURCE_LANGUAGE_OPTIONS)[number]["code"];

export const TRANSLATION_LANGUAGE_OPTIONS = [
  { code: "ru", labelKey: "languages.ru", speechLocale: "ru-RU" },
  { code: "en", labelKey: "languages.en", speechLocale: "en-US" },
  { code: "es", labelKey: "languages.es", speechLocale: "es-ES" },
  { code: "fr", labelKey: "languages.fr", speechLocale: "fr-FR" },
  { code: "hi", labelKey: "languages.hi", speechLocale: "hi-IN" },
  { code: "zh", labelKey: "languages.zh", speechLocale: "zh-CN" },
  { code: "ar", labelKey: "languages.ar", speechLocale: "ar-SA" },
] as const;

export type TranslationLanguageCode =
  (typeof TRANSLATION_LANGUAGE_OPTIONS)[number]["code"];

export function getSpeechLocale(language: TranslationLanguageCode): string {
  return (
    TRANSLATION_LANGUAGE_OPTIONS.find((option) => option.code === language)?.speechLocale ??
    "en-US"
  );
}

export function getSourceSpeechLocale(language: SourceLanguageCode): string {
  return (
    SOURCE_LANGUAGE_OPTIONS.find((option) => option.code === language)?.speechLocale ?? "ru-RU"
  );
}

export function normalizeUiLocale(locale: string | undefined): string {
  if (!locale) return "en";
  const normalized = locale.toLowerCase();
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("hi")) return "hi";
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("fr")) return "fr";
  if (normalized.startsWith("ru")) return "ru";
  return "en";
}
