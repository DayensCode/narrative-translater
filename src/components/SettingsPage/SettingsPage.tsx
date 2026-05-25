import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import type { ThemeMode } from "../../hooks/useTheme";
import type { UiLocale } from "../../i18n";
import { getLocalizedLanguageName, NLLB_LANGUAGES } from "../../nllb-languages";
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
}: SettingsPageProps) {
  const [query, setQuery] = useState("");

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
      </div>
    </div>
  );
}
