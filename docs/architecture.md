# Архитектура

## Обзор

Narrative — одностраничное React-приложение (SPA), собираемое через Vite. Вся обработка данных происходит локально в браузере: сеть используется только для первоначальной загрузки моделей.

## Поток данных

```
Микрофон
  → AudioWorklet (audio-capture.worklet.ts)  — семплы Float32Array
  → useSpeechRecognition                     — Vosk, распознавание речи
  → App.tsx (transcript)
  → useTranslation                           — Web Worker, перевод
  → App.tsx (translatedText)
  → useSpeechSynthesis                       — SpeechSynthesis API, озвучка
```

## Слои

### `src/types/index.ts`
Единственный источник типов, разделяемых между основным потоком и Web Worker.

### `src/config.ts`
Все числовые и строковые константы приложения. Изменение параметров модели, таймаутов и порогов — только здесь.

### `src/hooks/`
Изолированные хуки под каждую систему. App.tsx только компонует их и рендерит UI.

| Хук | Отвечает за |
|-----|-------------|
| `useSpeechRecognition` | AudioContext, AudioWorklet, Vosk, VAD, lifecycle |
| `useTranslation` | Web Worker, дебаунс, request ID |
| `useSpeechSynthesis` | SpeechSynthesisUtterance, выбор голоса |
| `usePWAInstall` | `beforeinstallprompt`, состояние установки |

### `src/components/`
Чистые presentational-компоненты. Не содержат бизнес-логики и side effects.

| Компонент | Что рендерит |
|-----------|--------------|
| `TopBar` | Заголовок, статус, кнопки «Очистить» и «Установить» |
| `Panes` | Панели с русским текстом и переводом |
| `Controls` | Кнопки микрофона, озвучки и стопа |

### `src/workers/`
| Файл | Тип | Назначение |
|------|-----|------------|
| `translate.worker.ts` | Web Worker | Загрузка модели, разбивка на чанки, перевод |
| `audio-capture.worklet.ts` | AudioWorkletProcessor | Передача семплов из AudioGraph в основной поток |

## Ключевые решения

**VAD (Voice Activity Detection)** — реализован через RMS-порог на семплах из AudioWorklet. При молчании дольше `SILENCE_TIMEOUT_MS` запись останавливается автоматически.

**Дебаунс перевода** — перевод запускается через `TRANSLATION_DEBOUNCE_MS` после последнего изменения транскрипта, чтобы не гонять модель на каждое слово.

**Request ID** — каждый запрос перевода получает уникальный ID. Ответы с устаревшим ID игнорируются — так исключаются race conditions при быстром вводе.

**q8 → q4 fallback** — модель загружается в квантизации q8; если устройство не поддерживает — падает на q4.
