# Workers

## translate.worker.ts

Файл: `src/workers/translate.worker.ts`

Тип:

- модульный `Web Worker`

Назначение:

- загружает translation pipelines из `@huggingface/transformers`
- прогревает модель при старте
- выбирает маршрут перевода по языковой паре
- переводит текст батчами, не блокируя UI-поток

## Жизненный цикл

1. `useTranslation` создаёт воркер при монтировании.
2. Сразу отправляется сообщение `{ id: 0, action: "warmup" }`.
3. Воркер загружает базовую модель `Xenova/opus-mt-ru-en`.
4. При вызове `translate(...)` основной поток отправляет `action: "translate"` с `text`, `sourceLanguage`, `targetLanguage`.
5. Воркер возвращает `translatedText` или `error`.
6. При размонтировании хука воркер завершается.

## Маршрутизация перевода

Воркер поддерживает три типа маршрутов:

- direct: одна модель для пары, например `ru -> es`
- through English: `source -> en` или `en -> target`
- pivot: `source -> en -> target`

Примеры текущих маппингов:

- source to English: `ru`, `es`, `fr`, `zh`, `ar`, `hi`
- English to target: `ru`, `es`, `fr`, `hi`, `zh`, `ar`
- direct shortcuts: `ru -> es`, `ru -> fr`

Если маршрут не сконфигурирован, воркер возвращает ошибку.

## Chunking

Функция `splitForTranslation()`:

- нормализует пробелы
- пытается делить текст по границам предложений
- собирает чанки длиной не больше `MAX_CHUNK_CHARS`

Каждый chunk переводится отдельно, затем результаты склеиваются.

## Параметры inference

- `max_new_tokens`: `TRANSLATION_MAX_NEW_TOKENS`
- `num_beams`: `TRANSLATION_NUM_BEAMS`

При загрузке pipeline сначала используется `dtype: "q8"`, а при неудаче выполняется fallback на `dtype: "q4"`.

## Локальные особенности

- warning про `MarianTokenizer` и отсутствие fast-tokenizer осознанно фильтруется
- для ONNX WASM backend число потоков принудительно ставится в `1`
- переводчики кэшируются в `Map<string, Promise<TranslatorFn>>`, чтобы не создавать один и тот же pipeline повторно

## audio-capture.worklet.ts

Файл: `src/workers/audio-capture.worklet.ts`

Тип:

- `AudioWorkletProcessor`

Назначение:

- получает аудиокадры из `inputs[0][0]`
- отправляет `Float32Array` в основной поток через `port.postMessage`
- не делает распознавание и не считает VAD сам

VAD и передача данных в Vosk происходят в `useSpeechRecognition`.

## TypeScript-ограничения

`AudioWorkletProcessor` и `registerProcessor` не типизированы стандартными lib в текущей конфигурации проекта, поэтому нужные объявления заданы локально в начале файла.
