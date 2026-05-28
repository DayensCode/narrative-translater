# Компоненты

Все UI-компоненты — презентационные. Сайд-эффекты и состояние живут в хуках
и `App.tsx`.

## `TopBar`

Hero-блок главного экрана:

- Бренд, eyebrow, live-статус (`isRecording` / `isTranscribing` / …).
- Два селекта (source / target language) с кнопкой swap между ними.
- Ghost-кнопки «очистить» и «настройки».
- `data-tour-id` атрибуты используются `OnboardingOverlay` как якоря.

## `Panes`

Двухколоночные панели «source / target»:

- Source — редактируемый `<textarea>` (можно править распознанный текст).
- Target — read-only-представление перевода.
- В CSS выставлены `overflow-wrap: anywhere` и `word-break: break-word`,
  чтобы длинные токены/URL не растягивали контейнер.

## `Controls`

Действия записи и воспроизведения:

- Record toggle (mic), tied to `isRecording`.
- Speak/Stop для `useSpeechSynthesis`.
- Индикатор загрузки модели (`modelLoadingProgress`, `modelLoadingStage`).

## `SettingsPage`

Экран настроек:

- Выбор темы (`system / light / dark`).
- Выбор языка UI — список из `UI_LOCALES`.
- Управление списком NLLB-языков (добавить/удалить, запрет на удаление
  последнего).
- Кнопка «установить приложение», если `isInstallAvailable`.

## `OnboardingOverlay`

Показывает туториал поверх UI:

- Подсвечивает элемент по CSS-селектору (через `getBoundingClientRect`).
- Ресайз и скролл окна отслеживаются с rAF-троттлингом. Scroll listener
  помечен `passive: true`.
- Шаги передаются через props; конкретные последовательности описаны в
  `src/pages/main-onboarding-steps.ts` и
  `src/pages/settings-onboarding-steps.ts`.

## `Loader`

Fallback для `Suspense`: показывает простой индикатор пока грузится
ленивый чанк.
