import { ArrowLeft } from "lucide-react";
import type { ThemeMode } from "../../hooks/useTheme";
import type { UiLocale } from "../../i18n";
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
}: SettingsPageProps) {
  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <button
          type="button"
          className={`${styles.ghostBtn} ${styles.settingsBackBtn}`}
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>
        <h1 className={styles.settingsTitle}>{title}</h1>
      </div>

      <div className={styles.settingsBody}>
        <div className={styles.field}>
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

        <div className={styles.field}>
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

        {(isInstallAvailable || isInstalled) && (
          <div className={styles.field}>
            <button
              type="button"
              className={styles.installBtn}
              disabled={!isInstallAvailable || isInstalled}
              onClick={onInstall}
            >
              {installLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
