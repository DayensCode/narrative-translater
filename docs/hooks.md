# Хуки

## Общий принцип

Все хуки в проекте изолируют конкретную подсистему браузера. `App.tsx` связывает их между собой, но детали работы остаются внутри хука.

## useSpeechRecognition

Файл: `src/hooks/useSpeechRecognition.ts`

Назначение:

- загружает модель Vosk
- получает доступ к микрофону
- подключает `AudioWorklet`
- считает VAD по аудиосэмплам
- собирает финальный и промежуточный транскрипт

Сигнатура:

```ts
useSpeechRecognition(modelUrl: string)
```

Возвращает:

| Поле | Тип | Описание |
|------|-----|----------|
| `isRecording` | `boolean` | Идёт ли активная запись |
| `isModelLoading` | `boolean` | Загружается ли Vosk-модель |
| `transcript` | `string` | Финальный распознанный текст |
| `partialTranscript` | `string` | Текущий partial result от Vosk |
| `error` | `string` | Ошибка распознавания или аудиопайплайна |
| `startRecording` | `() => Promise<void>` | Запустить запись |
| `stopRecording` | `() => void` | Остановить запись вручную |
| `clearTranscript` | `() => void` | Сбросить transcript, partial и error |
| `dispose` | `() => void` | Освободить recognizer, model и аудиоресурсы |

Особенности:

- VAD использует `VOICE_ACTIVITY_THRESHOLD`
- автостоп срабатывает после `SILENCE_TIMEOUT_MS`
- `AudioWorklet` грузится из `src/workers/audio-capture.worklet.ts`
- recognizer создаётся на частоте `audioContext.sampleRate`

## useTranslation

Файл: `src/hooks/useTranslation.ts`

Назначение:

- создаёт и завершает `translate.worker.ts`
- отправляет warmup-сообщение при инициализации
- дебаунсит перевод
- отслеживает актуальный request id

Сигнатура:

```ts
useTranslation()
```

Возвращает:

| Поле | Тип | Описание |
|------|-----|----------|
| `isTranslating` | `boolean` | Идёт ли перевод или debounce-ожидание |
| `translatedText` | `string` | Последний успешный перевод |
| `translationError` | `string` | Ошибка от воркера перевода |
| `translate` | `(text: string, sourceLanguage: string, targetLanguage: TranslationLanguageCode) => void` | Запланировать перевод |
| `clearTranslation` | `() => void` | Сбросить перевод, ошибку и debounce |

Особенности:

- пустой текст не отправляется в воркер
- перевод откладывается на `TRANSLATION_DEBOUNCE_MS`
- ответы с неактуальным `id` игнорируются

## useSpeechSynthesis

Файл: `src/hooks/useSpeechSynthesis.ts`

Назначение:

- оборачивает `window.speechSynthesis`
- подбирает голос по языковому префиксу
- отслеживает состояние проигрывания

Возвращает:

| Поле | Тип | Описание |
|------|-----|----------|
| `isSpeaking` | `boolean` | Идёт ли озвучка |
| `speak` | `(text: string, lang: string) => void` | Озвучить текст на нужной локали |
| `stop` | `() => void` | Отменить текущую озвучку |

Особенности:

- перед новым воспроизведением всегда вызывается `stop()`
- если подходящий voice не найден, используется поведение браузера по умолчанию

## usePWAInstall

Файл: `src/hooks/usePWAInstall.ts`

Назначение:

- ловит `beforeinstallprompt`
- управляет install button state
- фиксирует успешную установку по `appinstalled`

Возвращает:

| Поле | Тип | Описание |
|------|-----|----------|
| `isInstalled` | `boolean` | Приложение уже установлено |
| `isInstallAvailable` | `boolean` | Браузер разрешает показать install prompt |
| `install` | `() => Promise<void>` | Запустить установку PWA |

## useTheme

Файл: `src/hooks/useTheme.ts`

Назначение:

- хранит пользовательский выбор темы
- синхронизируется с `prefers-color-scheme`
- сохраняет значение в `localStorage`

Возвращает:

| Поле | Тип | Описание |
|------|-----|----------|
| `theme` | `ThemeMode` | Выбранный режим: `system`, `light`, `dark` |
| `resolvedTheme` | `ResolvedTheme` | Фактическая активная тема: `light` или `dark` |
| `setTheme` | `(theme: ThemeMode) => void` | Изменить режим |
