import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const UI_LOCALES = ["ru", "en", "zh", "hi", "es", "ar", "fr"] as const;
export type UiLocale = (typeof UI_LOCALES)[number];

const resources = {
  ru: {
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
      onboardingSettingsInstallTitle: "Установка приложения",
      onboardingSettingsInstallDescription:
        "Установите Narrative на устройство для быстрого запуска и удобной офлайн-работы.",
      onboardingTapHint: "Нажмите в любом месте, чтобы перейти дальше",
      onboardingProgress: "Шаг {{currentStep}} из {{totalSteps}}",
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
  },
  en: {
    translation: {
      appName: "Narrative",
      seoTitle: "Narrative — offline real-time speech translator",
      seoDescription:
        "PWA for local speech recognition, instant translation, and voice playback directly in the browser.",
      heroEyebrow: "Offline speech translation",
      heroTitle: "Voice. Pause. Translation.",
      heroLead:
        "An editorial-style interface for instant speech translation with local processing, theme switching, and multilingual UI.",
      browserHint: "The interface follows the browser language and preferred color scheme.",
      sourcePane: "Source speech",
      targetPane: "Translation",
      sourcePlaceholder: "Start speaking and the transcript will appear here.",
      partialLabel: "Live recognition",
      targetPlaceholder: "The translation will appear after a short pause.",
      clear: "Clear",
      settings: "Settings",
      back: "Back",
      install: "Install",
      installed: "Installed",
      interfaceLanguage: "Interface language",
      sourceLanguage: "Source language",
      swapLanguages: "Swap languages",
      translationLanguage: "Translation language",
      theme: "Theme",
      themeSystem: "System",
      themeLight: "Light",
      themeDark: "Dark",
      listenAction: "Listen",
      stopListeningAction: "Stop recording",
      speakAction: "Speak",
      stopSpeechAction: "Stop voice",
      statusReady: "Ready",
      statusListening: "Listening",
      statusModelLoading: "Loading speech model",
      statusTranscribing: "Recognizing speech",
      statusTranslating: "Translating",
      statusInstalled: "PWA is ready for offline use",
      loadingScreenTitle: "Preparing Narrative",
      loadingScreenProcessLabel: "Current process",
      loadingStageLoadingModel: "Loading model",
      loadingStageInitializingModel: "Initializing model",
      loadingStageReady: "Model ready",
      loadingTipOffline: "Offline-first: recognition and translation run in your browser.",
      loadingTipPrivacy: "Private by default: your speech and text stay on-device.",
      loadingTipPwa: "Install as PWA from Settings for faster launch and easier access.",
      loadingTipLocalCompute: "Faster devices load the model and transcribe quicker.",
      statusBrowserLocale: "Browser language",
      statusTarget: "Target language",
      statusTheme: "Current theme",
      translationOnlyFromRussian:
        "Speech recognition currently runs in Russian, but translation can be sent to multiple languages.",
      noVoiceOutput:
        "Your browser may not provide a matching voice for the selected language.",
      onboardingIntroTitle: "What Narrative does",
      onboardingIntroDescription:
        "The app recognizes speech locally, translates text, and can read results aloud right in your browser.",
      onboardingStatusTitle: "Real-time status",
      onboardingStatusDescription:
        "This indicator shows whether the app is listening, translating, or ready.",
      onboardingSourceLanguageTitle: "Choose source language",
      onboardingSourceLanguageDescription:
        "Set the language of incoming speech before recording starts.",
      onboardingTargetLanguageTitle: "Choose target language",
      onboardingTargetLanguageDescription:
        "Select the language you want the recognized text to be translated into.",
      onboardingSwapTitle: "Quick language swap",
      onboardingSwapDescription:
        "Use this button to instantly swap source and target languages.",
      onboardingSourcePaneTitle: "Source workspace",
      onboardingSourcePaneDescription:
        "The left panel is your workspace for recognized speech and manual text input.",
      onboardingSourceInputTitle: "Source text area",
      onboardingSourceInputDescription:
        "Recognized speech appears here, and you can edit this text manually.",
      onboardingListenButtonTitle: "Start and stop recording",
      onboardingListenButtonDescription:
        "Use the microphone button to start or stop listening.",
      onboardingTargetPaneTitle: "Translation area",
      onboardingTargetPaneDescription:
        "The translation result appears here in your selected target language.",
      onboardingTranslationNoteTitle: "Recognition limits",
      onboardingTranslationNoteDescription:
        "This note explains current speech-recognition limits so expectations stay clear.",
      onboardingSpeakButtonTitle: "Voice playback",
      onboardingSpeakButtonDescription:
        "Use this button to play source text or translated text as speech.",
      onboardingStopSpeechTitle: "Stop playback",
      onboardingStopSpeechDescription:
        "If speech is currently playing, stop it immediately with this button.",
      onboardingClearTitle: "Reset the session",
      onboardingClearDescription:
        "Clear both source and translated text to start a new translation flow.",
      onboardingSettingsTitle: "Open settings",
      onboardingSettingsDescription:
        "Settings let you change theme, interface language, and install the app.",
      onboardingSettingsPageIntroTitle: "Settings overview",
      onboardingSettingsPageIntroDescription:
        "This page controls interface preferences, translation languages, and install options.",
      onboardingSettingsBackTitle: "Back to translator",
      onboardingSettingsBackDescription:
        "Use this button to return to the main translation workspace.",
      onboardingSettingsUiLanguageTitle: "Interface language",
      onboardingSettingsUiLanguageDescription:
        "Change the app language used by menus, labels, and helper text.",
      onboardingSettingsThemeTitle: "Theme selection",
      onboardingSettingsThemeDescription:
        "Switch between system, light, and dark themes.",
      onboardingSettingsLanguagesTitle: "Translation languages set",
      onboardingSettingsLanguagesDescription:
        "Manage which translation languages are available on the main translation screen.",
      onboardingSettingsSearchTitle: "Search and manage languages",
      onboardingSettingsSearchDescription:
        "Search by language name and add or remove languages from your active list.",
      onboardingSettingsInstallTitle: "Install the app",
      onboardingSettingsInstallDescription:
        "Install Narrative on your device for faster access and smoother offline use.",
      onboardingTapHint: "Tap anywhere to continue",
      onboardingProgress: "Step {{currentStep}} of {{totalSteps}}",
      languages: {
        ru: "Russian",
        en: "English",
        zh: "Chinese",
        hi: "Hindi",
        es: "Spanish",
        ar: "Arabic",
        fr: "French",
      },
    },
  },
  zh: {
    translation: {
      appName: "Narrative",
      seoTitle: "Narrative — 离线实时语音翻译器",
      seoDescription: "一款可在浏览器中本地完成语音识别、即时翻译和语音播报的 PWA 应用。",
      heroEyebrow: "离线语音翻译",
      heroTitle: "语音。停顿。翻译。",
      heroLead: "具有编辑感的即时语音翻译界面，支持本地处理、主题切换和多语言 UI。",
      browserHint: "界面会跟随浏览器语言和颜色方案。",
      sourcePane: "原始语音",
      targetPane: "翻译结果",
      sourcePlaceholder: "开始说话，转写内容会显示在这里。",
      partialLabel: "实时识别",
      targetPlaceholder: "短暂停顿后会显示翻译。",
      clear: "清空",
      settings: "设置",
      back: "返回",
      install: "安装",
      installed: "已安装",
      interfaceLanguage: "界面语言",
      sourceLanguage: "原文语言",
      swapLanguages: "互换语言",
      translationLanguage: "翻译语言",
      theme: "主题",
      themeSystem: "跟随系统",
      themeLight: "浅色",
      themeDark: "深色",
      listenAction: "开始收听",
      stopListeningAction: "停止录音",
      speakAction: "朗读",
      stopSpeechAction: "停止语音",
      statusReady: "已就绪",
      statusListening: "正在收听",
      statusModelLoading: "正在加载语音模型",
      statusTranscribing: "正在识别语音",
      statusTranslating: "正在翻译",
      statusInstalled: "PWA 已可离线使用",
      loadingScreenTitle: "正在准备 Narrative",
      loadingScreenProcessLabel: "当前进度",
      loadingStageLoadingModel: "正在加载模型",
      loadingStageInitializingModel: "正在初始化模型",
      loadingStageReady: "模型已就绪",
      loadingTipOffline: "离线可用：识别和翻译都在浏览器内完成。",
      loadingTipPrivacy: "隐私优先：语音与文本保留在本设备上。",
      loadingTipPwa: "在设置中安装 PWA，可更快启动并便捷访问。",
      loadingTipLocalCompute: "设备性能越好，模型加载与识别越快。",
      statusBrowserLocale: "浏览器语言",
      statusTarget: "目标语言",
      statusTheme: "当前主题",
      translationOnlyFromRussian: "当前语音识别仅支持俄语，但翻译可输出到多个语言。",
      noVoiceOutput: "浏览器可能无法为所选语言提供合适的语音。",
      onboardingIntroTitle: "Narrative 能做什么",
      onboardingIntroDescription:
        "该应用可在本地识别语音、翻译文本，并在浏览器中朗读结果。",
      onboardingStatusTitle: "实时状态",
      onboardingStatusDescription:
        "此指示会显示应用当前是在监听、翻译还是就绪。",
      onboardingSourceLanguageTitle: "选择源语言",
      onboardingSourceLanguageDescription:
        "开始录音前先设置输入语音的语言。",
      onboardingTargetLanguageTitle: "选择目标语言",
      onboardingTargetLanguageDescription:
        "选择要翻译到的目标语言。",
      onboardingSwapTitle: "快速交换语言",
      onboardingSwapDescription:
        "一键交换源语言和目标语言。",
      onboardingSourcePaneTitle: "源文本工作区",
      onboardingSourcePaneDescription:
        "左侧面板用于显示识别结果，也可手动编辑输入。",
      onboardingSourceInputTitle: "源文本输入区",
      onboardingSourceInputDescription:
        "识别出的语音会显示在这里，也可以手动修改。",
      onboardingListenButtonTitle: "开始/停止录音",
      onboardingListenButtonDescription:
        "使用麦克风按钮开始或停止监听。",
      onboardingTargetPaneTitle: "翻译结果区域",
      onboardingTargetPaneDescription:
        "翻译结果会在短暂停顿后显示在这里。",
      onboardingTranslationNoteTitle: "识别限制说明",
      onboardingTranslationNoteDescription:
        "这里会说明当前语音识别的限制，便于预期管理。",
      onboardingSpeakButtonTitle: "语音播放",
      onboardingSpeakButtonDescription:
        "使用此按钮朗读源文本或译文。",
      onboardingStopSpeechTitle: "停止播放",
      onboardingStopSpeechDescription:
        "若正在播放语音，可用此按钮立即停止。",
      onboardingClearTitle: "重置当前会话",
      onboardingClearDescription:
        "清空源文本和译文，快速开始新的翻译流程。",
      onboardingSettingsTitle: "打开设置",
      onboardingSettingsDescription:
        "可在设置中更改主题、界面语言并安装应用。",
      onboardingSettingsPageIntroTitle: "设置页概览",
      onboardingSettingsPageIntroDescription:
        "此页面用于管理界面偏好、翻译语言和安装选项。",
      onboardingSettingsBackTitle: "返回翻译页",
      onboardingSettingsBackDescription:
        "点击此按钮回到主翻译页面。",
      onboardingSettingsUiLanguageTitle: "界面语言",
      onboardingSettingsUiLanguageDescription:
        "更改菜单、标签和提示文案的显示语言。",
      onboardingSettingsThemeTitle: "主题选择",
      onboardingSettingsThemeDescription:
        "在系统、浅色和深色主题之间切换。",
      onboardingSettingsLanguagesTitle: "翻译语言列表",
      onboardingSettingsLanguagesDescription:
        "管理主界面可选的翻译语言。",
      onboardingSettingsSearchTitle: "搜索并管理语言",
      onboardingSettingsSearchDescription:
        "按名称搜索语言，并加入或移出当前列表。",
      onboardingSettingsInstallTitle: "安装应用",
      onboardingSettingsInstallDescription:
        "将 Narrative 安装到设备，获得更快启动和更顺畅离线体验。",
      onboardingTapHint: "点击任意位置继续",
      onboardingProgress: "第 {{currentStep}} 步，共 {{totalSteps}} 步",
      languages: {
        ru: "俄语",
        en: "英语",
        zh: "中文",
        hi: "印地语",
        es: "西班牙语",
        ar: "阿拉伯语",
        fr: "法语",
      },
    },
  },
  hi: {
    translation: {
      appName: "Narrative",
      seoTitle: "Narrative — ऑफलाइन रीयल-टाइम स्पीच ट्रांसलेटर",
      seoDescription:
        "ब्राउज़र में स्थानीय स्पीच रिकग्निशन, तुरंत अनुवाद और वॉइस प्लेबैक के लिए PWA ऐप।",
      heroEyebrow: "ऑफलाइन स्पीच ट्रांसलेशन",
      heroTitle: "आवाज़। विराम। अनुवाद।",
      heroLead:
        "लोकल प्रोसेसिंग, थीम स्विचिंग और मल्टीलिंगुअल UI के साथ एक एडिटोरियल-स्टाइल इंटरफ़ेस।",
      browserHint: "इंटरफ़ेस ब्राउज़र की भाषा और थीम के अनुसार बदलता है।",
      sourcePane: "मूल भाषण",
      targetPane: "अनुवाद",
      sourcePlaceholder: "बोलना शुरू करें, ट्रांसक्रिप्ट यहाँ दिखेगा।",
      partialLabel: "लाइव पहचान",
      targetPlaceholder: "थोड़े विराम के बाद अनुवाद यहाँ दिखेगा।",
      clear: "साफ़ करें",
      settings: "सेटिंग्स",
      back: "वापस",
      install: "इंस्टॉल करें",
      installed: "इंस्टॉल हो चुका है",
      interfaceLanguage: "इंटरफ़ेस भाषा",
      sourceLanguage: "मूल भाषा",
      swapLanguages: "भाषाएँ बदलें",
      translationLanguage: "अनुवाद भाषा",
      theme: "थीम",
      themeSystem: "सिस्टम",
      themeLight: "लाइट",
      themeDark: "डार्क",
      listenAction: "सुनना शुरू करें",
      stopListeningAction: "रिकॉर्डिंग रोकें",
      speakAction: "बोलकर सुनाएँ",
      stopSpeechAction: "आवाज़ रोकें",
      statusReady: "तैयार",
      statusListening: "सुन रहा है",
      statusModelLoading: "स्पीच मॉडल लोड हो रहा है",
      statusTranscribing: "भाषण पहचाना जा रहा है",
      statusTranslating: "अनुवाद हो रहा है",
      statusInstalled: "PWA ऑफलाइन उपयोग के लिए तैयार है",
      loadingScreenTitle: "Narrative तैयार किया जा रहा है",
      loadingScreenProcessLabel: "वर्तमान प्रक्रिया",
      loadingStageLoadingModel: "मॉडल लोड हो रहा है",
      loadingStageInitializingModel: "मॉडल प्रारंभ किया जा रहा है",
      loadingStageReady: "मॉडल तैयार है",
      loadingTipOffline: "ऑफलाइन-फर्स्ट: पहचान और अनुवाद ब्राउज़र में ही चलते हैं।",
      loadingTipPrivacy: "डिफ़ॉल्ट रूप से निजी: आवाज़ और टेक्स्ट डिवाइस पर ही रहते हैं।",
      loadingTipPwa: "तेज़ लॉन्च और आसान एक्सेस के लिए सेटिंग्स से PWA इंस्टॉल करें।",
      loadingTipLocalCompute: "तेज़ डिवाइस पर मॉडल लोड और ट्रांसक्रिप्शन जल्दी होता है।",
      statusBrowserLocale: "ब्राउज़र भाषा",
      statusTarget: "लक्ष्य भाषा",
      statusTheme: "वर्तमान थीम",
      translationOnlyFromRussian:
        "अभी स्पीच रिकग्निशन रूसी में चलता है, लेकिन अनुवाद कई भाषाओं में भेजा जा सकता है।",
      noVoiceOutput: "ब्राउज़र चुनी हुई भाषा के लिए उपयुक्त आवाज़ न दे सके।",
      onboardingIntroTitle: "Narrative क्या करता है",
      onboardingIntroDescription:
        "यह ऐप लोकल रूप से स्पीच पहचानता है, टेक्स्ट का अनुवाद करता है और परिणाम को आवाज़ में पढ़ सकता है।",
      onboardingStatusTitle: "रियल-टाइम स्थिति",
      onboardingStatusDescription:
        "यह संकेतक दिखाता है कि ऐप सुन रहा है, अनुवाद कर रहा है या तैयार है।",
      onboardingSourceLanguageTitle: "स्रोत भाषा चुनें",
      onboardingSourceLanguageDescription:
        "रिकॉर्डिंग शुरू करने से पहले इनपुट स्पीच की भाषा सेट करें।",
      onboardingTargetLanguageTitle: "लक्ष्य भाषा चुनें",
      onboardingTargetLanguageDescription:
        "जिस भाषा में अनुवाद चाहिए, उसे चुनें।",
      onboardingSwapTitle: "भाषाएँ जल्दी बदलें",
      onboardingSwapDescription:
        "एक टैप में स्रोत और लक्ष्य भाषा आपस में बदल जाती हैं।",
      onboardingSourcePaneTitle: "स्रोत कार्यक्षेत्र",
      onboardingSourcePaneDescription:
        "बाएँ पैनल में पहचाना गया भाषण दिखता है और आप टेक्स्ट को मैन्युअली संपादित कर सकते हैं।",
      onboardingSourceInputTitle: "स्रोत टेक्स्ट क्षेत्र",
      onboardingSourceInputDescription:
        "पहचाना गया भाषण यहाँ दिखाई देता है और आप इसे बदल भी सकते हैं।",
      onboardingListenButtonTitle: "रिकॉर्डिंग शुरू/बंद करें",
      onboardingListenButtonDescription:
        "माइक्रोफ़ोन बटन से सुनना शुरू करें या रोकें।",
      onboardingTargetPaneTitle: "अनुवाद क्षेत्र",
      onboardingTargetPaneDescription:
        "थोड़े विराम के बाद अनुवाद परिणाम यहाँ दिखाई देता है।",
      onboardingTranslationNoteTitle: "पहचान की सीमाएँ",
      onboardingTranslationNoteDescription:
        "यह नोट वर्तमान स्पीच पहचान सीमाओं को समझाता है, ताकि अपेक्षाएँ स्पष्ट रहें।",
      onboardingSpeakButtonTitle: "वॉइस प्लेबैक",
      onboardingSpeakButtonDescription:
        "इस बटन से स्रोत टेक्स्ट या अनुवाद को आवाज़ में सुनें।",
      onboardingStopSpeechTitle: "प्लेबैक रोकें",
      onboardingStopSpeechDescription:
        "यदि आवाज़ चल रही है, तो इस बटन से तुरंत रोकें।",
      onboardingClearTitle: "सेशन रीसेट करें",
      onboardingClearDescription:
        "स्रोत और अनुवादित टेक्स्ट साफ़ करके नया अनुवाद फ्लो शुरू करें।",
      onboardingSettingsTitle: "सेटिंग्स खोलें",
      onboardingSettingsDescription:
        "यहाँ आप थीम, इंटरफ़ेस भाषा और ऐप इंस्टॉल विकल्प बदल सकते हैं।",
      onboardingSettingsPageIntroTitle: "सेटिंग्स अवलोकन",
      onboardingSettingsPageIntroDescription:
        "इस पेज पर इंटरफ़ेस प्राथमिकताएँ, अनुवाद भाषाएँ और इंस्टॉल विकल्प नियंत्रित होते हैं।",
      onboardingSettingsBackTitle: "अनुवाद स्क्रीन पर लौटें",
      onboardingSettingsBackDescription:
        "इस बटन से मुख्य अनुवाद स्क्रीन पर वापस जाएँ।",
      onboardingSettingsUiLanguageTitle: "इंटरफ़ेस भाषा",
      onboardingSettingsUiLanguageDescription:
        "मेनू, लेबल और सहायक टेक्स्ट की भाषा बदलें।",
      onboardingSettingsThemeTitle: "थीम चयन",
      onboardingSettingsThemeDescription:
        "सिस्टम, लाइट और डार्क थीम के बीच बदलें।",
      onboardingSettingsLanguagesTitle: "अनुवाद भाषाओं का सेट",
      onboardingSettingsLanguagesDescription:
        "मुख्य स्क्रीन पर उपलब्ध अनुवाद भाषाओं की सूची प्रबंधित करें।",
      onboardingSettingsSearchTitle: "भाषाएँ खोजें और प्रबंधित करें",
      onboardingSettingsSearchDescription:
        "नाम से भाषा खोजें और उन्हें सक्रिय सूची में जोड़ें या हटाएँ।",
      onboardingSettingsInstallTitle: "ऐप इंस्टॉल करें",
      onboardingSettingsInstallDescription:
        "तेज़ पहुँच और बेहतर ऑफलाइन उपयोग के लिए Narrative को डिवाइस पर इंस्टॉल करें।",
      onboardingTapHint: "आगे बढ़ने के लिए कहीं भी टैप करें",
      onboardingProgress: "चरण {{currentStep}} / {{totalSteps}}",
      languages: {
        ru: "रूसी",
        en: "अंग्रेज़ी",
        zh: "चीनी",
        hi: "हिन्दी",
        es: "स्पेनिश",
        ar: "अरबी",
        fr: "फ़्रेंच",
      },
    },
  },
  es: {
    translation: {
      appName: "Narrative",
      seoTitle: "Narrative — traductor de voz en tiempo real sin conexión",
      seoDescription:
        "PWA para reconocimiento de voz local, traducción instantánea y reproducción hablada directamente en el navegador.",
      heroEyebrow: "Traducción de voz offline",
      heroTitle: "Voz. Pausa. Traducción.",
      heroLead:
        "Una interfaz editorial para traducir voz al instante con procesamiento local, cambio de tema e interfaz multilingüe.",
      browserHint: "La interfaz sigue el idioma y el esquema de color del navegador.",
      sourcePane: "Voz original",
      targetPane: "Traducción",
      sourcePlaceholder: "Empieza a hablar y la transcripción aparecerá aquí.",
      partialLabel: "Reconocimiento en vivo",
      targetPlaceholder: "La traducción aparecerá tras una breve pausa.",
      clear: "Limpiar",
      settings: "Configuración",
      back: "Volver",
      install: "Instalar",
      installed: "Instalada",
      interfaceLanguage: "Idioma de la interfaz",
      sourceLanguage: "Idioma de origen",
      swapLanguages: "Intercambiar idiomas",
      translationLanguage: "Idioma de traducción",
      theme: "Tema",
      themeSystem: "Sistema",
      themeLight: "Claro",
      themeDark: "Oscuro",
      listenAction: "Escuchar",
      stopListeningAction: "Detener grabación",
      speakAction: "Reproducir voz",
      stopSpeechAction: "Detener voz",
      statusReady: "Listo",
      statusListening: "Escuchando",
      statusModelLoading: "Cargando modelo de voz",
      statusTranscribing: "Reconociendo voz",
      statusTranslating: "Traduciendo",
      statusInstalled: "La PWA está lista para usarse sin conexión",
      loadingScreenTitle: "Preparando Narrative",
      loadingScreenProcessLabel: "Proceso actual",
      loadingStageLoadingModel: "Cargando modelo",
      loadingStageInitializingModel: "Inicializando modelo",
      loadingStageReady: "Modelo listo",
      loadingTipOffline:
        "Modo offline: el reconocimiento y la traducción se ejecutan en tu navegador.",
      loadingTipPrivacy: "Privado por defecto: voz y texto se quedan en tu dispositivo.",
      loadingTipPwa: "Instala la PWA desde Configuración para abrir más rápido.",
      loadingTipLocalCompute:
        "Cuanto más potente el dispositivo, más rápido carga y transcribe.",
      statusBrowserLocale: "Idioma del navegador",
      statusTarget: "Idioma de destino",
      statusTheme: "Tema actual",
      translationOnlyFromRussian:
        "El reconocimiento de voz funciona ahora en ruso, pero la traducción puede enviarse a varios idiomas.",
      noVoiceOutput:
        "Es posible que el navegador no ofrezca una voz adecuada para el idioma elegido.",
      onboardingIntroTitle: "Qué hace Narrative",
      onboardingIntroDescription:
        "La app reconoce voz localmente, traduce texto y puede leer el resultado en voz alta en el navegador.",
      onboardingStatusTitle: "Estado en tiempo real",
      onboardingStatusDescription:
        "Este indicador muestra si la app está escuchando, traduciendo o lista.",
      onboardingSourceLanguageTitle: "Elige el idioma de origen",
      onboardingSourceLanguageDescription:
        "Define el idioma de la voz de entrada antes de empezar a grabar.",
      onboardingTargetLanguageTitle: "Elige el idioma de destino",
      onboardingTargetLanguageDescription:
        "Selecciona el idioma al que quieres traducir.",
      onboardingSwapTitle: "Intercambio rápido de idiomas",
      onboardingSwapDescription:
        "Con un toque intercambias idioma de origen y de destino.",
      onboardingSourcePaneTitle: "Área de texto de origen",
      onboardingSourcePaneDescription:
        "El panel izquierdo muestra el reconocimiento y permite editar el texto manualmente.",
      onboardingSourceInputTitle: "Campo de texto de origen",
      onboardingSourceInputDescription:
        "Aquí aparece la voz reconocida y puedes corregirla manualmente.",
      onboardingListenButtonTitle: "Iniciar o detener grabación",
      onboardingListenButtonDescription:
        "Usa el botón del micrófono para iniciar o detener la escucha.",
      onboardingTargetPaneTitle: "Área de traducción",
      onboardingTargetPaneDescription:
        "El resultado traducido aparece aquí tras una breve pausa.",
      onboardingTranslationNoteTitle: "Límites de reconocimiento",
      onboardingTranslationNoteDescription:
        "Esta nota explica las limitaciones actuales del reconocimiento de voz.",
      onboardingSpeakButtonTitle: "Reproducción de voz",
      onboardingSpeakButtonDescription:
        "Usa este botón para escuchar el texto de origen o la traducción.",
      onboardingStopSpeechTitle: "Detener reproducción",
      onboardingStopSpeechDescription:
        "Si la voz se está reproduciendo, este botón la detiene al instante.",
      onboardingClearTitle: "Reiniciar sesión actual",
      onboardingClearDescription:
        "Limpia texto de origen y traducción para empezar un nuevo flujo.",
      onboardingSettingsTitle: "Abrir ajustes",
      onboardingSettingsDescription:
        "En ajustes puedes cambiar tema, idioma de la interfaz e instalar la app.",
      onboardingSettingsPageIntroTitle: "Resumen de ajustes",
      onboardingSettingsPageIntroDescription:
        "Esta página controla preferencias de interfaz, idiomas de traducción y opciones de instalación.",
      onboardingSettingsBackTitle: "Volver al traductor",
      onboardingSettingsBackDescription:
        "Usa este botón para volver a la pantalla principal de traducción.",
      onboardingSettingsUiLanguageTitle: "Idioma de la interfaz",
      onboardingSettingsUiLanguageDescription:
        "Cambia el idioma de menús, etiquetas y textos de ayuda.",
      onboardingSettingsThemeTitle: "Selección de tema",
      onboardingSettingsThemeDescription:
        "Cambia entre tema del sistema, claro y oscuro.",
      onboardingSettingsLanguagesTitle: "Conjunto de idiomas de traducción",
      onboardingSettingsLanguagesDescription:
        "Gestiona qué idiomas de traducción estarán disponibles en la pantalla principal.",
      onboardingSettingsSearchTitle: "Buscar y gestionar idiomas",
      onboardingSettingsSearchDescription:
        "Busca por nombre y añade o elimina idiomas de tu lista activa.",
      onboardingSettingsInstallTitle: "Instalar la app",
      onboardingSettingsInstallDescription:
        "Instala Narrative en tu dispositivo para acceso más rápido y mejor uso sin conexión.",
      onboardingTapHint: "Toca en cualquier parte para continuar",
      onboardingProgress: "Paso {{currentStep}} de {{totalSteps}}",
      languages: {
        ru: "Ruso",
        en: "Inglés",
        zh: "Chino",
        hi: "Hindi",
        es: "Español",
        ar: "Árabe",
        fr: "Francés",
      },
    },
  },
  ar: {
    translation: {
      appName: "Narrative",
      seoTitle: "Narrative — مترجم صوتي فوري يعمل دون اتصال",
      seoDescription:
        "تطبيق PWA للتعرّف المحلي على الكلام والترجمة الفورية وتشغيل الصوت مباشرة داخل المتصفح.",
      heroEyebrow: "ترجمة صوتية دون اتصال",
      heroTitle: "صوت. توقف. ترجمة.",
      heroLead:
        "واجهة بطابع تحريري للترجمة الفورية مع معالجة محلية وتبديل للثيم ودعم واجهة متعددة اللغات.",
      browserHint: "تتكيّف الواجهة مع لغة المتصفح ونظام الألوان المفضل.",
      sourcePane: "الكلام الأصلي",
      targetPane: "الترجمة",
      sourcePlaceholder: "ابدأ التحدث وسيظهر النص هنا.",
      partialLabel: "التعرّف المباشر",
      targetPlaceholder: "ستظهر الترجمة بعد توقف قصير.",
      clear: "مسح",
      settings: "الإعدادات",
      back: "رجوع",
      install: "تثبيت",
      installed: "تم التثبيت",
      interfaceLanguage: "لغة الواجهة",
      sourceLanguage: "لغة المصدر",
      swapLanguages: "تبديل اللغتين",
      translationLanguage: "لغة الترجمة",
      theme: "السمة",
      themeSystem: "النظام",
      themeLight: "فاتحة",
      themeDark: "داكنة",
      listenAction: "استماع",
      stopListeningAction: "إيقاف التسجيل",
      speakAction: "تشغيل الصوت",
      stopSpeechAction: "إيقاف الصوت",
      statusReady: "جاهز",
      statusListening: "جارٍ الاستماع",
      statusModelLoading: "جارٍ تحميل نموذج الكلام",
      statusTranscribing: "جارٍ التعرّف على الكلام",
      statusTranslating: "جارٍ الترجمة",
      statusInstalled: "تطبيق PWA جاهز للعمل دون اتصال",
      loadingScreenTitle: "جارٍ تجهيز Narrative",
      loadingScreenProcessLabel: "العملية الحالية",
      loadingStageLoadingModel: "جارٍ تحميل النموذج",
      loadingStageInitializingModel: "جارٍ تهيئة النموذج",
      loadingStageReady: "النموذج جاهز",
      loadingTipOffline: "دون اتصال: التعرّف والترجمة يعملان داخل المتصفح.",
      loadingTipPrivacy: "خصوصية افتراضية: الصوت والنص يبقيان على جهازك.",
      loadingTipPwa: "ثبّت تطبيق PWA من الإعدادات للوصول الأسرع.",
      loadingTipLocalCompute: "كلما كان الجهاز أقوى كان التحميل والتعرّف أسرع.",
      statusBrowserLocale: "لغة المتصفح",
      statusTarget: "اللغة الهدف",
      statusTheme: "السمة الحالية",
      translationOnlyFromRussian:
        "التعرّف على الكلام يعمل حالياً باللغة الروسية، لكن يمكن إرسال الترجمة إلى عدة لغات.",
      noVoiceOutput: "قد لا يوفّر المتصفح صوتاً مناسباً للغة المختارة.",
      onboardingIntroTitle: "ما الذي يقدّمه Narrative",
      onboardingIntroDescription:
        "يستطيع التطبيق التعرّف على الكلام محلياً، وترجمة النص، وقراءة النتيجة صوتياً داخل المتصفح.",
      onboardingStatusTitle: "الحالة المباشرة",
      onboardingStatusDescription:
        "يعرض هذا المؤشر ما إذا كان التطبيق يستمع أو يترجم أو جاهزاً.",
      onboardingSourceLanguageTitle: "اختر لغة المصدر",
      onboardingSourceLanguageDescription:
        "حدّد لغة الكلام الوارد قبل بدء التسجيل.",
      onboardingTargetLanguageTitle: "اختر لغة الهدف",
      onboardingTargetLanguageDescription:
        "اختر اللغة التي تريد الترجمة إليها.",
      onboardingSwapTitle: "تبديل سريع للغات",
      onboardingSwapDescription:
        "بنقرة واحدة يمكنك تبديل لغة المصدر مع لغة الهدف.",
      onboardingSourcePaneTitle: "مساحة نص المصدر",
      onboardingSourcePaneDescription:
        "تعرض اللوحة اليسرى نتائج التعرف ويمكنك تعديل النص يدوياً.",
      onboardingSourceInputTitle: "حقل نص المصدر",
      onboardingSourceInputDescription:
        "يظهر النص المتعرّف عليه هنا ويمكنك تحريره يدوياً.",
      onboardingListenButtonTitle: "بدء أو إيقاف التسجيل",
      onboardingListenButtonDescription:
        "استخدم زر الميكروفون لبدء الاستماع أو إيقافه.",
      onboardingTargetPaneTitle: "منطقة الترجمة",
      onboardingTargetPaneDescription:
        "تظهر نتيجة الترجمة هنا بعد توقف قصير.",
      onboardingTranslationNoteTitle: "قيود التعرّف",
      onboardingTranslationNoteDescription:
        "توضح هذه الملاحظة القيود الحالية للتعرّف على الكلام.",
      onboardingSpeakButtonTitle: "تشغيل الصوت",
      onboardingSpeakButtonDescription:
        "استخدم هذا الزر لسماع نص المصدر أو الترجمة بصوتٍ مسموع.",
      onboardingStopSpeechTitle: "إيقاف التشغيل",
      onboardingStopSpeechDescription:
        "إذا كان التشغيل الصوتي جارياً، أوقفه فوراً بهذا الزر.",
      onboardingClearTitle: "إعادة ضبط الجلسة",
      onboardingClearDescription:
        "امسح نص المصدر والترجمة لبدء تدفق ترجمة جديد.",
      onboardingSettingsTitle: "فتح الإعدادات",
      onboardingSettingsDescription:
        "في الإعدادات يمكنك تغيير الثيم، لغة الواجهة، وتثبيت التطبيق.",
      onboardingSettingsPageIntroTitle: "نظرة عامة على الإعدادات",
      onboardingSettingsPageIntroDescription:
        "تتحكم هذه الصفحة في تفضيلات الواجهة، لغات الترجمة، وخيارات التثبيت.",
      onboardingSettingsBackTitle: "العودة للمترجم",
      onboardingSettingsBackDescription:
        "استخدم هذا الزر للعودة إلى شاشة الترجمة الرئيسية.",
      onboardingSettingsUiLanguageTitle: "لغة الواجهة",
      onboardingSettingsUiLanguageDescription:
        "غيّر لغة القوائم والعناوين والنصوص المساعدة.",
      onboardingSettingsThemeTitle: "اختيار الثيم",
      onboardingSettingsThemeDescription:
        "بدّل بين ثيم النظام، الفاتح، والداكن.",
      onboardingSettingsLanguagesTitle: "مجموعة لغات الترجمة",
      onboardingSettingsLanguagesDescription:
        "أدر اللغات المتاحة للترجمة في الشاشة الرئيسية.",
      onboardingSettingsSearchTitle: "البحث وإدارة اللغات",
      onboardingSettingsSearchDescription:
        "ابحث بالاسم ثم أضف اللغات إلى قائمتك النشطة أو احذفها.",
      onboardingSettingsInstallTitle: "تثبيت التطبيق",
      onboardingSettingsInstallDescription:
        "ثبّت Narrative على جهازك للوصول الأسرع وتجربة أوفلاين أكثر سلاسة.",
      onboardingTapHint: "انقر في أي مكان للمتابعة",
      onboardingProgress: "الخطوة {{currentStep}} من {{totalSteps}}",
      languages: {
        ru: "الروسية",
        en: "الإنجليزية",
        zh: "الصينية",
        hi: "الهندية",
        es: "الإسبانية",
        ar: "العربية",
        fr: "الفرنسية",
      },
    },
  },
  fr: {
    translation: {
      appName: "Narrative",
      seoTitle: "Narrative — traducteur vocal temps réel hors ligne",
      seoDescription:
        "PWA pour la reconnaissance vocale locale, la traduction instantanée et la lecture vocale directement dans le navigateur.",
      heroEyebrow: "Traduction vocale hors ligne",
      heroTitle: "Voix. Pause. Traduction.",
      heroLead:
        "Une interface de style éditorial pour traduire la voix instantanément avec traitement local, changement de thème et UI multilingue.",
      browserHint:
        "L’interface s’adapte à la langue du navigateur et au schéma de couleurs préféré.",
      sourcePane: "Voix source",
      targetPane: "Traduction",
      sourcePlaceholder: "Commencez à parler et la transcription apparaîtra ici.",
      partialLabel: "Reconnaissance en direct",
      targetPlaceholder: "La traduction apparaîtra après une courte pause.",
      clear: "Effacer",
      settings: "Paramètres",
      back: "Retour",
      install: "Installer",
      installed: "Installée",
      interfaceLanguage: "Langue de l’interface",
      sourceLanguage: "Langue source",
      swapLanguages: "Inverser les langues",
      translationLanguage: "Langue de traduction",
      theme: "Thème",
      themeSystem: "Système",
      themeLight: "Clair",
      themeDark: "Sombre",
      listenAction: "Écouter",
      stopListeningAction: "Arrêter l’enregistrement",
      speakAction: "Lire à voix haute",
      stopSpeechAction: "Arrêter la voix",
      statusReady: "Prêt",
      statusListening: "Écoute en cours",
      statusModelLoading: "Chargement du modèle vocal",
      statusTranscribing: "Reconnaissance vocale en cours",
      statusTranslating: "Traduction en cours",
      statusInstalled: "La PWA est prête pour un usage hors ligne",
      loadingScreenTitle: "Préparation de Narrative",
      loadingScreenProcessLabel: "Processus en cours",
      loadingStageLoadingModel: "Chargement du modèle",
      loadingStageInitializingModel: "Initialisation du modèle",
      loadingStageReady: "Modèle prêt",
      loadingTipOffline:
        "Hors ligne: reconnaissance et traduction s’exécutent dans le navigateur.",
      loadingTipPrivacy: "Confidentiel par défaut: voix et texte restent sur l’appareil.",
      loadingTipPwa: "Installez la PWA depuis les paramètres pour un lancement plus rapide.",
      loadingTipLocalCompute: "Un appareil plus rapide charge et transcrit plus vite.",
      statusBrowserLocale: "Langue du navigateur",
      statusTarget: "Langue cible",
      statusTheme: "Thème actuel",
      translationOnlyFromRussian:
        "La reconnaissance vocale fonctionne actuellement en russe, mais la traduction peut être envoyée vers plusieurs langues.",
      noVoiceOutput:
        "Le navigateur peut ne pas fournir de voix adaptée pour la langue sélectionnée.",
      onboardingIntroTitle: "Ce que fait Narrative",
      onboardingIntroDescription:
        "L’application reconnaît la voix localement, traduit le texte et peut lire le résultat à voix haute dans le navigateur.",
      onboardingStatusTitle: "Statut en temps réel",
      onboardingStatusDescription:
        "Cet indicateur montre si l’app écoute, traduit ou est prête.",
      onboardingSourceLanguageTitle: "Choisir la langue source",
      onboardingSourceLanguageDescription:
        "Définissez la langue de la voix d’entrée avant de lancer l’enregistrement.",
      onboardingTargetLanguageTitle: "Choisir la langue cible",
      onboardingTargetLanguageDescription:
        "Sélectionnez la langue vers laquelle traduire.",
      onboardingSwapTitle: "Inversion rapide des langues",
      onboardingSwapDescription:
        "Un appui suffit pour inverser langue source et langue cible.",
      onboardingSourcePaneTitle: "Espace texte source",
      onboardingSourcePaneDescription:
        "Le panneau de gauche affiche la reconnaissance et permet l’édition manuelle du texte.",
      onboardingSourceInputTitle: "Champ texte source",
      onboardingSourceInputDescription:
        "La parole reconnue apparaît ici et vous pouvez la corriger manuellement.",
      onboardingListenButtonTitle: "Démarrer ou arrêter l’enregistrement",
      onboardingListenButtonDescription:
        "Utilisez le bouton micro pour démarrer ou arrêter l’écoute.",
      onboardingTargetPaneTitle: "Zone de traduction",
      onboardingTargetPaneDescription:
        "Le résultat traduit s’affiche ici après une courte pause.",
      onboardingTranslationNoteTitle: "Limites de reconnaissance",
      onboardingTranslationNoteDescription:
        "Cette note explique les limites actuelles de la reconnaissance vocale.",
      onboardingSpeakButtonTitle: "Lecture vocale",
      onboardingSpeakButtonDescription:
        "Utilisez ce bouton pour lire à voix haute le texte source ou la traduction.",
      onboardingStopSpeechTitle: "Arrêter la lecture",
      onboardingStopSpeechDescription:
        "Si la lecture est en cours, ce bouton l’arrête immédiatement.",
      onboardingClearTitle: "Réinitialiser la session",
      onboardingClearDescription:
        "Effacez texte source et traduction pour démarrer un nouveau flux.",
      onboardingSettingsTitle: "Ouvrir les paramètres",
      onboardingSettingsDescription:
        "Dans les paramètres, vous pouvez changer le thème, la langue d’interface et installer l’app.",
      onboardingSettingsPageIntroTitle: "Vue d’ensemble des paramètres",
      onboardingSettingsPageIntroDescription:
        "Cette page gère les préférences d’interface, les langues de traduction et les options d’installation.",
      onboardingSettingsBackTitle: "Retour au traducteur",
      onboardingSettingsBackDescription:
        "Utilisez ce bouton pour revenir à l’écran principal de traduction.",
      onboardingSettingsUiLanguageTitle: "Langue de l’interface",
      onboardingSettingsUiLanguageDescription:
        "Changez la langue des menus, libellés et textes d’aide.",
      onboardingSettingsThemeTitle: "Choix du thème",
      onboardingSettingsThemeDescription:
        "Basculez entre thème système, clair et sombre.",
      onboardingSettingsLanguagesTitle: "Ensemble de langues de traduction",
      onboardingSettingsLanguagesDescription:
        "Gérez les langues de traduction disponibles sur l’écran principal.",
      onboardingSettingsSearchTitle: "Rechercher et gérer les langues",
      onboardingSettingsSearchDescription:
        "Recherchez par nom puis ajoutez ou retirez des langues de votre liste active.",
      onboardingSettingsInstallTitle: "Installer l’application",
      onboardingSettingsInstallDescription:
        "Installez Narrative sur votre appareil pour un accès plus rapide et un meilleur usage hors ligne.",
      onboardingTapHint: "Touchez n’importe où pour continuer",
      onboardingProgress: "Étape {{currentStep}} sur {{totalSteps}}",
      languages: {
        ru: "Russe",
        en: "Anglais",
        zh: "Chinois",
        hi: "Hindi",
        es: "Espagnol",
        ar: "Arabe",
        fr: "Français",
      },
    },
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: UI_LOCALES,
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export { i18n };
