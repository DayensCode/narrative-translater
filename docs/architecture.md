# Архитектура

## Обзор

`Narrative` — клиентское React-приложение на Vite и TypeScript. Бэкенда нет:
распознавание, перевод, воспроизведение речи и PWA-установка работают в
браузере.

Приложение построено вокруг двух экранов:

- `#/` — основной экран перевода
- `#/settings` — настройки темы, языка интерфейса и списка языков перевода

Маршрутизация реализована через `HashRouter`, чтобы приложение проще работало
как статический PWA-бандл.

## Поток данных

```text
Микрофон
  -> MediaStream
  -> AudioContext (единый, 16 kHz)
  -> AudioWorklet (audio-capture.worklet.ts, batch + RMS)
  -> useSpeechRecognition
  -> whisper.worker.ts (Xenova/whisper-small)
  -> transcript / partialTranscript
  -> useTranslation
  -> translate.worker.ts (Xenova/nllb-200-distilled-600M, batched chunks)
  -> translatedText
  -> useSpeechSynthesis
  -> SpeechSynthesis API
```

## Точка сборки приложения

### `src/main.tsx`

- ждёт `i18nReady` (загрузка первой локали) перед mount,
- регистрирует service worker через `registerSW({ immediate: true })`,
- просит `navigator.storage.persist()` чтобы браузер не выбрасывал модели,
- инициализирует `HashRouter` и монтирует `App`.

### `src/App.tsx`

`App` содержит orchestration-логику:

- хранит выбранные source/target language (дефолты из `nllb-languages`),
- связывает транскрипт с переводом через `useEffect`,
- формирует статус интерфейса и онбординг-шаги через мемоизированные опции,
- настраивает `document.lang`, `dir`, `title` и `meta[name="description"]`.

Тема и RTL применяются к `<html>` (см. `useTheme`), с anti-flash snippet в
`index.html`, чтобы до mount уже был правильный цвет.

## Слои

### `src/hooks/`

- `useSpeechRecognition` — единый `AudioContext` (пересоздаётся только при
  `dispose`), `AudioWorklet` подгружается один раз, VAD/тишина считается из
  RMS, присылаемого воркером.
- `useTranslation` — lifecycle перевода: worker стартует через
  `requestIdleCallback`, чтобы не воевать с Whisper за канал; debounce,
  stale-response cancellation через инкремент `requestIdRef`.
- `useSpeechSynthesis` — кэш `getVoices()` с подпиской на `voiceschanged`.
- `useLanguageList` — хранение выбранного набора NLLB-кодов в localStorage,
  мемоизированные `selectedLanguages` / `selectedCodes`.
- `useTheme` — тема + синхронизация с `prefers-color-scheme`, пишет на
  `<html data-theme>` и `style.colorScheme`.
- `usePWAInstall` — `beforeinstallprompt` / `appinstalled`, начальное
  значение `isInstalled` читается из `matchMedia` в initializer.

### `src/components/`

- `TopBar` — hero-блок, селекты языков, очистка, переход в настройки.
- `Panes` — две рабочие панели: source/target. CSS включает
  `overflow-wrap: anywhere` и `word-break: break-word` чтобы длинные строки
  не ломали layout.
- `Controls` — действия записи и воспроизведения.
- `SettingsPage` — настройки UI, список NLLB-языков и PWA install.
- `OnboardingOverlay` — туториал c rAF throttle.
- `Loader` — fallback для Suspense.

### `src/pages/`

- `MainPage` и `SettingsRoute` рендерят свои экраны.
- Онбординг-шаги вынесены в `pages/*-onboarding-steps.ts` и мемоизируются.

### `src/workers/`

- `_hf.ts` — общий `createHfPipeline`: выбирает dtype (q8/q4) по
  `deviceMemory` / `hardwareConcurrency`, настраивает ONNX WASM threads
  (только при `crossOriginIsolated`).
- `translate.worker.ts` — NLLB, батчит массив чанков одним вызовом.
- `whisper.worker.ts` — Whisper, отдаёт loading progress наружу.
- `audio-capture.worklet.ts` — `AudioWorkletProcessor`, батчит 16 frame × 128
  сэмплов, считает RMS в воркере и отправляет буфер через transferable.

### `src/i18n/` и `src/languages.ts`

- `src/languages.ts` — константа `UI_LOCALES` и функция `normalizeUiLocale`.
- `src/i18n/index.ts` — инициализация i18next, динамический импорт локали по
  запросу (`addResourceBundle`), `i18nReady` для bootstrap.
- `src/i18n/locales/*.ts` — по одному файлу на локаль.

### `src/config/`

- `config/audio.ts` — `AUDIO_SAMPLE_RATE`, `SILENCE_TIMEOUT_MS`,
  `VOICE_ACTIVITY_THRESHOLD`, `WORKLET_FRAMES_PER_BATCH`.
- `config/translation.ts` — `TRANSLATION_DEBOUNCE_MS`, `MAX_CHUNK_CHARS`,
  `TRANSLATION_MAX_NEW_TOKENS`, `TRANSLATION_NUM_BEAMS`.
- `config/index.ts` — barrel.

### `src/types/index.ts`

Shared-типы для main thread и translation/whisper workers.

## Ключевые решения

### VAD на стороне worklet

RMS считается внутри `AudioWorkletProcessor` и приходит в main thread уже
готовым числом. Это уменьшает работу в UI-потоке и число `postMessage`.

### Единый AudioContext

`AudioContext` создаётся один раз при первом `startRecording`, модуль
worklet-а загружается один раз (`workletReadyRef`). При остановке мы
`suspend()` вместо `close()`. Полное закрытие — только в `dispose()`.

### Перевод в Web Worker + идемпотентность

`useTranslation` при каждом новом вызове инкрементирует `requestIdRef`; ответ
с устаревшим id игнорируется. Пустой текст сразу сбрасывает состояние и
инвалидирует последний id.

### Квантизация модели

`createHfPipeline` выбирает `q8` по умолчанию и `q4` на слабых устройствах
(`deviceMemory < 4` или `hardwareConcurrency <= 2`). Больше нет
download-then-fail-then-retry цикла.

### Offline-first PWA

Service worker регистрируется сразу, Workbox кэширует локальный app shell и
удалённые артефакты моделей. `navigator.storage.persist()` запрашивается
один раз при старте.
