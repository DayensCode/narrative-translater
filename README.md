# Narrative

`Narrative` is an offline-first PWA for speech transcription, translation, and voice playback in the browser. Recognition runs through `vosk-browser`, translation runs in a dedicated Web Worker via `@huggingface/transformers`, and playback uses the browser `SpeechSynthesis` API.

## What The App Does

- Records speech from the microphone and transcribes it locally in the browser.
- Translates text between supported languages without an application backend.
- Plays back either the original transcript or the translated text with a matching browser voice.
- Supports multilingual UI, theme switching, and installable PWA mode.
- Caches app assets and remote model files for faster repeat launches.

## Current Capabilities

- UI locales: `ru`, `en`, `zh`, `hi`, `es`, `ar`, `fr`
- Source language selection: `ru`, `en`, `es`, `fr`, `hi`, `zh`, `ar`
- Target language selection: `ru`, `en`, `es`, `fr`, `hi`, `zh`, `ar`
- Recognition model: Vosk model from `VITE_VOSK_MODEL_URL`
- Translation engine: Hugging Face browser pipelines in `src/workers/translate.worker.ts`
- Routing: `HashRouter` with `#/` and `#/settings`

Speech recognition is still tied to the Vosk model you ship in `public/model.tar.gz`. If you keep the default Russian model, source language switching changes labels and speech synthesis locale, but recognition quality is only correct for Russian input.

## Development

```bash
npm install
npm run dev
```

Dev server defaults:

- app: `http://localhost:5173`
- PWA install testing: `http://narrative.localhost:5173`

Optional environment variable:

```env
VITE_VOSK_MODEL_URL=/model.tar.gz
```

By default the app expects a Vosk archive at [public/model.tar.gz](/Users/andreyburov/Desktop/Narrative/Translater/public/model.tar.gz). Put the model there or point `VITE_VOSK_MODEL_URL` to another reachable URL.

## Build

```bash
npm run build
npm run preview
```

Preview server defaults to `http://localhost:4173`.

## Architecture

High-level flow:

```text
Microphone
  -> AudioWorklet
  -> useSpeechRecognition
  -> transcript state in App
  -> useTranslation
  -> translate.worker.ts
  -> translated text
  -> useSpeechSynthesis
```

Key modules:

- [src/App.tsx](/Users/andreyburov/Desktop/Narrative/Translater/src/App.tsx): application composition, routes, state wiring
- [src/pages/MainPage.tsx](/Users/andreyburov/Desktop/Narrative/Translater/src/pages/MainPage.tsx): main workspace screen
- [src/pages/SettingsRoute.tsx](/Users/andreyburov/Desktop/Narrative/Translater/src/pages/SettingsRoute.tsx): settings screen wrapper
- [src/hooks](/Users/andreyburov/Desktop/Narrative/Translater/src/hooks): browser API orchestration
- [src/workers](/Users/andreyburov/Desktop/Narrative/Translater/src/workers): translation worker and audio worklet
- [docs](/Users/andreyburov/Desktop/Narrative/Translater/docs): detailed internal docs

## PWA And Caching

The app uses `vite-plugin-pwa` with immediate service worker registration. Workbox caches:

- local app shell assets
- Hugging Face model files from `huggingface.co`, `hf.co`, `cdn-lfs.huggingface.co`
- CDN assets from `cdn.jsdelivr.net`

The cache limit is configured in [vite.config.ts](/Users/andreyburov/Desktop/Narrative/Translater/vite.config.ts).

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
