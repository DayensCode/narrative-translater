import styles from "../App.module.css";
import { Controls } from "../components/Controls";
import { Panes } from "../components/Panes";
import { TopBar } from "../components/TopBar";
import type { SourceLanguageCode, TranslationLanguageCode } from "../languages";

type Option<T extends string> = { value: T; label: string };

type MainPageProps = {
  appName: string;
  eyebrow: string;
  title: string;
  lead: string;
  browserHint: string;
  status: string;
  sourceLanguageLabel: string;
  selectedSourceLanguage: SourceLanguageCode;
  sourceLanguageOptions: Option<SourceLanguageCode>[];
  onSourceLanguageChange: (language: SourceLanguageCode) => void;
  swapLanguagesLabel: string;
  onSwapLanguages: () => void;
  translationLanguageLabel: string;
  selectedTargetLanguage: TranslationLanguageCode;
  translationLanguageOptions: Option<TranslationLanguageCode>[];
  onTargetLanguageChange: (language: TranslationLanguageCode) => void;
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
  title,
  lead,
  browserHint,
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
  return (
    <main className={styles.appShell}>
      <TopBar
        appName={appName}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        browserHint={browserHint}
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
    </main>
  );
}
