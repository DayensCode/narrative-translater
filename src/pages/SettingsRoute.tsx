import styles from "../App.module.css";
import { SettingsPage } from "../components/SettingsPage";
import type { ThemeMode } from "../hooks/useTheme";
import type { UiLocale } from "../i18n";

type Option<T extends string> = { value: T; label: string };

type SettingsRouteProps = {
  backLabel: string;
  title: string;
  themeLabel: string;
  theme: ThemeMode;
  themeOptions: Option<ThemeMode>[];
  interfaceLanguageLabel: string;
  selectedUiLanguage: UiLocale;
  uiLanguageOptions: Option<UiLocale>[];
  installLabel: string;
  isInstalled: boolean;
  isInstallAvailable: boolean;
  onThemeChange: (theme: ThemeMode) => void;
  onUiLanguageChange: (language: UiLocale) => void;
  onInstall: () => void;
  onBack: () => void;
  selectedLanguageCodes: string[];
  onAddLanguage: (code: string) => void;
  onRemoveLanguage: (code: string) => void;
};

export default function SettingsRoute(props: SettingsRouteProps) {
  return (
    <main className={styles.appShell}>
      <SettingsPage {...props} />
    </main>
  );
}
