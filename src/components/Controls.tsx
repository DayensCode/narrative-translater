import { Mic, Square, Volume2 } from "lucide-react";

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
    <footer className="bottom-controls">
      <button
        type="button"
        onClick={onSpeak}
        disabled={!canSpeak}
        className="control-btn secondary-btn"
        aria-label={speakLabel}
      >
        <Volume2 size={18} strokeWidth={2.4} />
        <span>{speakLabel}</span>
      </button>

      <button
        type="button"
        onClick={onToggleRecording}
        disabled={!canRecord}
        className={`control-btn primary-btn ${isRecording ? "recording" : ""}`}
        aria-label={isRecording ? stopListeningLabel : listenLabel}
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
        className="control-btn tertiary-btn"
        aria-label={stopSpeechLabel}
      >
        <Square size={16} strokeWidth={2.7} />
        <span>{stopSpeechLabel}</span>
      </button>
    </footer>
  );
}
