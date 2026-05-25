# Типы

## Правила

- Shared-типы между main thread и worker лежат в `src/types/index.ts`.
- Локальные props и view-specific типы объявляются рядом с компонентом или страницей.
- Для сообщений воркера используется discriminated union по полю `action`.

## Shared types

Файл: `src/types/index.ts`

### TranslationRequest

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
```

Назначение:

- `warmup` прогревает translation worker без текста
- `translate` несёт текст и выбранную языковую пару

### TranslationResponse

```ts
type TranslationResponse = {
  id: number;
  action: "warmup" | "translate";
  translatedText: string;
  error?: string;
};
```

Назначение:

- `id` позволяет отбросить устаревшие ответы
- `translatedText` всегда присутствует, даже если это пустая строка
- `error` передаёт ошибку warmup или перевода

### BeforeInstallPromptEvent

```ts
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};
```

Назначение:

Нужен для типизации нестандартного browser event `beforeinstallprompt`, который используется в `usePWAInstall`.

## Константы

Файл: `src/config.ts`

### Audio

| Константа | Значение | Описание |
|-----------|----------|----------|
| `AUDIO_SAMPLE_RATE` | `16000` | Желаемая частота при запросе микрофона |
| `SILENCE_TIMEOUT_MS` | `2500` | Порог автоостановки по тишине |
| `VOICE_ACTIVITY_THRESHOLD` | `0.01` | RMS-порог для простого VAD |

### Translation

| Константа | Значение | Описание |
|-----------|----------|----------|
| `TRANSLATION_DEBOUNCE_MS` | `500` | Задержка перед отправкой текста в воркер |
| `MAX_CHUNK_CHARS` | `220` | Максимальный размер одного translation chunk |
| `TRANSLATION_MAX_NEW_TOKENS` | `384` | Лимит генерации для pipeline |
| `TRANSLATION_NUM_BEAMS` | `4` | Параметр beam search |
