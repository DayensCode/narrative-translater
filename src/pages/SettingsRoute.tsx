import { useEffect, useState } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import styles from "../App.module.css";
import { OnboardingOverlay, type OnboardingStep } from "../components/OnboardingOverlay";
import { SettingsPage } from "../components/SettingsPage";
import type { ThemeMode } from "../hooks/useTheme";
import type { UiLocale } from "../i18n";

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
};

export default function SettingsRoute(props: SettingsRouteProps) {
  const { t } = useI18nTranslation();
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  useEffect(() => {
    try {
      setIsOnboardingVisible(
        window.localStorage.getItem(SETTINGS_ONBOARDING_STORAGE_KEY) !== "done",
      );
    } catch {
      setIsOnboardingVisible(true);
    }
  }, []);

  const onboardingSteps: OnboardingStep[] = [
    {
      selector: '[data-tour-id="settings-page-title"]',
      title: t("onboardingSettingsPageIntroTitle", { defaultValue: "Settings overview" }),
      description: t("onboardingSettingsPageIntroDescription", {
        defaultValue:
          "This page controls your interface preferences, translation languages, and install options.",
      }),
    },
    {
      selector: '[data-tour-id="settings-back-button"]',
      title: t("onboardingSettingsBackTitle", { defaultValue: "Back to translator" }),
      description: t("onboardingSettingsBackDescription", {
        defaultValue: "Use this button to return to the main translation workspace.",
      }),
    },
    {
      selector: '[data-tour-id="settings-ui-language-field"]',
      title: t("onboardingSettingsUiLanguageTitle", { defaultValue: "Interface language" }),
      description: t("onboardingSettingsUiLanguageDescription", {
        defaultValue: "Change the app language used by menus, labels, and helper text.",
      }),
    },
    {
      selector: '[data-tour-id="settings-theme-field"]',
      title: t("onboardingSettingsThemeTitle", { defaultValue: "Theme selection" }),
      description: t("onboardingSettingsThemeDescription", {
        defaultValue: "Switch between system, light, and dark themes.",
      }),
    },
    {
      selector: '[data-tour-id="settings-translation-languages-field"]',
      title: t("onboardingSettingsLanguagesTitle", { defaultValue: "Translation languages set" }),
      description: t("onboardingSettingsLanguagesDescription", {
        defaultValue:
          "Manage which translation languages are available in the main screen selectors.",
      }),
    },
    {
      selector: '[data-tour-id="settings-language-search"]',
      title: t("onboardingSettingsSearchTitle", { defaultValue: "Search and add languages" }),
      description: t("onboardingSettingsSearchDescription", {
        defaultValue: "Search by language name and add or remove languages from your active list.",
      }),
    },
    ...(props.isInstallAvailable || props.isInstalled
      ? [
          {
            selector: '[data-tour-id="settings-install-button"]',
            title: t("onboardingSettingsInstallTitle", { defaultValue: "Install the app" }),
            description: t("onboardingSettingsInstallDescription", {
              defaultValue:
                "Install Narrative to your device for faster access and improved offline workflow.",
            }),
          },
        ]
      : []),
  ];

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
