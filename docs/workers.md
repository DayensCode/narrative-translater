# Воркеры

Тяжёлые вычисления (ASR, перевод, захват аудио) выполняются вне UI-потока.

## `src/workers/_hf.ts`

Общий хелпер для Hugging Face `pipeline`:

- `configureOnnxWasmThreads()` — включает multi-thread ONNX только если есть
  `crossOriginIsolated` (COOP+COEP + `SharedArrayBuffer`). Иначе
  `numThreads = 1`.
- `pickPreferredDtype()` — эвристика квантизации: `q4` для слабых устройств
  (`deviceMemory < 4` или `hardwareConcurrency <= 2`), иначе `q8`.
- `createHfPipeline(task, model, { progressCallback })` — единая точка
  создания пайплайна. Возвращает `Promise<unknown>`: конкретные воркеры
  кастуют результат к своей callable-сигнатуре.

Это избавляет от паттерна «попробовать q8 → упасть → откатиться на q4»:
dtype выбирается заранее, до начала download.

## `src/workers/whisper.worker.ts`

- Модель: `Xenova/whisper-small`.
- Создаёт пайплайн `automatic-speech-recognition` через `createHfPipeline`.
- Агрегирует прогресс загрузки по файлам модели и отправляет
  `loading-progress` с полем `stage` («Loading model», «Initializing
  model», «Model ready»).
- Для `transcribe` принимает `Float32Array` на целевом sample rate и
  возвращает `text` одним сообщением.

## `src/workers/translate.worker.ts`

- Модель: `Xenova/nllb-200-distilled-600M`.
- Пайплайн: `translation`, создаётся лениво.
- `splitForTranslation` режет вход по предложениям с порогом
  `MAX_CHUNK_CHARS`.
- Все чанки отправляются одним батч-вызовом (`translator(chunks, …)`), что
  позволяет ONNX переиспользовать compute и не ждать последовательных
  `await`.
- Ответ — полная строка в `translatedText` (не стриминг).
- Включает `max_new_tokens` и `num_beams` из `config/translation.ts`.

## `src/workers/audio-capture.worklet.ts`

`AudioWorkletProcessor`, работающий в audio-thread:

- Аккумулирует 16 frame × 128 сэмплов (= 2048 samples) перед отправкой.
- Считает RMS по батчу (квадраты сэмплов суммируются инкрементально, корень
  берётся один раз на батч).
- Отправляет `{ samples, rms }` в main thread через transferable
  `samples.buffer`.
- Поддерживает «перелив» остатка канала в следующий батч без потерь.

Такая архитектура уменьшает количество `postMessage` с ~375/сек (при 48 kHz
на 128 сэмплов) до ~23/сек и снимает с main thread вычисление RMS.
