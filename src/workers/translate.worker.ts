import type { TranslationRequest, TranslationResponse } from "../types";
import {
  MAX_CHUNK_CHARS,
  TRANSLATION_MAX_NEW_TOKENS,
  TRANSLATION_NUM_BEAMS,
} from "../config";
import { createHfPipeline } from "./_hf";

const NLLB_MODEL = "Xenova/nllb-200-distilled-600M";

type TranslatorCallOptions = {
  src_lang: string;
  tgt_lang: string;
  max_new_tokens?: number;
  num_beams?: number;
};

type TranslatorFn = (
  input: string | string[],
  options: TranslatorCallOptions,
) => Promise<Array<{ translation_text: string }>>;

let translatorPromise: Promise<TranslatorFn> | null = null;

async function getTranslator(): Promise<TranslatorFn> {
  if (translatorPromise) return translatorPromise;
  translatorPromise = createHfPipeline("translation", NLLB_MODEL) as Promise<TranslatorFn>;
  return translatorPromise;
}

function splitForTranslation(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const sentences =
    normalized.match(/[^.!?]+[.!?]?/g)?.map((part) => part.trim()) ?? [normalized];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (!sentence) continue;

    if (!current) {
      current = sentence;
      continue;
    }

    if (current.length + 1 + sentence.length <= MAX_CHUNK_CHARS) {
      current = `${current} ${sentence}`;
      continue;
    }

    chunks.push(current);
    current = sentence;
  }

  if (current) chunks.push(current);
  return chunks;
}

async function translateText(
  text: string,
  srcLang: string,
  tgtLang: string,
): Promise<string> {
  const translator = await getTranslator();
  const chunks = splitForTranslation(text);
  if (chunks.length === 0) return "";

  // Single batched inference for all chunks — lets ONNX reuse compute and
  // avoids the sequential per-chunk await penalty.
  const output = await translator(chunks, {
    src_lang: srcLang,
    tgt_lang: tgtLang,
    max_new_tokens: TRANSLATION_MAX_NEW_TOKENS,
    num_beams: TRANSLATION_NUM_BEAMS,
  });

  return output
    .map((r) => r.translation_text?.trim() ?? "")
    .filter(Boolean)
    .join(" ")
    .trim();
}

self.onmessage = async (event: MessageEvent<TranslationRequest>) => {
  const { id, action } = event.data;

  if (action === "warmup") {
    try {
      await getTranslator();
      self.postMessage({
        id,
        action: "warmup",
        translatedText: "",
      } satisfies TranslationResponse);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось прогреть модель перевода.";
      self.postMessage({
        id,
        action: "warmup",
        translatedText: "",
        error: message,
      } satisfies TranslationResponse);
    }
    return;
  }

  const { text, sourceLanguage, targetLanguage } = event.data;
  const sourceText = text.trim();

  if (!sourceText) {
    self.postMessage({
      id,
      action: "translate",
      translatedText: "",
    } satisfies TranslationResponse);
    return;
  }

  if (sourceLanguage === targetLanguage) {
    self.postMessage({
      id,
      action: "translate",
      translatedText: sourceText,
    } satisfies TranslationResponse);
    return;
  }

  try {
    const result = await translateText(sourceText, sourceLanguage, targetLanguage);
    self.postMessage({
      id,
      action: "translate",
      translatedText: result,
    } satisfies TranslationResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось перевести текст в Web Worker.";
    self.postMessage({
      id,
      action: "translate",
      translatedText: "",
      error: message,
    } satisfies TranslationResponse);
  }
};
