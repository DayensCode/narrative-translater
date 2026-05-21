import styles from "./styles.module.css";

type PanesProps = {
  sourceTitle: string;
  targetTitle: string;
  sourceLanguageLabel: string;
  targetLanguageLabel: string;
  transcript: string;
  partialTranscript: string;
  translatedText: string;
  sourcePlaceholder: string;
  targetPlaceholder: string;
  partialLabel: string;
  translationNote: string;
};

export function Panes({
  sourceTitle,
  targetTitle,
  sourceLanguageLabel,
  targetLanguageLabel,
  transcript,
  partialTranscript,
  translatedText,
  sourcePlaceholder,
  targetPlaceholder,
  partialLabel,
  translationNote,
}: PanesProps) {
  return (
    <section className={styles.workspaceGrid}>
      <article className={`${styles.pane} ${styles.paneSource}`}>
        <div className={styles.paneHead}>
          <div>
            <p className={styles.paneKicker}>{sourceTitle}</p>
            <h2>{sourceLanguageLabel}</h2>
          </div>
          <span className={styles.panePill}>{partialTranscript ? partialLabel : sourceTitle}</span>
        </div>
        <div className={styles.paneContent}>
          <p>{transcript || sourcePlaceholder}</p>
        </div>
        {partialTranscript ? (
          <div className={styles.paneFoot}>
            <span>{partialLabel}</span>
            <p>{partialTranscript}</p>
          </div>
        ) : null}
      </article>

      <article className={`${styles.pane} ${styles.paneTarget}`}>
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
        <div className={styles.paneNote}>{translationNote}</div>
      </article>
    </section>
  );
}
