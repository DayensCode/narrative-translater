import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";

type LoaderProps = {
  label: string;
  appName?: string;
  processLabel?: string;
  currentProcess?: string;
  progress?: number;
  rotatingMessages?: string[];
};

export function Loader({
  label,
  appName = "Narrative",
  processLabel = "Current process",
  currentProcess,
  progress = 0,
  rotatingMessages = [],
}: LoaderProps) {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const normalizedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  useEffect(() => {
    if (rotatingMessages.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 3300);

    return () => window.clearInterval(id);
  }, [rotatingMessages]);

  const activeMessage = useMemo(
    () => rotatingMessages[activeMessageIndex] ?? "",
    [activeMessageIndex, rotatingMessages],
  );

  return (
    <main className={styles.loaderShell}>
      <div className={styles.loaderGlow} aria-hidden="true" />
      <section className={styles.loaderCard} role="status" aria-live="polite">
        <p className={styles.loaderBrand}>{appName}</p>
        <h1 className={styles.loaderTitle}>{label}</h1>
        <div className={styles.loaderMeta}>
          <p className={styles.loaderProcessLabel}>{processLabel}</p>
          <p className={styles.loaderPercent}>{normalizedProgress}%</p>
        </div>
        <p className={styles.loaderProcessValue}>{currentProcess ?? label}</p>
        <div className={styles.loaderTrack} aria-hidden="true">
          <span className={styles.loaderBar} style={{ width: `${normalizedProgress}%` }} />
        </div>
        {activeMessage ? <p className={styles.loaderHint}>{activeMessage}</p> : null}
      </section>
    </main>
  );
}
