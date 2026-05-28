const en = {
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
    onboardingSettingsPrivacyTitle: "Privacy & on-device voices",
    onboardingSettingsPrivacyDescription:
    "This section keeps the app private. Turn the switch on to use only on-device voices so text never leaves your device for cloud TTS.",
    onboardingSettingsWipeDataTitle: "Wipe all local data",
    onboardingSettingsWipeDataDescription:
    "Removes preferences, cached models (~1.5 GB) and the service worker — a one-tap way to leave no local trace of the session.",
    onboardingSettingsInstallTitle: "Install the app",
    onboardingSettingsInstallDescription:
    "Install Narrative on your device for faster access and smoother offline use.",
    onboardingTapHint: "Tap anywhere to continue",
    onboardingProgress: "Step {{currentStep}} of {{totalSteps}}",
    clearConfirm: "Clear all recognized speech and the translation?",
    privacy: "Privacy",
    localTtsOnly: "Use on-device voices only",
    localTtsOnlyDescription:
    "Some browser voices send text to a cloud TTS. When on, Narrative picks only voices marked as local.",
    wipeData: "Wipe all data",
    wipeDataDescription:
    "Removes saved preferences, cached models, and service worker state. The app reloads afterwards.",
    wipeDataConfirm:
    "This will remove all saved data: preferences, cached models (~1.5 GB), and service worker. Continue?",
    wipeDataDone: "All local data has been removed.",
    updateAvailableTitle: "A new version is available",
    updateAvailableAction: "Reload",
    updateAvailableLater: "Later",
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
} as const;

export default en;
