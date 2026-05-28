# Типы

Общие типы собраны в `src/types/index.ts`. Они описывают контракт между
UI-потоком и воркерами.

## Whisper worker

```ts
type WhisperRequest =
  | { type: "warmup" }
  | {
      type: "transcribe";
      audio: Float32Array;
      language: string | undefined;
      sampleRate: number;
    };

type WhisperLoadingStatus = "initiate" | "download" | "progress" | "done" | "ready";

type WhisperResponse =
  | { type: "ready" }
  | {
      type: "loading-progress";
      progress: number;
      stage: string;
      status: WhisperLoadingStatus;
      file?: string;
    }
  | { type: "result"; text: string }
  | { type: "error"; message: string };
```

- `warmup` прогревает пайплайн без распознавания.
- `transcribe` передаёт уже 16 kHz Float32Array; main thread сам ресемплирует
  при необходимости.
- `loading-progress` приходит во время скачивания/инициализации модели;
  `progress` — 0..1, `stage` — человекочитаемая подпись.
- `result.text` — полная строка (не чанки).

## Translation worker

```ts
type TranslationRequest =
  | { id: number; action: "warmup" }
  | {
      id: number;
      action: "translate";
      text: string;
      sourceLanguage: string;
      targetLanguage: string;
    };

type TranslationResponse = {
  id: number;
  action: "warmup" | "translate";
  translatedText: string;
  error?: string;
};
```

- `id` генерируется в `useTranslation` и используется для отсечения
  устаревших ответов.
- `sourceLanguage` / `targetLanguage` — NLLB-коды (`eng_Latn`, `rus_Cyrl`…).
- Воркер режет входной текст на чанки по `MAX_CHUNK_CHARS`, переводит одним
  батчем и возвращает склеенную строку в `translatedText`.

## PWA install

```ts
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};
```

Используется в `usePWAInstall` для типизации нативного события установки.
