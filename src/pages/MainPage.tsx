import { useMemo, useState } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import styles from "../App.module.css";
import { Controls } from "../components/Controls";
import { OnboardingOverlay } from "../components/OnboardingOverlay";
import { Panes } from "../components/Panes";
import { TopBar } from "../components/TopBar";
import { buildMainOnboardingSteps } from "./main-onboarding-steps";

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
  isTranscribing: boolean;
  isTranslating: boolean;
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
  isTranscribing,
  isTranslating,
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
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(() => {
    try {
      return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) !== "done";
    } catch {
      return true;
    }
  });

  const onboardingSteps = useMemo(() => buildMainOnboardingSteps(t), [t]);

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
        isTranscribing={isTranscribing}
        isTranslating={isTranslating}
        transcribingLabel={t("statusTranscribing")}
        translatingLabel={t("statusTranslating")}
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
