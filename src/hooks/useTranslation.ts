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

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/translate.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (event: MessageEvent<TranslationResponse>) => {
      const { id, action, translatedText: text, error } = event.data;

      if (action === "warmup") {
        if (error) setTranslationError(error);
        return;
      }

      if (id !== requestIdRef.current) return;

      setIsTranslating(false);
      if (error) {
        setTranslationError(error);
        return;
      }
      setTranslationError("");
      setTranslatedText(text);
    };

    workerRef.current = worker;
    worker.postMessage({ id: 0, action: "warmup" } satisfies TranslationRequest);

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, []);

  const translate = useCallback(
    (text: string, sourceLanguage: string, targetLanguage: string) => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!text.trim()) {
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
        text,
        sourceLanguage,
        targetLanguage,
      } satisfies TranslationRequest);
    }, TRANSLATION_DEBOUNCE_MS);
    },
    [],
  );

  const clearTranslation = useCallback(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setTranslatedText("");
    setTranslationError("");
    setIsTranslating(false);
  }, []);

  return { isTranslating, translatedText, translationError, translate, clearTranslation };
}
