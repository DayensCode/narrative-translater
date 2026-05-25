import { useEffect, useState } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import styles from "../App.module.css";
import { Controls } from "../components/Controls";
import { OnboardingOverlay, type OnboardingStep } from "../components/OnboardingOverlay";
import { Panes } from "../components/Panes";
import { TopBar } from "../components/TopBar";

const ONBOARDING_STORAGE_KEY = "narrative:onboarding:v1";
type Option = { value: string; label: string };

type MainPageProps = {
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
  sourceTitle: string;
  targetTitle: string;
  sourceLanguageCurrentLabel: string;
  targetLanguageCurrentLabel: string;
  transcript: string;
  onSourceChange: (text: string) => void;
  partialTranscript: string;
  translatedText: string;
  sourcePlaceholder: string;
  targetPlaceholder: string;
  partialLabel: string;
  translationNote: string;
  error: string | null;
  translationError: string | null;
  isRecording: boolean;
  isSpeaking: boolean;
  canRecord: boolean;
  canSpeak: boolean;
  listenLabel: string;
  stopListeningLabel: string;
  speakLabel: string;
  stopSpeechLabel: string;
  onToggleRecording: () => void;
  onSpeak: () => void;
  onStopSpeaking: () => void;
};

export default function MainPage({
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
  sourceTitle,
  targetTitle,
  sourceLanguageCurrentLabel,
  targetLanguageCurrentLabel,
  transcript,
  onSourceChange,
  partialTranscript,
  translatedText,
  sourcePlaceholder,
  targetPlaceholder,
  partialLabel,
  translationNote,
  error,
  translationError,
  isRecording,
  isSpeaking,
  canRecord,
  canSpeak,
  listenLabel,
  stopListeningLabel,
  speakLabel,
  stopSpeechLabel,
  onToggleRecording,
  onSpeak,
  onStopSpeaking,
}: MainPageProps) {
  const { t } = useI18nTranslation();
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  useEffect(() => {
    try {
      setIsOnboardingVisible(window.localStorage.getItem(ONBOARDING_STORAGE_KEY) !== "done");
    } catch {
      setIsOnboardingVisible(true);
    }
  }, []);

  const onboardingSteps: OnboardingStep[] = [
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
        defaultValue: "Watch this indicator to see whether the app is listening, translating, or ready.",
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

  const handleOnboardingComplete = () => {
    setIsOnboardingVisible(false);
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "done");
    } catch {
      // Ignore storage write errors and continue normally.
    }
  };

  return (
    <main className={styles.appShell}>
      <TopBar
        appName={appName}
        eyebrow={eyebrow}
        status={status}
        sourceLanguageLabel={sourceLanguageLabel}
        selectedSourceLanguage={selectedSourceLanguage}
        sourceLanguageOptions={sourceLanguageOptions}
        onSourceLanguageChange={onSourceLanguageChange}
        swapLanguagesLabel={swapLanguagesLabel}
        onSwapLanguages={onSwapLanguages}
        translationLanguageLabel={translationLanguageLabel}
        selectedTargetLanguage={selectedTargetLanguage}
        translationLanguageOptions={translationLanguageOptions}
        onTargetLanguageChange={onTargetLanguageChange}
        clearLabel={clearLabel}
        canClear={canClear}
        onClear={onClear}
        settingsLabel={settingsLabel}
        onOpenSettings={onOpenSettings}
      />
      <Panes
        sourceTitle={sourceTitle}
        targetTitle={targetTitle}
        sourceLanguageLabel={sourceLanguageCurrentLabel}
        targetLanguageLabel={targetLanguageCurrentLabel}
        transcript={transcript}
        onSourceChange={onSourceChange}
        partialTranscript={partialTranscript}
        translatedText={translatedText}
        sourcePlaceholder={sourcePlaceholder}
        targetPlaceholder={targetPlaceholder}
        partialLabel={partialLabel}
        translationNote={translationNote}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
      {translationError ? <p className={styles.error}>{translationError}</p> : null}
      <Controls
        isRecording={isRecording}
        isSpeaking={isSpeaking}
        canRecord={canRecord}
        canSpeak={canSpeak}
        listenLabel={listenLabel}
        stopListeningLabel={stopListeningLabel}
        speakLabel={speakLabel}
        stopSpeechLabel={stopSpeechLabel}
        onToggleRecording={onToggleRecording}
        onSpeak={onSpeak}
        onStopSpeaking={onStopSpeaking}
      />
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
