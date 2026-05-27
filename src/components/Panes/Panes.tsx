import styles from "./styles.module.css";

type PanesProps = {
  sourceTitle: string;
  targetTitle: string;
  sourceLanguageLabel: string;
  targetLanguageLabel: string;
  transcript: string;
  onSourceChange: (text: string) => void;
  partialTranscript: string;
  translatedText: string;
  sourcePlaceholder: string;
  targetPlaceholder: string;
  partialLabel: string;
  translationNote: string;
  isTranscribing: boolean;
  isTranslating: boolean;
  transcribingLabel: string;
  translatingLabel: string;
};

export function Panes({
  sourceTitle,
  targetTitle,
  sourceLanguageLabel,
  targetLanguageLabel,
  transcript,
  onSourceChange,
  partialTranscript,
  translatedText,
  sourcePlaceholder,
  targetPlaceholder,
  partialLabel,
  translationNote,
  isTranscribing,
  isTranslating,
  transcribingLabel,
  translatingLabel,
}: PanesProps) {
  return (
    <section className={styles.workspaceGrid}>
      <article className={`${styles.pane} ${styles.paneSource}`} data-tour-id="source-pane">
        <div className={styles.paneHead}>
          <div>
            <p className={styles.paneKicker}>{sourceTitle}</p>
            <h2>{sourceLanguageLabel}</h2>
          </div>
          <span className={styles.panePill}>{partialTranscript ? partialLabel : sourceTitle}</span>
        </div>
        <div className={styles.paneContent}>
          <textarea
            className={styles.sourceInput}
            value={transcript}
            onChange={(e) => onSourceChange(e.target.value)}
            placeholder={sourcePlaceholder}
            rows={1}
            data-tour-id="source-input"
          />
        </div>
        {partialTranscript ? (
          <div className={styles.paneFoot}>
            <span>{partialLabel}</span>
            <p>{partialTranscript}</p>
          </div>
        ) : null}
        {isTranscribing ? (
          <div className={styles.paneOverlay} role="status" aria-live="polite">
            <span className={styles.paneSpinner} aria-hidden="true" />
            <p className={styles.paneOverlayLabel}>{transcribingLabel}</p>
          </div>
        ) : null}
      </article>

      <article className={`${styles.pane} ${styles.paneTarget}`} data-tour-id="target-pane">
        <div className={styles.paneHead}>
          <div>
            <p className={styles.paneKicker}>{targetTitle}</p>
            <h2>{targetLanguageLabel}</h2>
          </div>
          <span className={styles.panePill}>{targetLanguageLabel}</span>
        </div>
        <div className={styles.paneContent}>
          <p>{translatedText || targetPlaceholder}</p>
        </div>
        <div className={styles.paneNote} data-tour-id="translation-note">
          {translationNote}
        </div>
        {isTranslating ? (
          <div className={styles.paneOverlay} role="status" aria-live="polite">
            <span className={styles.paneSpinner} aria-hidden="true" />
            <p className={styles.paneOverlayLabel}>{translatingLabel}</p>
          </div>
        ) : null}
      </article>
    </section>
  );
}
