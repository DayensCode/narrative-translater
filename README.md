# Narrative

PWA-приложение для записи русской речи, перевода в реальном времени и озвучки на английском. Всё работает локально в браузере — без серверов и облака.

## Возможности

- Запись голоса с микрофона
- Распознавание речи через `vosk-browser` (локально, без отправки данных)
- Перевод RU → EN через `@huggingface/transformers` в Web Worker
- Озвучка перевода через браузерный `SpeechSynthesis`
- Установка как PWA (работает офлайн после первого запуска)

## Запуск

```bash
npm install
```

Создайте `.env` по примеру `.env.example`:

```bash
cp .env.example .env
```

Скачайте модель Vosk и положите как `public/model.tar.gz`. При необходимости укажите путь в `.env`:

```env
VITE_VOSK_MODEL_URL=/model.tar.gz
```

```bash
npm run dev
```

Для теста PWA-установки в dev используйте домен `http://narrative.localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

## Архитектура

Подробная документация — в [`/docs`](./docs/).

## Важно

Модель Vosk и веса HuggingFace загружаются в браузер при первом запуске. PWA service worker кэширует их, поэтому последующие запуски значительно быстрее.

Перевод выполняется в `src/workers/translate.worker.ts` с моделью `Xenova/opus-mt-ru-en`. Воркер запускается сразу при загрузке страницы и прогревает модель (`warmup`).
