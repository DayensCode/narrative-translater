# Архитектура

## Обзор

`Narrative` это клиентское React-приложение на `Vite` и `TypeScript`. Бэкенда нет: распознавание, перевод, воспроизведение речи и PWA-установка работают в браузере.

Приложение построено вокруг двух экранов:

- `#/` — основной экран перевода
- `#/settings` — настройки темы, языка интерфейса и установки PWA

Маршрутизация реализована через `HashRouter`, чтобы приложение проще работало как статический PWA-бандл.

## Поток данных

```text
Микрофон
  -> MediaStream
  -> AudioContext
  -> AudioWorklet (audio-capture.worklet.ts)
  -> useSpeechRecognition
  -> transcript / partialTranscript
  -> useTranslation
  -> Web Worker (translate.worker.ts)
  -> translatedText
  -> useSpeechSynthesis
  -> SpeechSynthesis API
```

## Точка сборки приложения

### `src/main.tsx`

- регистрирует service worker через `registerSW({ immediate: true })`
- инициализирует `HashRouter`
- монтирует корневой компонент `App`

### `src/App.tsx`

`App` содержит orchestration-логику:

- хранит выбранные source/target language
- хранит тему через `useTheme`
- связывает транскрипт с переводом через `useEffect`
- формирует текстовый статус интерфейса
- настраивает `document.lang`, `dir`, `title` и `meta[name="description"]`
- лениво загружает страницы `MainPage` и `SettingsRoute`

## Слои

### `src/hooks/`

Хуки инкапсулируют побочные эффекты и браузерные API:

- `useSpeechRecognition` — Vosk, `getUserMedia`, `AudioContext`, `AudioWorklet`, VAD
- `useTranslation` — lifecycle переводческого воркера, debounce, request tracking
- `useSpeechSynthesis` — `SpeechSynthesisUtterance` и выбор голоса
- `usePWAInstall` — `beforeinstallprompt` и `appinstalled`
- `useTheme` — пользовательская тема, system fallback, `localStorage`

### `src/components/`

Компоненты в основном презентационные:

- `TopBar` — hero-блок, селекты языков, очистка, переход в настройки
- `Panes` — две рабочие панели: source/target
- `Controls` — действия записи и воспроизведения
- `SettingsPage` — настройки UI и PWA
- `Loader` — fallback для lazy routes

### `src/pages/`

Страницы собирают layout из компонентных блоков:

- `MainPage` рендерит главный экран
- `SettingsRoute` оборачивает `SettingsPage` в общий shell

### `src/workers/`

- `translate.worker.ts` — перевод в отдельном потоке
- `audio-capture.worklet.ts` — прокидывает аудиосэмплы из audio graph в основной поток

### `src/i18n.ts` и `src/languages.ts`

- `src/i18n.ts` хранит UI-переводы и нормализацию интерфейсных локалей
- `src/languages.ts` описывает поддерживаемые языки ввода, вывода и speech locale

### `src/types/index.ts`

Здесь лежат shared-типы для main thread и translation worker.

## Ключевые решения

### VAD на стороне клиента

`useSpeechRecognition` считает RMS по incoming семплам из `AudioWorklet` и завершает запись после `SILENCE_TIMEOUT_MS` тишины.

### Перевод в Web Worker

Тяжёлая модель и inference вынесены из UI-потока, поэтому интерфейс не блокируется во время загрузки модели и перевода.

### Debounce и request id

`useTranslation` откладывает отправку текста на `TRANSLATION_DEBOUNCE_MS` и игнорирует ответы не от последнего запроса.

### Translation routing

`translate.worker.ts` поддерживает несколько сценариев:

- direct route для некоторых пар, например `ru -> es`
- direct route через English only, если source или target это `en`
- pivot route `source -> en -> target`, если прямой модели нет

### Квантизация модели

При загрузке translation pipeline воркер сначала пробует `q8`, а затем падает обратно на `q4`, если первая загрузка не удалась.

### Offline-first PWA

Service worker регистрируется сразу. Workbox кэширует локальный app shell и удалённые артефакты моделей, чтобы повторные запуски были быстрее и стабильнее офлайн.
