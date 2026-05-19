# Типы

## Правила

- Все типы, разделяемые между основным потоком и Web Worker, объявляются в `src/types/index.ts`.
- Локальные типы (props компонентов, возвращаемые значения хуков) объявляются inline в файле, где используются.
- Предпочитаем дискриминированные union-типы (`action: "warmup" | "translate"`) вместо опциональных полей.

## Shared types (`src/types/index.ts`)

### TranslationRequest

```typescript
type TranslationRequest =
  | { id: number; action: "warmup" }
  | { id: number; action: "translate"; text: string };
```

Сообщение от основного потока к воркеру перевода. Discriminated union — TypeScript сужает тип по полю `action`.

### TranslationResponse

```typescript
type TranslationResponse = {
  id: number;
  action: "warmup" | "translate";
  translatedText: string;
  error?: string;
};
```

Ответ от воркера перевода. Поле `id` позволяет игнорировать устаревшие ответы.

### BeforeInstallPromptEvent

```typescript
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
```

Расширение стандартного `Event` для нестандартного события `beforeinstallprompt` (PWA).

## Константы (`src/config.ts`)

Числовые параметры вынесены в константы с явными именами. Не используй магические числа в коде — добавляй константу в `config.ts`.
