# Хуки

Каждый хук изолирует одну подсистему. App.tsx только подписывается на их состояние и вызывает их методы.

## useSpeechRecognition

**Файл:** `src/hooks/useSpeechRecognition.ts`

Управляет полным циклом голосового ввода: AudioContext → AudioWorklet → Vosk → транскрипт.

**Принимает:** `modelUrl: string`

**Возвращает:**
| Поле | Тип | Описание |
|------|-----|----------|
| `isRecording` | `boolean` | Идёт ли запись |
| `isModelLoading` | `boolean` | Загружается ли модель Vosk |
| `transcript` | `string` | Финальный транскрипт |
| `partialTranscript` | `string` | Промежуточный результат |
| `error` | `string` | Сообщение об ошибке |
| `startRecording()` | `() => Promise<void>` | Запустить запись |
| `stopRecording()` | `() => void` | Остановить запись |
| `clearTranscript()` | `() => void` | Очистить тексты и ошибки |
| `dispose()` | `() => void` | Освободить Vosk-модель и аудиоресурсы |

**VAD:** RMS-порог `VOICE_ACTIVITY_THRESHOLD`. Молчание дольше `SILENCE_TIMEOUT_MS` — запись останавливается автоматически.

---

## useTranslation

**Файл:** `src/hooks/useTranslation.ts`

Управляет Web Worker перевода: инициализация, warmup, дебаунс, request ID.

**Возвращает:**
| Поле | Тип | Описание |
|------|-----|----------|
| `isTranslating` | `boolean` | Идёт ли перевод |
| `translatedText` | `string` | Последний успешный перевод |
| `translationError` | `string` | Ошибка перевода |
| `translate(text)` | `(text: string) => void` | Запустить перевод с дебаунсом |
| `clearTranslation()` | `() => void` | Очистить состояние |

**Дебаунс:** `TRANSLATION_DEBOUNCE_MS` после последнего вызова `translate()`.

---

## useSpeechSynthesis

**Файл:** `src/hooks/useSpeechSynthesis.ts`

Обёртка над `window.speechSynthesis` с подбором голоса по языку.

**Возвращает:**
| Поле | Тип | Описание |
|------|-----|----------|
| `isSpeaking` | `boolean` | Идёт ли озвучка |
| `speak(text, lang)` | `(text: string, lang: string) => void` | Озвучить текст |
| `stop()` | `() => void` | Остановить озвучку |

---

## usePWAInstall

**Файл:** `src/hooks/usePWAInstall.ts`

Перехватывает `beforeinstallprompt` и управляет состоянием установки PWA.

**Возвращает:**
| Поле | Тип | Описание |
|------|-----|----------|
| `isInstalled` | `boolean` | Приложение установлено как PWA |
| `isInstallAvailable` | `boolean` | Браузер предлагает установку |
| `install()` | `() => Promise<void>` | Показать диалог установки |
