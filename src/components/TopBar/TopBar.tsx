import { ArrowLeftRight, Settings } from "lucide-react";
import styles from "./styles.module.css";

type Option = { value: string; label: string };

type TopBarProps = {
  appName: string;
  eyebrow: string;
  status: string;
  sourceLanguageLabel: string;
  selectedSourceLanguage: string;
  sourceLanguageOptions: Option[];
  onSourceLanguageChange: (language: string) => void;
  swapLanguagesLabel: string;
  onSwapLanguages: () => void;
  translationLanguageLabel: string;
  selectedTargetLanguage: string;
  translationLanguageOptions: Option[];
  onTargetLanguageChange: (language: string) => void;
  clearLabel: string;
  canClear: boolean;
  onClear: () => void;
  settingsLabel: string;
  onOpenSettings: () => void;
};

export function TopBar({
  appName,
  eyebrow,
  status,
  sourceLanguageLabel,
  selectedSourceLanguage,
  sourceLanguageOptions,
  onSourceLanguageChange,
  swapLanguagesLabel,
  onSwapLanguages,
  translationLanguageLabel,
  selectedTargetLanguage,
  translationLanguageOptions,
  onTargetLanguageChange,
  clearLabel,
  canClear,
  onClear,
  settingsLabel,
  onOpenSettings,
}: TopBarProps) {
  return (
    <header className={styles.heroCard}>
      <div className={styles.heroCopy}>
        <p className={styles.heroEyebrow}>{eyebrow}</p>
        <div className={styles.brandLockup}>
          <span className={styles.brandMark}>{appName}</span>
          <span className={styles.heroStatus}>{status}</span>
        </div>
      </div>

      <div className={styles.heroSide}>
        <div className={styles.langPair}>
          <label className={styles.field}>
            <span>{sourceLanguageLabel}</span>
            <select
              value={selectedSourceLanguage}
              onChange={(e) => onSourceLanguageChange(e.target.value)}
            >
              {sourceLanguageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={styles.swapBtn}
            aria-label={swapLanguagesLabel}
            title={swapLanguagesLabel}
            onClick={onSwapLanguages}
          >
            <ArrowLeftRight size={16} />
          </button>

          <label className={styles.field}>
            <span>{translationLanguageLabel}</span>
            <select
              value={selectedTargetLanguage}
              onChange={(e) => onTargetLanguageChange(e.target.value)}
            >
              {translationLanguageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.heroActions}>
          <button
            type="button"
            onClick={onClear}
            className={styles.ghostBtn}
            disabled={!canClear}
          >
            {clearLabel}
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className={`${styles.ghostBtn} ${styles.settingsBtn}`}
          >
            <Settings size={16} />
            {settingsLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
