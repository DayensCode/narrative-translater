import { Mic, Square, Volume2 } from "lucide-react";
import styles from "./styles.module.css";

type ControlsProps = {
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

export function Controls({
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
}: ControlsProps) {
  return (
    <footer className={styles.bottomControls} data-tour-id="controls-panel">
      <button
        type="button"
        onClick={onSpeak}
        disabled={!canSpeak}
        className={`${styles.controlBtn} ${styles.secondaryBtn}`}
        aria-label={speakLabel}
        data-tour-id="speak-button"
      >
        <Volume2 size={18} strokeWidth={2.4} />
        <span>{speakLabel}</span>
      </button>

      <button
        type="button"
        onClick={onToggleRecording}
        disabled={!canRecord}
        className={`${styles.controlBtn} ${styles.primaryBtn} ${isRecording ? styles.recording : ""}`}
        aria-label={isRecording ? stopListeningLabel : listenLabel}
        data-tour-id="listen-button"
      >
        {isRecording ? (
          <Square size={16} strokeWidth={2.8} />
        ) : (
          <Mic size={19} strokeWidth={2.5} />
        )}
        <span>{isRecording ? stopListeningLabel : listenLabel}</span>
      </button>

      <button
        type="button"
        onClick={onStopSpeaking}
        disabled={!isSpeaking}
        className={`${styles.controlBtn} ${styles.tertiaryBtn}`}
        aria-label={stopSpeechLabel}
        data-tour-id="stop-speech-button"
      >
        <Square size={16} strokeWidth={2.7} />
        <span>{stopSpeechLabel}</span>
      </button>
    </footer>
  );
}
