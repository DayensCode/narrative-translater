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

async function getTranslator() {
  throw new Error("Model name is required.");
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
      env.backends.onnx.wasm.simd = true;
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

function getTranslationRoute(
  sourceLanguage: string,
  targetLanguage: string,
): TranslationStage[] {
  if (sourceLanguage === targetLanguage) {
    return [];
  }

  const routes: Record<string, TranslationStage[]> = {
    "ru:en": [{ model: "Helsinki-NLP/opus-mt-ru-en" }],
    "ru:es": [{ model: "Helsinki-NLP/opus-mt-ru-es" }],
    "ru:fr": [{ model: "Helsinki-NLP/opus-mt-ru-fr" }],
    "ru:hi": [
      { model: "Helsinki-NLP/opus-mt-ru-en" },
      { model: "Helsinki-NLP/opus-mt-en-hi" },
    ],
    "ru:zh": [
      { model: "Helsinki-NLP/opus-mt-ru-en" },
      { model: "Helsinki-NLP/opus-mt-en-zh", prefix: ">>cmn_Hans<<" },
    ],
    "ru:ar": [
      { model: "Helsinki-NLP/opus-mt-ru-en" },
      { model: "Helsinki-NLP/opus-mt-en-ar", prefix: ">>ara<<" },
    ],
  };

  return routes[`${sourceLanguage}:${targetLanguage}`] ?? [];
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
      await getTranslatorForModel("Helsinki-NLP/opus-mt-ru-en");
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
