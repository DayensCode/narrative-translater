import type { ThemeMode } from "../hooks/useTheme";
import type { TranslationLanguageCode } from "../languages";
import type { UiLocale } from "../i18n";

type Option<T extends string> = {
  value: T;
  label: string;
};

type TopBarProps = {
  appName: string;
  eyebrow: string;
  title: string;
  lead: string;
  browserHint: string;
  status: string;
  browserLocaleLabel: string;
  targetLanguageLabel: string;
  themeLabel: string;
  interfaceLanguageLabel: string;
  translationLanguageLabel: string;
  clearLabel: string;
  installLabel: string;
  isInstalled: boolean;
  isInstallAvailable: boolean;
  canClear: boolean;
  selectedUiLanguage: UiLocale;
  selectedTargetLanguage: TranslationLanguageCode;
  theme: ThemeMode;
  uiLanguageOptions: Option<UiLocale>[];
  translationLanguageOptions: Option<TranslationLanguageCode>[];
  themeOptions: Option<ThemeMode>[];
  onUiLanguageChange: (language: UiLocale) => void;
  onTargetLanguageChange: (language: TranslationLanguageCode) => void;
  onThemeChange: (theme: ThemeMode) => void;
  onClear: () => void;
  onInstall: () => void;
};

export function TopBar({
  appName,
  eyebrow,
  title,
  lead,
  browserHint,
  status,
  browserLocaleLabel,
  targetLanguageLabel,
  themeLabel,
  interfaceLanguageLabel,
  translationLanguageLabel,
  clearLabel,
  installLabel,
  isInstalled,
  isInstallAvailable,
  canClear,
  selectedUiLanguage,
  selectedTargetLanguage,
  theme,
  uiLanguageOptions,
  translationLanguageOptions,
  themeOptions,
  onUiLanguageChange,
  onTargetLanguageChange,
  onThemeChange,
  onClear,
  onInstall,
}: TopBarProps) {
  return (
    <header className="hero-card">
      <div className="hero-copy">
        <p className="hero-eyebrow">{eyebrow}</p>
        <div className="brand-lockup">
          <span className="brand-mark">{appName}</span>
          <span className="hero-status">{status}</span>
        </div>
        <h1>{title}</h1>
        <p className="hero-lead">{lead}</p>
        <p className="hero-hint">{browserHint}</p>
      </div>

      <div className="hero-side">
        <div className="signal-list">
          <div className="signal-item">
            <span>{browserLocaleLabel}</span>
            <strong>{uiLanguageOptions.find((option) => option.value === selectedUiLanguage)?.label}</strong>
          </div>
          <div className="signal-item">
            <span>{targetLanguageLabel}</span>
            <strong>
              {
                translationLanguageOptions.find((option) => option.value === selectedTargetLanguage)
                  ?.label
              }
            </strong>
          </div>
          <div className="signal-item">
            <span>{themeLabel}</span>
            <strong>{themeOptions.find((option) => option.value === theme)?.label}</strong>
          </div>
        </div>

        <div className="control-grid">
          <label className="field">
            <span>{interfaceLanguageLabel}</span>
            <select
              value={selectedUiLanguage}
              onChange={(event) => onUiLanguageChange(event.target.value as UiLocale)}
            >
              {uiLanguageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{translationLanguageLabel}</span>
            <select
              value={selectedTargetLanguage}
              onChange={(event) =>
                onTargetLanguageChange(event.target.value as TranslationLanguageCode)
              }
            >
              {translationLanguageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span>{themeLabel}</span>
            <div className="theme-switcher" role="tablist" aria-label={themeLabel}>
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`theme-chip ${theme === option.value ? "active" : ""}`}
                  onClick={() => onThemeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <button type="button" onClick={onClear} className="ghost-btn" disabled={!canClear}>
            {clearLabel}
          </button>
          <button
            type="button"
            onClick={onInstall}
            className="install-btn"
            disabled={!isInstallAvailable || isInstalled}
          >
            {installLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
