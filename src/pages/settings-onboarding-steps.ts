import type { TFunction } from "i18next";
import type { OnboardingStep } from "../components/OnboardingOverlay";

type Options = {
  isInstallAvailable: boolean;
  isInstalled: boolean;
};

export function buildSettingsOnboardingSteps(
  t: TFunction,
  { isInstallAvailable, isInstalled }: Options,
): OnboardingStep[] {
  const steps: OnboardingStep[] = [
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
    {
      selector: '[data-tour-id="settings-local-tts-toggle"]',
      title: t("onboardingSettingsPrivacyTitle", {
        defaultValue: "Privacy & on-device voices",
      }),
      description: t("onboardingSettingsPrivacyDescription", {
        defaultValue:
          "This section keeps the app private. Turn the switch on to use only on-device voices so text never leaves your device for cloud TTS.",
      }),
    },
    {
      selector: '[data-tour-id="settings-wipe-data-button"]',
      title: t("onboardingSettingsWipeDataTitle", {
        defaultValue: "Wipe all local data",
      }),
      description: t("onboardingSettingsWipeDataDescription", {
        defaultValue:
          "Removes preferences, cached models (~1.5 GB) and the service worker — a one-tap way to leave no local trace of the session.",
      }),
    },
  ];

  if (isInstallAvailable || isInstalled) {
    steps.push({
      selector: '[data-tour-id="settings-install-button"]',
      title: t("onboardingSettingsInstallTitle", { defaultValue: "Install the app" }),
      description: t("onboardingSettingsInstallDescription", {
        defaultValue:
          "Install Narrative to your device for faster access and improved offline workflow.",
      }),
    });
  }

  return steps;
}
