# Компоненты

## Общий принцип

Компоненты в `src/components` не содержат тяжёлой бизнес-логики. Они получают готовые данные и обработчики сверху, в основном из `App.tsx` и route-обёрток.

## TopBar

Файл: `src/components/TopBar/TopBar.tsx`

Назначение:

- показывает верхнюю панель приложения
- отображает статус
- даёт выбрать source/target language
- содержит действия `Clear` и `Settings`

Основные props:

| Prop | Тип |
|------|-----|
| `appName` | `string` |
| `eyebrow` | `string` |
| `status` | `string` |
| `sourceLanguageLabel` | `string` |
| `selectedSourceLanguage` | `SourceLanguageCode` |
| `sourceLanguageOptions` | `Array<{ value: SourceLanguageCode; label: string }>` |
| `onSourceLanguageChange` | `(language: SourceLanguageCode) => void` |
| `swapLanguagesLabel` | `string` |
| `onSwapLanguages` | `() => void` |
| `translationLanguageLabel` | `string` |
| `selectedTargetLanguage` | `TranslationLanguageCode` |
| `translationLanguageOptions` | `Array<{ value: TranslationLanguageCode; label: string }>` |
| `onTargetLanguageChange` | `(language: TranslationLanguageCode) => void` |
| `clearLabel` | `string` |
| `canClear` | `boolean` |
| `onClear` | `() => void` |
| `settingsLabel` | `string` |
| `onOpenSettings` | `() => void` |

## Panes

Файл: `src/components/Panes/Panes.tsx`

Назначение:

- рендерит source pane и target pane
- показывает финальный transcript
- отдельно выводит partial transcript
- показывает note о текущих ограничениях перевода

Props:

| Prop | Тип |
|------|-----|
| `sourceTitle` | `string` |
| `targetTitle` | `string` |
| `sourceLanguageLabel` | `string` |
| `targetLanguageLabel` | `string` |
| `transcript` | `string` |
| `partialTranscript` | `string` |
| `translatedText` | `string` |
| `sourcePlaceholder` | `string` |
| `targetPlaceholder` | `string` |
| `partialLabel` | `string` |
| `translationNote` | `string` |

## Controls

Файл: `src/components/Controls/Controls.tsx`

Назначение:

- управляет началом и остановкой записи
- запускает озвучку
- останавливает текущую озвучку

Props:

| Prop | Тип |
|------|-----|
| `isRecording` | `boolean` |
| `isSpeaking` | `boolean` |
| `canRecord` | `boolean` |
| `canSpeak` | `boolean` |
| `listenLabel` | `string` |
| `stopListeningLabel` | `string` |
| `speakLabel` | `string` |
| `stopSpeechLabel` | `string` |
| `onToggleRecording` | `() => void` |
| `onSpeak` | `() => void` |
| `onStopSpeaking` | `() => void` |

## SettingsPage

Файл: `src/components/SettingsPage/SettingsPage.tsx`

Назначение:

- показывает экран настроек
- меняет язык интерфейса
- меняет тему
- рендерит кнопку установки PWA, если установка доступна

Props:

| Prop | Тип |
|------|-----|
| `backLabel` | `string` |
| `title` | `string` |
| `themeLabel` | `string` |
| `theme` | `ThemeMode` |
| `themeOptions` | `Array<{ value: ThemeMode; label: string }>` |
| `onThemeChange` | `(theme: ThemeMode) => void` |
| `interfaceLanguageLabel` | `string` |
| `selectedUiLanguage` | `UiLocale` |
| `uiLanguageOptions` | `Array<{ value: UiLocale; label: string }>` |
| `onUiLanguageChange` | `(language: UiLocale) => void` |
| `installLabel` | `string` |
| `isInstalled` | `boolean` |
| `isInstallAvailable` | `boolean` |
| `onInstall` | `() => void` |
| `onBack` | `() => void` |

## Loader

Файл: `src/components/Loader/Loader.tsx`

Назначение:

- используется как `Suspense` fallback для lazy-loaded routes
- показывает статусный текст и индикатор загрузки

Props:

| Prop | Тип |
|------|-----|
| `label` | `string` |
