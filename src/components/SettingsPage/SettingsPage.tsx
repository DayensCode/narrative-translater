import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import type { ThemeMode } from "../../hooks/useTheme";
import type { UiLocale } from "../../i18n";
import { getLocalizedLanguageName, NLLB_LANGUAGES } from "../../nllb-languages";
import { wipeLocalData } from "../../utils/wipe-data";
import styles from "./styles.module.css";

type Option<T extends string> = { value: T; label: string };

type SettingsPageProps = {
  backLabel: string;
  title: string;
  themeLabel: string;
  theme: ThemeMode;
  themeOptions: Option<ThemeMode>[];
  onThemeChange: (theme: ThemeMode) => void;
  interfaceLanguageLabel: string;
  selectedUiLanguage: UiLocale;
  uiLanguageOptions: Option<UiLocale>[];
  onUiLanguageChange: (language: UiLocale) => void;
  installLabel: string;
  isInstalled: boolean;
  isInstallAvailable: boolean;
  onInstall: () => void;
  onBack: () => void;
  selectedLanguageCodes: string[];
  onAddLanguage: (code: string) => void;
  onRemoveLanguage: (code: string) => void;
  localTtsOnly: boolean;
  onLocalTtsOnlyChange: (next: boolean) => void;
};

export function SettingsPage({
  backLabel,
  title,
  themeLabel,
  theme,
  themeOptions,
  onThemeChange,
  interfaceLanguageLabel,
  selectedUiLanguage,
  uiLanguageOptions,
  onUiLanguageChange,
  installLabel,
  isInstalled,
  isInstallAvailable,
  onInstall,
  onBack,
  selectedLanguageCodes,
  onAddLanguage,
  onRemoveLanguage,
  localTtsOnly,
  onLocalTtsOnlyChange,
}: SettingsPageProps) {
  const { t } = useI18nTranslation();
  const [query, setQuery] = useState("");
  const [isWiping, setIsWiping] = useState(false);

  const handleWipe = async () => {
    const confirmed = window.confirm(
      t("wipeDataConfirm", {
        defaultValue:
          "This will remove all saved data: preferences, cached models (~1.5 GB), and service worker. Continue?",
      }),
    );
    if (!confirmed) return;
    setIsWiping(true);
    await wipeLocalData();
    // Hard reload so React re-mounts against a clean storage surface.
    window.location.reload();
  };

  const q = query.trim().toLowerCase();
  const filteredLanguages = q.length > 0
    ? NLLB_LANGUAGES.filter((l) => {
        const localized = getLocalizedLanguageName(l.code, selectedUiLanguage).toLowerCase();
        return localized.includes(q) || l.name.toLowerCase().includes(q);
      }).slice(0, 8)
    : [];

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <button
          type="button"
          className={`${styles.ghostBtn} ${styles.settingsBackBtn}`}
          onClick={onBack}
          data-tour-id="settings-back-button"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>
        <h1 className={styles.settingsTitle} data-tour-id="settings-page-title">
          {title}
        </h1>
      </div>

      <div className={styles.settingsBody}>
        <div className={styles.field} data-tour-id="settings-ui-language-field">
          <span>{interfaceLanguageLabel}</span>
          <select
            value={selectedUiLanguage}
            onChange={(e) => onUiLanguageChange(e.target.value as UiLocale)}
          >
            {uiLanguageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field} data-tour-id="settings-theme-field">
          <span>{themeLabel}</span>
          <div className={styles.themeSwitcher} role="tablist" aria-label={themeLabel}>
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.themeChip} ${theme === opt.value ? styles.active : ""}`}
                onClick={() => onThemeChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field} data-tour-id="settings-translation-languages-field">
          <span>Translation languages</span>

          <div className={styles.selectedLanguages}>
            {selectedLanguageCodes.map((code) => {
              const label = getLocalizedLanguageName(code, selectedUiLanguage);
              return (
                <div key={code} className={styles.languageChip}>
                  <span>{label}</span>
                  <button
                    type="button"
                    className={styles.chipRemoveBtn}
                    onClick={() => onRemoveLanguage(code)}
                    disabled={selectedLanguageCodes.length <= 1}
                    aria-label={`Remove ${label}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          <input
            type="search"
            className={styles.langSearch}
            placeholder="Search languages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-tour-id="settings-language-search"
          />

          {filteredLanguages.length > 0 && (
            <div className={styles.searchResults}>
              {filteredLanguages.map((lang) => {
                const isAdded = selectedLanguageCodes.includes(lang.code);
                const label = getLocalizedLanguageName(lang.code, selectedUiLanguage);
                return (
                  <div key={lang.code} className={styles.searchResultItem}>
                    <span className={styles.searchResultName}>{label}</span>
                    <button
                      type="button"
                      className={`${styles.addLangBtn} ${isAdded ? styles.added : ""}`}
                      onClick={() => {
                        if (isAdded) {
                          onRemoveLanguage(lang.code);
                        } else {
                          onAddLanguage(lang.code);
                          setQuery("");
                        }
                      }}
                      disabled={isAdded && selectedLanguageCodes.length <= 1}
                      aria-label={isAdded ? `Remove ${label}` : `Add ${label}`}
                    >
                      {isAdded ? <X size={13} /> : <Plus size={13} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(isInstallAvailable || isInstalled) && (
          <div className={styles.field}>
            <button
              type="button"
              className={styles.installBtn}
              disabled={!isInstallAvailable || isInstalled}
              onClick={onInstall}
              data-tour-id="settings-install-button"
            >
              {installLabel}
            </button>
          </div>
        )}

        <div className={styles.field} data-tour-id="settings-privacy-field">
          <span>{t("privacy", { defaultValue: "Privacy" })}</span>

          <div className={styles.fieldRow} data-tour-id="settings-local-tts-toggle">
            <div>
              <div>
                {t("localTtsOnly", {
                  defaultValue: "Use on-device voices only",
                })}
              </div>
              <div className={styles.fieldDescription}>
                {t("localTtsOnlyDescription", {
                  defaultValue:
                    "Some browser voices send text to a cloud TTS. When on, Narrative picks only voices marked as local.",
                })}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={localTtsOnly}
              className={`${styles.toggle} ${localTtsOnly ? styles.active : ""}`}
              onClick={() => onLocalTtsOnlyChange(!localTtsOnly)}
            />
          </div>

          <div className={styles.fieldDescription}>
            {t("wipeDataDescription", {
              defaultValue:
                "Removes saved preferences, cached models, and service worker state. The app reloads afterwards.",
            })}
          </div>
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={handleWipe}
            disabled={isWiping}
            data-tour-id="settings-wipe-data-button"
          >
            {t("wipeData", { defaultValue: "Wipe all data" })}
          </button>
        </div>
      </div>
    </div>
  );
}
