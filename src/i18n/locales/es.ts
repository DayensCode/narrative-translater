const es = {
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
} as const;

export default es;
