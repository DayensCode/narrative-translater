# Хуки

Каталог `src/hooks/`. Каждый хук инкапсулирует один домен побочных эффектов.

## `useSpeechRecognition(language)`

Обёртка над Whisper-воркером и Web Audio API.

Возвращает:

- `isRecording`, `isModelLoading`, `modelLoadingProgress`, `modelLoadingStage`
- `isTranscribing`
- `transcript`, `setTranscript`, `partialTranscript`
- `error`
- `startRecording`, `stopRecording`, `clearTranscript`, `dispose`

Детали реализации:

- Воркер создаётся лениво (`getWorker`) и прогревается `warmup` при mount.
- `AudioContext` создаётся один раз (`getAudioContext`) с
  `sampleRate: AUDIO_SAMPLE_RATE` и `latencyHint: "interactive"`. При
  остановке используется `suspend()`, полное закрытие — только в `dispose`.
- `audioWorklet.addModule` выполняется один раз (`workletReadyRef`).
- Батчи и RMS приходят из `audio-capture.worklet.ts`; main thread хранит
  `audioBatchesRef` и `lastVoiceBatchIdxRef` (индекс последнего голосового
  батча), а VAD сравнивает RMS с `VOICE_ACTIVITY_THRESHOLD`.
- Если тишина длится `SILENCE_TIMEOUT_MS`, запись автоматически
  останавливается и батчи отправляются в воркер одним сообщением
  (`prepareWhisperAudio` + ресемплинг через `OfflineAudioContext` при
  отличающемся sample rate).
- Перед отправкой `prepareWhisperAudio` обрезает хвост тишины, но оставляет
  ~150 ms для естественного cut-off.

## `useTranslation()`

Возвращает: `isTranslating`, `translatedText`, `translationError`,
`translate(text, src, tgt)`, `clearTranslation()`.

Детали:

- Воркер создаётся не сразу при mount, а по `requestIdleCallback`
  (fallback — `setTimeout(..., 1200)`). Это даёт Whisper стартовать первым.
- `requestIdRef` инкрементируется при каждом `translate()` и очистке;
  ответ с устаревшим id игнорируется — state не перезаписывается.
- `clearTranslation()` и пустой текст дополнительно инвалидирует id, чтобы
  последний in-flight ответ не вернул содержимое после очистки.
- Debounce — `TRANSLATION_DEBOUNCE_MS` из `config/translation.ts`.

## `useSpeechSynthesis()`

- Кэш голосов на уровне модуля + подписка на `voiceschanged`, чтобы
  `pickVoice` работал синхронно даже на Chromium (который возвращает
  пустой список при первом `getVoices()`).
- `speak()` отсоединяет `onend/onerror` старой реплики перед новой, чтобы
  cancel-race не сбрасывал `isSpeaking`.

## `useLanguageList()`

- Читает/пишет `selected-languages` в `localStorage`.
- Хранит `selectedCodes` и мемоизирует `selectedLanguages`
  (`NllbLanguage[]`), чтобы downstream-эффекты и массивы опций не
  пересоздавались на каждый ре-рендер.
- Запрещает удалить последний язык.

## `useTheme()`

- `ThemeMode`: `system | light | dark`; хранится в localStorage под ключом
  `narrative-theme`.
- Подписывается на `prefers-color-scheme` для режима `system`.
- Применяет `data-theme` и `color-scheme` к `<html>`. Это сочетается с
  anti-flash snippet в `index.html`, который пишет туда то же самое до
  mount React.

## `usePWAInstall()`

- Начальное значение `isInstalled` читается из
  `matchMedia("(display-mode: standalone)")` в initializer (не в effect).
- Слушает `beforeinstallprompt` / `appinstalled`.
- `install()` запускает нативное приглашение и разрешает по `userChoice`.
