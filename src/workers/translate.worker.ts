import { env, pipeline } from "@huggingface/transformers";
import type { TranslationRequest, TranslationResponse } from "../types";
import {
  MAX_CHUNK_CHARS,
  TRANSLATION_MAX_NEW_TOKENS,
  TRANSLATION_NUM_BEAMS,
} from "../config";

type TranslatorFn = (
  input: string,
  options?: Record<string, unknown>,
) => Promise<Array<{ translation_text: string }>>;

type TranslationStage = {
  model: string;
  prefix?: string;
};

const translatorPromises = new Map<string, Promise<TranslatorFn>>();

// MarianTokenizer does not ship a fast (Rust-based) tokenizer for browser builds.
// The warning is expected and safe to suppress — the slow JS tokenizer is used instead.
const originalConsoleWarn = console.warn.bind(console);
function filteredWarn(...args: unknown[]) {
  const first = args[0];
  if (
    typeof first === "string" &&
    first.includes("MarianTokenizer") &&
    first.includes("fast")
  ) {
    return;
  }
  originalConsoleWarn(...args);
}

async function getTranslatorForModel(model: string) {
  const existing = translatorPromises.get(model);
  if (existing) {
    return existing;
  }

  const translatorPromise = (async () => {
    console.warn = filteredWarn;

    if (env.backends?.onnx?.wasm) {
      env.backends.onnx.wasm.numThreads = 1;
    }

    try {
      return (await pipeline("translation", model, {
        dtype: "q8",
      })) as unknown as TranslatorFn;
    } catch {
      return (await pipeline("translation", model, {
        dtype: "q4",
      })) as unknown as TranslatorFn;
    }
  })();

  translatorPromises.set(model, translatorPromise);
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

// Direct models for source → English
const TO_EN: Record<string, string> = {
  ru: "Xenova/opus-mt-ru-en",
  es: "Xenova/opus-mt-es-en",
  fr: "Xenova/opus-mt-fr-en",
  zh: "Xenova/opus-mt-zh-en",
  ar: "Xenova/opus-mt-ar-en",
  hi: "Xenova/opus-mt-hi-en",
};

// Direct models for English → target
const FROM_EN: Record<string, TranslationStage> = {
  ru: { model: "Xenova/opus-mt-en-ru" },
  es: { model: "Xenova/opus-mt-en-es" },
  fr: { model: "Xenova/opus-mt-en-fr" },
  hi: { model: "Xenova/opus-mt-en-hi" },
  zh: { model: "Xenova/opus-mt-en-zh", prefix: ">>cmn_Hans<<" },
  ar: { model: "Xenova/opus-mt-en-ar", prefix: ">>ara<<" },
};

// Higher-quality direct routes that skip the English pivot
const DIRECT: Record<string, TranslationStage[]> = {
  "ru:es": [{ model: "Xenova/opus-mt-ru-es" }],
  "ru:fr": [{ model: "Xenova/opus-mt-ru-fr" }],
};

function getTranslationRoute(
  sourceLanguage: string,
  targetLanguage: string,
): TranslationStage[] {
  if (sourceLanguage === targetLanguage) return [];

  const directKey = `${sourceLanguage}:${targetLanguage}`;
  if (DIRECT[directKey]) return DIRECT[directKey];

  // source → en
  if (targetLanguage === "en") {
    const model = TO_EN[sourceLanguage];
    return model ? [{ model }] : [];
  }

  // en → target
  if (sourceLanguage === "en") {
    const stage = FROM_EN[targetLanguage];
    return stage ? [stage] : [];
  }

  // source → en → target (pivot)
  const toEnModel = TO_EN[sourceLanguage];
  const fromEnStage = FROM_EN[targetLanguage];
  if (!toEnModel || !fromEnStage) return [];
  return [{ model: toEnModel }, fromEnStage];
}

async function runStage(text: string, stage: TranslationStage): Promise<string> {
  const translator = await getTranslatorForModel(stage.model);
  const chunks = splitForTranslation(text);
  const translatedParts: string[] = [];

  for (const chunk of chunks) {
    const stagedInput = stage.prefix ? `${stage.prefix} ${chunk}` : chunk;
    const output = await translator(stagedInput, {
      max_new_tokens: TRANSLATION_MAX_NEW_TOKENS,
      num_beams: TRANSLATION_NUM_BEAMS,
    });
    const translatedChunk = output[0]?.translation_text?.trim() ?? "";
    if (translatedChunk) translatedParts.push(translatedChunk);
  }

  return translatedParts.join(" ").trim();
}

self.onmessage = async (event: MessageEvent<TranslationRequest>) => {
  const { id, action } = event.data;

  if (action === "warmup") {
    try {
      await getTranslatorForModel("Xenova/opus-mt-ru-en");
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

  try {
    const route = getTranslationRoute(sourceLanguage, targetLanguage);

    if (sourceLanguage === targetLanguage) {
      self.postMessage({
        id,
        action: "translate",
        translatedText: sourceText,
      } satisfies TranslationResponse);
      return;
    }

    if (route.length === 0) {
      throw new Error(
        `Translation route is not configured for ${sourceLanguage} -> ${targetLanguage}.`,
      );
    }

    let currentText = sourceText;
    for (const stage of route) {
      currentText = await runStage(currentText, stage);
    }

    self.postMessage({
      id,
      action: "translate",
      translatedText: currentText,
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
