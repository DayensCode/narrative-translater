import { useCallback, useEffect, useState } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import "./App.css";
import { Controls } from "./components/Controls";
import { Panes } from "./components/Panes";
import { TopBar } from "./components/TopBar";
import { usePWAInstall } from "./hooks/usePWAInstall";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { type ThemeMode, useTheme } from "./hooks/useTheme";
import { useTranslation } from "./hooks/useTranslation";
import { i18n, type UiLocale, UI_LOCALES } from "./i18n";
import {
  getSpeechLocale,
  normalizeUiLocale,
  RECOGNITION_LANGUAGE,
  TRANSLATION_LANGUAGE_OPTIONS,
  type TranslationLanguageCode,
} from "./languages";

const MODEL_URL = import.meta.env.VITE_VOSK_MODEL_URL ?? "/model.tar.gz";
const DEFAULT_TARGET_LANGUAGE: TranslationLanguageCode = "en";

function App() {
  const { t } = useI18nTranslation();
  const [targetLanguage, setTargetLanguage] =
    useState<TranslationLanguageCode>(DEFAULT_TARGET_LANGUAGE);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const {
    isRecording,
    isModelLoading,
    transcript,
    partialTranscript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    dispose: disposeRecognition,
  } = useSpeechRecognition(MODEL_URL);

  const { isTranslating, translatedText, translationError, translate, clearTranslation } =
    useTranslation();

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();
  const { isInstalled, isInstallAvailable, install } = usePWAInstall();

  useEffect(() => {
    translate(transcript, RECOGNITION_LANGUAGE, targetLanguage);
  }, [targetLanguage, transcript, translate]);

  useEffect(() => {
    return () => {
      disposeRecognition();
      stopSpeaking();
    };
  }, [disposeRecognition, stopSpeaking]);

  const clearAll = useCallback(() => {
    clearTranscript();
    clearTranslation();
  }, [clearTranscript, clearTranslation]);

  const handleSpeak = useCallback(() => {
    speak(translatedText || transcript, translatedText ? getSpeechLocale(targetLanguage) : "ru-RU");
  }, [speak, targetLanguage, translatedText, transcript]);

  const handleUiLanguageChange = useCallback((language: UiLocale) => {
    void i18n.changeLanguage(language);
  }, []);

  useEffect(() => {
    const locale = i18n.resolvedLanguage ?? i18n.language ?? "en";
    const normalizedLocale = normalizeUiLocale(locale);
    const nextDirection = normalizedLocale === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = normalizedLocale;
    document.documentElement.dir = nextDirection;
    document.body.dataset.theme = resolvedTheme;

    document.title = t("seoTitle");

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.append(description);
    }
    description.setAttribute("content", t("seoDescription"));
  }, [resolvedTheme, t]);

  const canClear = Boolean(
    transcript || partialTranscript || translatedText || error || translationError,
  );

  const status = isRecording
    ? t("statusListening")
    : isModelLoading
      ? t("statusModelLoading")
      : isTranslating
        ? t("statusTranslating")
        : isInstalled
          ? t("statusInstalled")
          : t("statusReady");

  const uiLanguageOptions = UI_LOCALES.map((language) => ({
    value: language,
    label: t(`languages.${language}`),
  }));

  const translationLanguageOptions = TRANSLATION_LANGUAGE_OPTIONS.map((language) => ({
    value: language.code,
    label: t(language.labelKey),
  }));

  const themeOptions: Array<{ value: ThemeMode; label: string }> = [
    { value: "system", label: t("themeSystem") },
    { value: "light", label: t("themeLight") },
    { value: "dark", label: t("themeDark") },
  ];

  const activeUiLocale = normalizeUiLocale(i18n.resolvedLanguage ?? i18n.language) as UiLocale;
  const targetLanguageLabel =
    translationLanguageOptions.find((option) => option.value === targetLanguage)?.label ??
    t("languages.en");

  return (
    <main className="app-shell">
      <TopBar
        appName={t("appName")}
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        lead={t("heroLead")}
        browserHint={t("browserHint")}
        status={status}
        browserLocaleLabel={t("statusBrowserLocale")}
        targetLanguageLabel={t("statusTarget")}
        themeLabel={t("statusTheme")}
        interfaceLanguageLabel={t("interfaceLanguage")}
        translationLanguageLabel={t("translationLanguage")}
        clearLabel={t("clear")}
        installLabel={isInstalled ? t("installed") : t("install")}
        isInstalled={isInstalled}
        isInstallAvailable={isInstallAvailable}
        canClear={canClear}
        selectedUiLanguage={activeUiLocale}
        selectedTargetLanguage={targetLanguage}
        theme={theme}
        uiLanguageOptions={uiLanguageOptions}
        translationLanguageOptions={translationLanguageOptions}
        themeOptions={themeOptions}
        onUiLanguageChange={handleUiLanguageChange}
        onTargetLanguageChange={setTargetLanguage}
        onThemeChange={setTheme}
        onClear={clearAll}
        onInstall={install}
      />
      <Panes
        sourceTitle={t("sourcePane")}
        targetTitle={t("targetPane")}
        sourceLanguageLabel={t("languages.ru")}
        targetLanguageLabel={targetLanguageLabel}
        transcript={transcript}
        partialTranscript={partialTranscript}
        translatedText={translatedText}
        sourcePlaceholder={t("sourcePlaceholder")}
        targetPlaceholder={t("targetPlaceholder")}
        partialLabel={t("partialLabel")}
        translationNote={t("translationOnlyFromRussian")}
      />
      {error ? <p className="error">{error}</p> : null}
      {translationError ? <p className="error">{translationError}</p> : null}
      <Controls
        isRecording={isRecording}
        isSpeaking={isSpeaking}
        canRecord={!isModelLoading}
        canSpeak={Boolean(translatedText || transcript)}
        listenLabel={t("listenAction")}
        stopListeningLabel={t("stopListeningAction")}
        speakLabel={t("speakAction")}
        stopSpeechLabel={t("stopSpeechAction")}
        onToggleRecording={isRecording ? stopRecording : startRecording}
        onSpeak={handleSpeak}
        onStopSpeaking={stopSpeaking}
      />
    </main>
  );
}

export default App;
