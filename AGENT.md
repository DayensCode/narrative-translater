# AGENT.md — Narrative

Этот файл описывает проект для AI-агентов (Claude Code и аналогов).

## Что это

**Narrative** — PWA на React + TypeScript + Vite. Записывает русскую речь, распознаёт её через Vosk, переводит через HuggingFace Transformers (Web Worker), озвучивает через SpeechSynthesis. Всё локально, без серверов.

## Структура проекта

```
src/
  App.tsx                  — корневой компонент, компонует хуки и компоненты
  config.ts                — все константы (таймауты, пороги, параметры модели)
  types/index.ts           — shared-типы между основным потоком и воркером
  hooks/
    useSpeechRecognition.ts — AudioContext + AudioWorklet + Vosk + VAD
    useTranslation.ts       — Web Worker + дебаунс + request ID
    useSpeechSynthesis.ts   — SpeechSynthesis API
    usePWAInstall.ts        — beforeinstallprompt + состояние установки
  components/
    TopBar.tsx              — заголовок, статус, кнопки
    Panes.tsx               — панели с транскриптом и переводом
    Controls.tsx            — кнопки микрофона, озвучки, стопа
  workers/
    translate.worker.ts     — модуль Worker: загрузка модели, перевод
    audio-capture.worklet.ts — AudioWorkletProcessor: передача семплов
```

## Документация

- [Архитектура](./docs/architecture.md)
- [Хуки](./docs/hooks.md)
- [Компоненты](./docs/components.md)
- [Типы](./docs/types.md)
- [Воркеры](./docs/workers.md)

## Правила для агента

- **Константы** — только в `src/config.ts`, не хардкодить в коде.
- **Shared-типы** — только в `src/types/index.ts`.
- **Компоненты** — без хуков состояния и side effects. Только props и JSX.
- **Бизнес-логика** — в хуках, не в компонентах и не в App.tsx.
- **Воркер перевода** — импортирует типы из `../types` и константы из `../config`.
- **Комментарии** — только там, где WHY неочевиден (скрытое ограничение, обходной путь).

## Команды

```bash
npm run dev      # запуск dev-сервера (http://narrative.localhost:5173)
npm run build    # TypeScript-проверка + Vite build
npm run lint     # ESLint
npm run preview  # превью production-сборки
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|-----------|--------------|----------|
| `VITE_VOSK_MODEL_URL` | `/model.tar.gz` | URL модели Vosk |
