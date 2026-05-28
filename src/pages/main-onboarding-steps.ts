import type { TFunction } from "i18next";
import type { OnboardingStep } from "../components/OnboardingOverlay";

export function buildMainOnboardingSteps(t: TFunction): OnboardingStep[] {
  return [
    {
      selector: '[data-tour-id="app-brand"]',
      title: t("onboardingIntroTitle", { defaultValue: "Narrative in one minute" }),
      description: t("onboardingIntroDescription", {
        defaultValue:
          "This app recognizes speech locally, translates it, and lets you voice the result right in the browser.",
      }),
    },
    {
      selector: '[data-tour-id="app-status"]',
      title: t("onboardingStatusTitle", { defaultValue: "Live status" }),
      description: t("onboardingStatusDescription", {
        defaultValue:
          "Watch this indicator to see whether the app is listening, translating, or ready.",
      }),
    },
    {
      selector: '[data-tour-id="source-language-field"]',
      title: t("onboardingSourceLanguageTitle", { defaultValue: "Choose source language" }),
      description: t("onboardingSourceLanguageDescription", {
        defaultValue: "Set the language of the original speech before recording.",
      }),
    },
    {
      selector: '[data-tour-id="target-language-field"]',
      title: t("onboardingTargetLanguageTitle", { defaultValue: "Choose target language" }),
      description: t("onboardingTargetLanguageDescription", {
        defaultValue: "Select the language you want to translate into.",
      }),
    },
    {
      selector: '[data-tour-id="swap-languages-button"]',
      title: t("onboardingSwapTitle", { defaultValue: "Swap languages" }),
      description: t("onboardingSwapDescription", {
        defaultValue: "One tap swaps source and target languages.",
      }),
    },
    {
      selector: '[data-tour-id="source-pane"]',
      title: t("onboardingSourcePaneTitle", { defaultValue: "Source workspace" }),
      description: t("onboardingSourcePaneDescription", {
        defaultValue:
          "The left panel is your editable source workspace for live recognition and manual input.",
      }),
    },
    {
      selector: '[data-tour-id="source-input"]',
      title: t("onboardingSourceInputTitle", { defaultValue: "Source text area" }),
      description: t("onboardingSourceInputDescription", {
        defaultValue: "Recognized speech appears here and can be edited manually.",
      }),
    },
    {
      selector: '[data-tour-id="listen-button"]',
      title: t("onboardingListenButtonTitle", { defaultValue: "Start or stop recording" }),
      description: t("onboardingListenButtonDescription", {
        defaultValue: "Use this button to capture speech from the microphone.",
      }),
    },
    {
      selector: '[data-tour-id="target-pane"]',
      title: t("onboardingTargetPaneTitle", { defaultValue: "Translation result" }),
      description: t("onboardingTargetPaneDescription", {
        defaultValue: "The translated text is shown here after a short pause.",
      }),
    },
    {
      selector: '[data-tour-id="translation-note"]',
      title: t("onboardingTranslationNoteTitle", { defaultValue: "Current recognition limits" }),
      description: t("onboardingTranslationNoteDescription", {
        defaultValue:
          "This note explains current speech-recognition constraints so you know what to expect.",
      }),
    },
    {
      selector: '[data-tour-id="speak-button"]',
      title: t("onboardingSpeakButtonTitle", { defaultValue: "Play translated voice" }),
      description: t("onboardingSpeakButtonDescription", {
        defaultValue: "Use this button to hear source or translated text as speech.",
      }),
    },
    {
      selector: '[data-tour-id="stop-speech-button"]',
      title: t("onboardingStopSpeechTitle", { defaultValue: "Stop voice playback" }),
      description: t("onboardingStopSpeechDescription", {
        defaultValue: "If voice playback is running, stop it instantly with this button.",
      }),
    },
    {
      selector: '[data-tour-id="clear-button"]',
      title: t("onboardingClearTitle", { defaultValue: "Reset current session" }),
      description: t("onboardingClearDescription", {
        defaultValue: "Clear source and translation text to start a fresh translation flow.",
      }),
    },
    {
      selector: '[data-tour-id="settings-button"]',
      title: t("onboardingSettingsTitle", { defaultValue: "Open settings" }),
      description: t("onboardingSettingsDescription", {
        defaultValue: "Here you can change theme, interface language, and install the app.",
      }),
    },
  ];
}
