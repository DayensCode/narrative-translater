# Компоненты

Все компоненты в `src/components/` — presentational: они не имеют собственного состояния и side effects. Вся логика находится в хуках и App.tsx.

## TopBar

**Файл:** `src/components/TopBar.tsx`

Верхняя панель приложения.

**Props:**
| Prop | Тип | Описание |
|------|-----|----------|
| `isRecording` | `boolean` | Отображает статус «Слушаю...» |
| `isModelLoading` | `boolean` | Отображает статус «Загрузка Vosk...» |
| `isTranslating` | `boolean` | Отображает статус «Перевод...» |
| `isInstalled` | `boolean` | Меняет текст кнопки установки |
| `isInstallAvailable` | `boolean` | Включает/выключает кнопку установки |
| `canClear` | `boolean` | Включает/выключает кнопку «Очистить» |
| `onClear` | `() => void` | Обработчик очистки |
| `onInstall` | `() => void` | Обработчик установки PWA |

---

## Panes

**Файл:** `src/components/Panes.tsx`

Две панели: русский текст (транскрипт) и английский (перевод).

**Props:**
| Prop | Тип | Описание |
|------|-----|----------|
| `transcript` | `string` | Финальный транскрипт |
| `partialTranscript` | `string` | Промежуточный результат (отображается мельче) |
| `translatedText` | `string` | Перевод |

---

## Controls

**Файл:** `src/components/Controls.tsx`

Нижняя панель с тремя круглыми кнопками.

**Props:**
| Prop | Тип | Описание |
|------|-----|----------|
| `isRecording` | `boolean` | Переключает иконку микрофона/стопа |
| `isSpeaking` | `boolean` | Включает кнопку «Остановить озвучку» |
| `canRecord` | `boolean` | Отключает кнопку микрофона во время загрузки |
| `canSpeak` | `boolean` | Отключает кнопку озвучки при отсутствии текста |
| `onToggleRecording` | `() => void` | Старт/стоп записи |
| `onSpeak` | `() => void` | Запуск озвучки |
| `onStopSpeaking` | `() => void` | Остановка озвучки |
