import { useCallback, useEffect, useRef, useState } from "react";
import type { TranslationRequest, TranslationResponse } from "../types";
import { TRANSLATION_DEBOUNCE_MS } from "../config";

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [translationError, setTranslationError] = useState("");

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const debounceRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // The speech-recognition worker is on the critical path (user-visible loader).
    // Give it a head start so both heavy models don't compete for bandwidth and
    // CPU during cold start. We use requestIdleCallback when available.
    const idle =
      (window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 1200));
    let cancelled = false;
    let worker: Worker | null = null;

    const startWorker = () => {
      if (cancelled) return;
      worker = new Worker(
        new URL("../workers/translate.worker.ts", import.meta.url),
        { type: "module" },
      );
      attach(worker);
    };

    const handleWorkerError = (event: ErrorEvent | Event) => {
      // Worker crashed before it could postMessage — e.g. private browsing
      // breaks the HF model cache. We log for diagnostics and surface a
      // translation error so the UI can show something.
      console.error("Translate worker failure:", event);
      if (!isMountedRef.current) return;
      const message =
        event instanceof ErrorEvent && event.message
          ? event.message
          : "Не удалось инициализировать перевод.";
      setIsTranslating(false);
      setTranslationError(message);
    };

    const attach = (w: Worker) => {
      w.onmessage = handleMessage;
      w.addEventListener("error", handleWorkerError);
      w.addEventListener("messageerror", handleWorkerError);
      workerRef.current = w;
      w.postMessage({ id: 0, action: "warmup" } satisfies TranslationRequest);
    };

    const handleMessage = (event: MessageEvent<TranslationResponse>) => {
      if (!isMountedRef.current) return;
      const { id, action, translatedText: text, error } = event.data;

      if (action === "warmup") {
        if (error) setTranslationError(error);
        return;
      }

      // Ignore stale responses from prior `translate(...)` calls.
      if (id !== requestIdRef.current) return;

      setIsTranslating(false);
      if (error) {
        setTranslationError(error);
        return;
      }
      setTranslationError("");
      setTranslatedText(text);
    };

    idle(startWorker, { timeout: 2000 });

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (worker) {
        worker.removeEventListener("error", handleWorkerError);
        worker.removeEventListener("messageerror", handleWorkerError);
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };
  }, []);

  const translate = useCallback(
    (text: string, sourceLanguage: string, targetLanguage: string) => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      const normalized = text.trim();
      if (!normalized) {
        // Invalidate any in-flight response so it won't overwrite UI.
        requestIdRef.current += 1;
        setIsTranslating(false);
        setTranslationError("");
        setTranslatedText("");
        return;
      }

      setIsTranslating(true);
      setTranslationError("");

      debounceRef.current = window.setTimeout(() => {
        const worker = workerRef.current;
        if (!worker) return;
        const id = ++requestIdRef.current;
        worker.postMessage({
          id,
          action: "translate",
          text: normalized,
          sourceLanguage,
          targetLanguage,
        } satisfies TranslationRequest);
      }, TRANSLATION_DEBOUNCE_MS);
    },
    [],
  );

  const clearTranslation = useCallback(() => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    // Invalidate in-flight request so a late response doesn't replace "".
    requestIdRef.current += 1;
    setTranslatedText("");
    setTranslationError("");
    setIsTranslating(false);
  }, []);

  return {
    isTranslating,
    translatedText,
    translationError,
    translate,
    clearTranslation,
  };
}
