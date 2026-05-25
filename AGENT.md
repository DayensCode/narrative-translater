# AGENT.md — Narrative

Этот файл описывает текущее устройство проекта для AI-агентов и автоматических правок.

## Что это

`Narrative` это offline-first PWA на `React 19 + TypeScript + Vite`. Приложение распознаёт речь через `vosk-browser`, переводит текст через `@huggingface/transformers` в `Web Worker`, озвучивает результат через `SpeechSynthesis` и поддерживает мультиязычный UI, тему и установку как PWA.

## Актуальная структура

```text
src/
  App.tsx                         — композиция состояния, маршрутов и хуков
  main.tsx                        — HashRouter + registerSW
  config.ts                       — runtime-константы аудио и перевода
  types/index.ts                  — shared types для main thread и worker
  i18n.ts                         — словари интерфейса и UI locales
  languages.ts                    — source/target language options и speech locales
  pages/
    MainPage.tsx                  — главный экран приложения
    SettingsRoute.tsx             — экран настроек
  hooks/
    useSpeechRecognition.ts       — Vosk + AudioContext + AudioWorklet + VAD
    useTranslation.ts             — lifecycle translation worker + debounce
    useSpeechSynthesis.ts         — SpeechSynthesis API
    usePWAInstall.ts              — beforeinstallprompt/appinstalled
    useTheme.ts                   — theme persistence + system sync
  components/
    TopBar/TopBar.tsx             — hero/header + language selectors + actions
    Panes/Panes.tsx               — source/target panes
    Controls/Controls.tsx         — buttons for record/speak/stop
    SettingsPage/SettingsPage.tsx — UI settings and PWA install action
    Loader/Loader.tsx             — Suspense fallback
  workers/
    translate.worker.ts           — Hugging Face translation worker
    audio-capture.worklet.ts      — AudioWorklet processor
```

## Документация

- [Архитектура](./docs/architecture.md)
- [Хуки](./docs/hooks.md)
- [Компоненты](./docs/components.md)
- [Типы](./docs/types.md)
- [Воркеры](./docs/workers.md)

## Инварианты проекта

- Константы не хардкодим по коду, а выносим в `src/config.ts`, если они используются повторно или влияют на runtime-поведение.
- Shared worker/main-thread types держим в `src/types/index.ts`.
- Тяжёлые browser side effects остаются в hooks или workers, а не в presentational components.
- `App.tsx` отвечает за orchestration, но не должен разрастаться за счёт дублирования логики из хуков.
- Для перевода вся тяжёлая работа должна оставаться в `src/workers/translate.worker.ts`.
- При правках документации ориентируйся на реальный код, а не на старые описания.

## Команды

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|-----------|--------------|----------|
| `VITE_VOSK_MODEL_URL` | `/model.tar.gz` | URL или путь к архиву модели Vosk |
