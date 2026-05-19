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
    <section className="workspace-grid">
      <article className="pane pane-source">
        <div className="pane-head">
          <div>
            <p className="pane-kicker">{sourceTitle}</p>
            <h2>{sourceLanguageLabel}</h2>
          </div>
          <span className="pane-pill">{partialTranscript ? partialLabel : sourceTitle}</span>
        </div>
        <div className="pane-content">
          <p>{transcript || sourcePlaceholder}</p>
        </div>
        {partialTranscript ? (
          <div className="pane-foot">
            <span>{partialLabel}</span>
            <p>{partialTranscript}</p>
          </div>
        ) : null}
      </article>

      <article className="pane pane-target">
        <div className="pane-head">
          <div>
            <p className="pane-kicker">{targetTitle}</p>
            <h2>{targetLanguageLabel}</h2>
          </div>
          <span className="pane-pill">{targetLanguageLabel}</span>
        </div>
        <div className="pane-content">
          <p>{translatedText || targetPlaceholder}</p>
        </div>
        <div className="pane-note">{translationNote}</div>
      </article>
    </section>
  );
}
