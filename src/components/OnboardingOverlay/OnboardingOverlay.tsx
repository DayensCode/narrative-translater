import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export type OnboardingStep = {
  selector: string;
  title: string;
  description: string;
};

type OnboardingOverlayProps = {
  steps: OnboardingStep[];
  tapHint: string;
  progressLabel: (currentStep: number, totalSteps: number) => string;
  onComplete: () => void;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const HIGHLIGHT_PADDING = 10;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveRect(selector: string): HighlightRect | null {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const top = Math.max(8, rect.top - HIGHLIGHT_PADDING);
  const left = Math.max(8, rect.left - HIGHLIGHT_PADDING);
  const width = Math.max(1, rect.width + HIGHLIGHT_PADDING * 2);
  const height = Math.max(1, rect.height + HIGHLIGHT_PADDING * 2);

  return { top, left, width, height };
}

function getFallbackRect(viewportWidth: number, viewportHeight: number): HighlightRect {
  const width = Math.max(120, Math.min(260, viewportWidth - 32));
  const height = 120;

  return {
    top: Math.max(12, viewportHeight / 2 - height / 2),
    left: Math.max(12, viewportWidth / 2 - width / 2),
    width,
    height,
  };
}

export function OnboardingOverlay({
  steps,
  tapHint,
  progressLabel,
  onComplete,
}: OnboardingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [viewport, setViewport] = useState({
    width: typeof window === "undefined" ? 0 : window.innerWidth,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
  });
  const [currentRect, setCurrentRect] = useState<HighlightRect | null>(null);
  const totalSteps = steps.length;
  const safeStepIndex = Math.min(stepIndex, Math.max(totalSteps - 1, 0));
  const currentStep = totalSteps > 0 ? steps[safeStepIndex] : null;

  useEffect(() => {
    if (!currentStep?.selector) {
      return;
    }

    let rafId = 0;
    const update = () => {
      rafId = 0;
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setCurrentRect(resolveRect(currentStep.selector));
    };
    const schedule = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();

    // Passive scroll listener + rAF throttle: we avoid blocking scroll and
    // collapse multiple events into a single layout read per frame.
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { capture: true, passive: true });

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, { capture: true });
    };
  }, [currentStep?.selector]);

  const highlight = currentRect ?? getFallbackRect(viewport.width, viewport.height);
  const rightGap = Math.max(0, viewport.width - (highlight.left + highlight.width));
  const bottomGap = Math.max(0, viewport.height - (highlight.top + highlight.height));

  const horizontalInset = 12;
  const availableTooltipWidth = Math.max(180, viewport.width - horizontalInset * 2);
  const tooltipWidth = Math.min(360, availableTooltipWidth);
  const estimatedHeight = 170;
  const showBelow = highlight.top + highlight.height + 16 + estimatedHeight < viewport.height - 12;
  const tooltipTop = showBelow
    ? highlight.top + highlight.height + 14
    : Math.max(12, highlight.top - estimatedHeight - 14);
  const tooltipLeft = clamp(
    highlight.left + highlight.width / 2 - tooltipWidth / 2,
    horizontalInset,
    viewport.width - tooltipWidth - horizontalInset,
  );

  const handleAdvance = () => {
    if (stepIndex >= totalSteps - 1) {
      onComplete();
      return;
    }
    setStepIndex((value) => value + 1);
  };

  if (totalSteps === 0) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={currentStep?.title ?? "Onboarding"}
    >
      <div className={styles.scrimTop} style={{ height: `${highlight.top}px` }} />
      <div
        className={styles.scrimLeft}
        style={{
          top: `${highlight.top}px`,
          width: `${highlight.left}px`,
          height: `${highlight.height}px`,
        }}
      />
      <div
        className={styles.scrimRight}
        style={{
          top: `${highlight.top}px`,
          width: `${rightGap}px`,
          height: `${highlight.height}px`,
        }}
      />
      <div className={styles.scrimBottom} style={{ height: `${bottomGap}px` }} />

      <div
        className={styles.highlight}
        style={{
          top: `${highlight.top}px`,
          left: `${highlight.left}px`,
          width: `${highlight.width}px`,
          height: `${highlight.height}px`,
        }}
      />

      <div
        className={styles.tooltip}
        style={{
          width: `${tooltipWidth}px`,
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
        }}
      >
        <p className={styles.progress}>{progressLabel(safeStepIndex + 1, totalSteps)}</p>
        <h3>{currentStep?.title}</h3>
        <p>{currentStep?.description}</p>
        <span className={styles.tapHint}>{tapHint}</span>
      </div>

      <button type="button" className={styles.captureLayer} onClick={handleAdvance} aria-hidden="true" />
    </div>
  );
}
