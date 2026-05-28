# Narrative

`Narrative` is an offline-first PWA for live speech translation in the browser.
Speech recognition, translation, and voice playback all run locally — there is
no application backend and no audio leaves the device.

## What the app does

- Records speech through the microphone and transcribes it locally with
  Whisper (`Xenova/whisper-small`).
- Translates the transcript between 200+ NLLB languages using
  `Xenova/nllb-200-distilled-600M` in a dedicated Web Worker.
- Plays back the source or translated text through the browser
  `SpeechSynthesis` API.
- Ships as an installable PWA with offline caching for the app shell and the
  Hugging Face model artifacts.

## Current capabilities

- UI locales: `ru`, `en`, `zh`, `hi`, `es`, `ar`, `fr` (lazily loaded on demand).
- Source/target languages: full NLLB-200 list, with a customizable short list
  on the main screen.
- Recognition: Whisper small, single long-lived `AudioContext` at 16 kHz with
  a batching `AudioWorklet` and RMS-based voice activity detection.
- Translation: NLLB-200 distilled 600M, batched chunk inference, debounced
  input, stale-response cancellation.
- Routing: `HashRouter` with `#/` and `#/settings`.

## Development

```bash
npm install
npm run dev
```

Dev server defaults:

- app: `http://localhost:5173`
- PWA install testing: `http://narrative.localhost:5173`

There are no environment variables.

## Build

```bash
npm run build
npm run preview
```

Preview server defaults to `http://localhost:4173`.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # TypeScript + Vite production build
npm run preview      # Preview the production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest (pure-function tests)
npm run format       # Prettier (writes)
npm run format:check # Prettier (checks)
```

## Architecture

High-level flow:

```text
Microphone
  -> AudioWorklet (audio-capture.worklet.ts, batches + RMS)
  -> useSpeechRecognition
  -> whisper.worker.ts
  -> transcript state in App
  -> useTranslation
  -> translate.worker.ts (NLLB batched)
  -> translated text
  -> useSpeechSynthesis
```

Key modules:

- `src/App.tsx` — application composition, routes, and state wiring
- `src/pages/MainPage.tsx` — main workspace screen
- `src/pages/SettingsRoute.tsx` — settings screen
- `src/hooks` — browser API orchestration
- `src/workers` — translation / recognition workers and audio worklet
- `src/i18n` — i18next setup with per-locale code-split bundles
- `src/config` — runtime constants (audio, translation)
- `docs` — detailed internal docs

## PWA and caching

The app uses `vite-plugin-pwa` with immediate service worker registration.
Workbox caches:

- the local app shell,
- Hugging Face model files from `huggingface.co`, `hf.co`, and
  `cdn-lfs.huggingface.co`,
- CDN assets from `cdn.jsdelivr.net`.

`navigator.storage.persist()` is requested at startup so the browser keeps the
cached models across eviction cycles when the user allows it. The cache limit
is configured in [vite.config.ts](./vite.config.ts).
