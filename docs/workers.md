# Web Workers

## translate.worker.ts

**Тип:** `Worker` (модульный)  
**Файл:** `src/workers/translate.worker.ts`

Выполняет загрузку модели и перевод в фоновом потоке, не блокируя UI.

### Жизненный цикл

1. Воркер создаётся при монтировании `useTranslation`.
2. Сразу отправляется `{ action: "warmup" }` — модель загружается и прогревается.
3. При изменении транскрипта основной поток отправляет `{ action: "translate", text, id }`.
4. Воркер возвращает `{ action: "translate", translatedText, id }`.
5. При размонтировании хука воркер терминируется.

### Chunking

Длинный текст разбивается на чанки ≤ `MAX_CHUNK_CHARS` символов по границам предложений. Каждый чанк переводится отдельно, результаты конкатенируются.

### Квантизация

Модель загружается в `q8`. Если загрузка падает с ошибкой — повтор в `q4`.

---

## audio-capture.worklet.ts

**Тип:** `AudioWorkletProcessor`  
**Файл:** `src/workers/audio-capture.worklet.ts`

Запускается в `AudioWorkletGlobalScope` (отдельный поток, синхронный с audio render quantum).

### Задача

Принимает семплы из аудиографа (`inputs[0][0]`) и пересылает их в основной поток через `this.port.postMessage()`. Основной поток передаёт семплы в Vosk и считает RMS для VAD.

### TypeScript-типы

`AudioWorkletGlobalScope` отличается от `Window`. TypeScript 5.9 не включает `AudioWorkletProcessor` и `registerProcessor` ни в `DOM`, ни в `WebWorker` lib.

Файл компилируется отдельным конфигом `tsconfig.worklet.json` (lib: `["ES2022", "WebWorker"]`) и исключён из `tsconfig.app.json`. Необходимые globals объявлены локально в начале файла через `declare abstract class` и `declare function`.
