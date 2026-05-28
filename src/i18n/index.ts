import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { UI_LOCALES, type UiLocale } from "../languages";

export { UI_LOCALES };
export type { UiLocale };

type LocaleBundle = { translation: Record<string, unknown> };
type LocaleModule = { default: LocaleBundle };

// Each locale lives in its own chunk; we pull it in on demand instead of
// shipping ~50 KB of unused translations in the main bundle.
const loaders: Record<UiLocale, () => Promise<LocaleModule>> = {
  ru: () => import("./locales/ru") as Promise<LocaleModule>,
  en: () => import("./locales/en") as Promise<LocaleModule>,
  zh: () => import("./locales/zh") as Promise<LocaleModule>,
  hi: () => import("./locales/hi") as Promise<LocaleModule>,
  es: () => import("./locales/es") as Promise<LocaleModule>,
  ar: () => import("./locales/ar") as Promise<LocaleModule>,
  fr: () => import("./locales/fr") as Promise<LocaleModule>,
};

const loaded = new Set<UiLocale>();

async function loadLocale(code: UiLocale): Promise<void> {
  if (loaded.has(code)) return;
  const mod = await loaders[code]();
  i18n.addResourceBundle(code, "translation", mod.default.translation, true, true);
  loaded.add(code);
}

function pickUiLocale(raw: string | undefined): UiLocale {
  if (!raw) return "en";
  const short = raw.toLowerCase().split(/[-_]/)[0];
  return (UI_LOCALES as readonly string[]).includes(short)
    ? (short as UiLocale)
    : "en";
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {},
    fallbackLng: "en",
    supportedLngs: UI_LOCALES,
    nonExplicitSupportedLngs: true,
    partialBundledLanguages: true,
    // React already escapes text nodes, but i18next interpolation can flow
    // into <Trans components={…}> where React's protection does not apply.
    // Keep escapeValue on so any future interpolation of user-controlled
    // values is HTML-safe by default.
    interpolation: { escapeValue: true },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

i18n.on("languageChanged", (lng) => {
  const target = pickUiLocale(lng);
  void loadLocale(target);
});

/**
 * Resolves once the locale picked by the detector is available in i18next.
 * Main bootstrap awaits this to avoid a flash of missing keys. A failure to
 * load any locale should not block bootstrap, so we swallow errors and let
 * React render with whatever bundles i18next already has.
 */
export const i18nReady = (async () => {
  try {
    const detected = pickUiLocale(i18n.resolvedLanguage ?? i18n.language);
    await loadLocale(detected);
    if (detected !== "en") {
      await loadLocale("en");
    }
  } catch (err) {
    console.warn("Locale bundle load failed:", err);
  }
})();

export { i18n };
