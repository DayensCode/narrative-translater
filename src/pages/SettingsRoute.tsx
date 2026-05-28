import { useMemo, useState } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import styles from "../App.module.css";
import { OnboardingOverlay } from "../components/OnboardingOverlay";
import { SettingsPage } from "../components/SettingsPage";
import type { ThemeMode } from "../hooks/useTheme";
import type { UiLocale } from "../i18n";
import { buildSettingsOnboardingSteps } from "./settings-onboarding-steps";

const SETTINGS_ONBOARDING_STORAGE_KEY = "narrative:onboarding:settings:v1";
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
  localTtsOnly: boolean;
  onLocalTtsOnlyChange: (next: boolean) => void;
};

export default function SettingsRoute(props: SettingsRouteProps) {
  const { t } = useI18nTranslation();
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(() => {
    try {
      return (
        window.localStorage.getItem(SETTINGS_ONBOARDING_STORAGE_KEY) !== "done"
      );
    } catch {
      return true;
    }
  });

  const onboardingSteps = useMemo(
    () =>
      buildSettingsOnboardingSteps(t, {
        isInstallAvailable: props.isInstallAvailable,
        isInstalled: props.isInstalled,
      }),
    [t, props.isInstallAvailable, props.isInstalled],
  );

  const handleOnboardingComplete = () => {
    setIsOnboardingVisible(false);
    try {
      window.localStorage.setItem(SETTINGS_ONBOARDING_STORAGE_KEY, "done");
    } catch {
      // Ignore storage write errors and continue normally.
    }
  };

  return (
    <main className={styles.appShell}>
      <SettingsPage {...props} />
      {isOnboardingVisible ? (
        <OnboardingOverlay
          steps={onboardingSteps}
          tapHint={t("onboardingTapHint", { defaultValue: "Tap anywhere to continue" })}
          progressLabel={(currentStep, totalSteps) =>
            t("onboardingProgress", {
              currentStep,
              totalSteps,
              defaultValue: "Step {{currentStep}} of {{totalSteps}}",
            })
          }
          onComplete={handleOnboardingComplete}
        />
      ) : null}
    </main>
  );
}
