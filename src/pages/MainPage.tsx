import styles from "../App.module.css";
import { Controls } from "../components/Controls";
import { Panes } from "../components/Panes";
import { TopBar } from "../components/TopBar";
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
    </main>
  );
}
