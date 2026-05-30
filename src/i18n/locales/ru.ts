const ru = {
  translation: {
    appName: "Narrative",
    seoTitle: "Narrative — офлайн переводчик речи в реальном времени",
    seoDescription:
    "PWA-приложение для локального распознавания русской речи, мгновенного перевода и озвучки результата прямо в браузере.",
    heroEyebrow: "Offline speech translation",
    heroTitle: "Голос. Пауза. Перевод.",
    heroLead:
    "Редакционный интерфейс для мгновенного перевода речи с локальной обработкой, переключением темы и мультиязычным UI.",
    browserHint: "Интерфейс подстраивается под язык и тему браузера.",
    sourcePane: "Исходная речь",
    targetPane: "Перевод",
    sourcePlaceholder: "Начните говорить, и текст появится здесь.",
    partialLabel: "Промежуточное распознавание",
    targetPlaceholder: "Перевод появится после короткой паузы.",
    clear: "Очистить",
    settings: "Настройки",
    back: "Назад",
    install: "Установить",
    installed: "Установлено",
    interfaceLanguage: "Язык интерфейса",
    sourceLanguage: "Язык оригинала",
    swapLanguages: "Поменять языки",
    translationLanguage: "Язык перевода",
    theme: "Тема",
    themeSystem: "Системная",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    listenAction: "Слушать",
    stopListeningAction: "Стоп запись",
    speakAction: "Озвучить",
    stopSpeechAction: "Стоп звук",
    statusReady: "Готово",
    statusListening: "Слушаю",
    statusModelLoading: "Загрузка модели распознавания",
    statusTranscribing: "Распознаю речь",
    statusTranslating: "Перевод",
    statusInstalled: "PWA готово к офлайн-работе",
    loadingScreenTitle: "Подготавливаем Narrative к работе",
    loadingScreenProcessLabel: "Текущий процесс",
    loadingStageLoadingModel: "Loading model",
    loadingStageInitializingModel: "Инициализация модели",
    loadingStageReady: "Модель готова",
    loadingTipOffline: "Офлайн: модель и перевод работают прямо в браузере.",
    loadingTipPrivacy: "Конфиденциально: голос и текст остаются на устройстве.",
    loadingTipPwa: "Установите PWA в настройках для быстрого запуска с рабочего стола.",
    loadingTipLocalCompute: "Чем мощнее устройство, тем быстрее старт и распознавание.",
    statusBrowserLocale: "Язык браузера",
    statusTarget: "Целевой язык",
    statusTheme: "Текущая тема",
    translationOnlyFromRussian:
    "Распознавание речи сейчас работает на русском, но перевод можно направлять на несколько языков.",
    noVoiceOutput: "Для выбранного языка браузер может не дать подходящий голос.",
    synthesisErrorNoLocalVoice:
    "В системе нет локального голоса для этого языка. Установите языковой пакет в настройках ОС или разрешите облачные голоса в настройках приложения.",
    synthesisErrorNoVoice: "В браузере нет голоса для этого языка.",
    synthesisErrorGeneric: "Не удалось воспроизвести речь.",
    onboardingIntroTitle: "Что умеет Narrative",
    onboardingIntroDescription:
    "Приложение локально распознаёт речь, переводит текст и позволяет озвучить результат прямо в браузере.",
    onboardingStatusTitle: "Статус в реальном времени",
    onboardingStatusDescription:
    "Здесь видно текущее состояние: приложение слушает, переводит или готово к работе.",
    onboardingSourceLanguageTitle: "Выберите язык оригинала",
    onboardingSourceLanguageDescription:
    "Здесь задаётся язык входящей речи до начала записи.",
    onboardingTargetLanguageTitle: "Выберите язык перевода",
    onboardingTargetLanguageDescription:
    "Укажите язык, на который должен переводиться распознанный текст.",
    onboardingSwapTitle: "Быстрая смена языков",
    onboardingSwapDescription:
    "Эта кнопка мгновенно меняет местами язык оригинала и язык перевода.",
    onboardingSourcePaneTitle: "Панель исходного текста",
    onboardingSourcePaneDescription:
    "В левой панели находится рабочая область для распознанной речи и ручного ввода.",
    onboardingSourceInputTitle: "Поле исходного текста",
    onboardingSourceInputDescription:
    "Сюда попадает распознанная речь, и текст можно отредактировать вручную.",
    onboardingListenButtonTitle: "Запуск и остановка записи",
    onboardingListenButtonDescription:
    "Нажмите кнопку микрофона, чтобы начать или остановить прослушивание.",
    onboardingTargetPaneTitle: "Область перевода",
    onboardingTargetPaneDescription:
    "Здесь появляется результат перевода в выбранный целевой язык.",
    onboardingTranslationNoteTitle: "Ограничения распознавания",
    onboardingTranslationNoteDescription:
    "В этом блоке показаны важные текущие ограничения распознавания речи.",
    onboardingSpeakButtonTitle: "Озвучка текста",
    onboardingSpeakButtonDescription:
    "Используйте эту кнопку, чтобы прослушать исходный текст или перевод.",
    onboardingStopSpeechTitle: "Остановить озвучку",
    onboardingStopSpeechDescription:
    "Если озвучка уже идёт, эта кнопка сразу прерывает воспроизведение.",
    onboardingClearTitle: "Очистка сессии",
    onboardingClearDescription:
    "Кнопка очищает исходный текст и перевод, чтобы быстро начать новый сценарий.",
    onboardingSettingsTitle: "Откройте настройки",
    onboardingSettingsDescription:
    "В настройках меняются тема, язык интерфейса и установка приложения.",
    onboardingSettingsPageIntroTitle: "Обзор настроек",
    onboardingSettingsPageIntroDescription:
    "На этой странице вы управляете интерфейсом, списком языков перевода и установкой приложения.",
    onboardingSettingsBackTitle: "Возврат к переводу",
    onboardingSettingsBackDescription:
    "Эта кнопка возвращает вас на главный экран перевода.",
    onboardingSettingsUiLanguageTitle: "Язык интерфейса",
    onboardingSettingsUiLanguageDescription:
    "Изменяет язык меню, подписей и подсказок приложения.",
    onboardingSettingsThemeTitle: "Выбор темы",
    onboardingSettingsThemeDescription:
    "Переключение между системной, светлой и тёмной темами.",
    onboardingSettingsLanguagesTitle: "Набор языков перевода",
    onboardingSettingsLanguagesDescription:
    "Здесь настраивается список языков, доступных на главном экране для перевода.",
    onboardingSettingsSearchTitle: "Поиск и управление языками",
    onboardingSettingsSearchDescription:
    "Ищите языки по названию и добавляйте или удаляйте их из активного списка.",
    onboardingSettingsPrivacyTitle: "Приватность и локальные голоса",
    onboardingSettingsPrivacyDescription:
    "Эта секция отвечает за конфиденциальность. Включите тумблер, чтобы озвучка использовала только локальные голоса и текст не уходил в облачный TTS.",
    onboardingSettingsWipeDataTitle: "Стереть все локальные данные",
    onboardingSettingsWipeDataDescription:
    "Удаляет настройки, кешированные модели (~1.5 ГБ) и Service Worker — один тап, чтобы не оставить локального следа сессии.",
    onboardingSettingsInstallTitle: "Установка приложения",
    onboardingSettingsInstallDescription:
    "Установите Narrative на устройство для быстрого запуска и удобной офлайн-работы.",
    onboardingTapHint: "Нажмите в любом месте, чтобы перейти дальше",
    onboardingProgress: "Шаг {{currentStep}} из {{totalSteps}}",
    clearConfirm: "Удалить распознанный текст и перевод?",
    privacy: "Приватность",
    localTtsOnly: "Только локальные голоса озвучки",
    localTtsOnlyDescription:
    "Некоторые системные голоса отправляют текст в облако. Когда включено, Narrative использует только голоса, помеченные как локальные.",
    wipeData: "Стереть все данные",
    wipeDataDescription:
    "Удаляет настройки, кешированные модели и данные Service Worker. После этого приложение перезагрузится.",
    wipeDataConfirm:
    "Будут удалены все сохранённые данные: настройки, кешированные модели (~1.5 ГБ) и Service Worker. Продолжить?",
    wipeDataDone: "Все локальные данные удалены.",
    mobileBlockTitle: "Только для компьютера",
    mobileBlockBody:
      "Приложение использует тяжёлые AI‑модели прямо в браузере. На мобильных устройствах памяти не хватает для стабильной работы. Откройте Narrative на ноутбуке или ПК.",
    updateAvailableTitle: "Доступна новая версия",
    updateAvailableAction: "Обновить",
    updateAvailableLater: "Позже",
    languages: {
    ru: "Русский",
    en: "English",
    zh: "中文",
    hi: "हिन्दी",
    es: "Español",
    ar: "العربية",
    fr: "Français",
    },
  },
} as const;

export default ru;
