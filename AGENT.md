# AGENT.md — Narrative

Этот файл описывает текущее устройство проекта для AI-агентов и автоматических
правок.

## Что это

`Narrative` — offline-first PWA на `React 19 + TypeScript + Vite`. Приложение
распознаёт речь локально через Whisper (`Xenova/whisper-small`), переводит
текст через NLLB-200 (`Xenova/nllb-200-distilled-600M`) в Web Worker,
озвучивает результат через `SpeechSynthesis` и поддерживает мультиязычный UI,
тему и установку как PWA.

## Актуальная структура

```text
src/
  App.tsx                         — композиция состояния, маршрутов и хуков
  main.tsx                        — HashRouter, await i18nReady, registerSW,
                                    navigator.storage.persist()
  languages.ts                    — UI_LOCALES + normalizeUiLocale
  nllb-languages.ts               — список NLLB языков, whisper mapping,
                                    дефолты и localized names
  config/
    audio.ts                      — audio-константы (sample rate, VAD, worklet)
    translation.ts                — translation-константы (debounce, beams…)
    index.ts                      — barrel
  i18n/
    index.ts                      — init + lazy loader
    locales/{ru,en,zh,hi,es,ar,fr}.ts — отдельные бандлы локалей
  pages/
    MainPage.tsx                  — главный экран
    SettingsRoute.tsx             — экран настроек
    main-onboarding-steps.ts      — шаги onboarding главного экрана
    settings-onboarding-steps.ts  — шаги onboarding настроек
  hooks/
    useSpeechRecognition.ts       — единый AudioContext + AudioWorklet + VAD
    useTranslation.ts             — lifecycle translation worker + debounce +
                                    stale-response cancellation + idle start
    useSpeechSynthesis.ts         — SpeechSynthesis + voice cache
    useLanguageList.ts            — список языков в localStorage + memo
    useTheme.ts                   — тема + documentElement sync
    usePWAInstall.ts              — beforeinstallprompt / appinstalled
  components/
    TopBar/                       — hero + селекторы языка + actions
    Panes/                        — source / target panes
    Controls/                     — запись / воспроизведение
    SettingsPage/                 — настройки и PWA install
    OnboardingOverlay/            — туториал (rAF throttle, ResizeObserver)
    Loader/                       — Suspense fallback
  workers/
    _hf.ts                        — общий createHfPipeline (dtype, threads)
    whisper.worker.ts             — Whisper ASR worker
    translate.worker.ts           — NLLB translation worker (batched chunks)
    audio-capture.worklet.ts      — AudioWorkletProcessor (batch + RMS)
```

## Документация

- [Архитектура](./docs/architecture.md)
- [Хуки](./docs/hooks.md)
- [Компоненты](./docs/components.md)
- [Типы](./docs/types.md)
- [Воркеры](./docs/workers.md)

## Инварианты проекта

- Runtime-константы лежат в `src/config/*`; не хардкодим их по коду.
- Shared worker/main-thread типы — в `src/types/index.ts`.
- Тяжёлые браузерные сайд-эффекты остаются в hooks или workers, не в
  презентационных компонентах.
- `App.tsx` — orchestration, без дублирования логики из хуков.
- Любая тяжёлая инференс-работа — в Web Worker, не в UI-потоке.
- HF pipeline создаётся через `createHfPipeline` из `workers/_hf.ts`, чтобы
  dtype-эвристика и WASM-потоки конфигурировались централизованно.
- Новые UI-локали добавляются файлом в `src/i18n/locales/<code>.ts` и
  записью в `loaders` внутри `src/i18n/index.ts`.
- При правках документации ориентируйся на реальный код, а не на старые
  описания.

## Команды

```bash
npm run dev          # dev-сервер Vite
npm run build        # продакшен-сборка (tsc + vite)
npm run preview      # предпросмотр продакшен-сборки
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest
npm run format       # Prettier (write)
npm run format:check # Prettier (check)
```

## Переменные окружения

Никаких `VITE_*` переменных проект сейчас не требует. Модели тянутся из
Hugging Face Hub при первом запуске и кэшируются workbox-ом.
