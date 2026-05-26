import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Loader } from "./components/Loader";

import { usePWAInstall } from "./hooks/usePWAInstall";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { type ThemeMode, useTheme } from "./hooks/useTheme";
import { useTranslation } from "./hooks/useTranslation";
import { useLanguageList } from "./hooks/useLanguageList";
import { i18n, type UiLocale, UI_LOCALES } from "./i18n";
import { getLocalizedLanguageName, getNllbSpeechLocale } from "./nllb-languages";
import { normalizeUiLocale } from "./languages";

const DEFAULT_SOURCE_LANGUAGE = "rus_Cyrl";
const DEFAULT_TARGET_LANGUAGE = "eng_Latn";
const MainPage = lazy(() => import("./pages/MainPage"));
const SettingsRoute = lazy(() => import("./pages/SettingsRoute"));

function App() {
  const { t } = useI18nTranslation();
  const navigate = useNavigate();
  const [sourceLanguage, setSourceLanguage] = useState<string>(DEFAULT_SOURCE_LANGUAGE);
  const [targetLanguage, setTargetLanguage] = useState<string>(DEFAULT_TARGET_LANGUAGE);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { selectedLanguages, addLanguage, removeLanguage } = useLanguageList();

  const {
    isRecording,
    isModelLoading,
    transcript,
    setTranscript,
    partialTranscript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    dispose: disposeRecognition,
  } = useSpeechRecognition(sourceLanguage);

  const { isTranslating, translatedText, translationError, translate, clearTranslation } =
    useTranslation();

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();
  const { isInstalled, isInstallAvailable, install } = usePWAInstall();

  useEffect(() => {
    translate(transcript, sourceLanguage, targetLanguage);
  }, [sourceLanguage, targetLanguage, transcript, translate]);

  useEffect(() => {
    return () => {
      disposeRecognition();
      stopSpeaking();
    };
  }, [disposeRecognition, stopSpeaking]);

  // If selected language is removed from the list, fall back to first available
  useEffect(() => {
    const codes = selectedLanguages.map((l) => l.code);
    if (codes.length > 0 && !codes.includes(sourceLanguage)) {
      setSourceLanguage(codes[0]);
    }
    if (codes.length > 0 && !codes.includes(targetLanguage)) {
      setTargetLanguage(codes[0]);
    }
  }, [selectedLanguages, sourceLanguage, targetLanguage]);

  const clearAll = useCallback(() => {
    clearTranscript();
    clearTranslation();
  }, [clearTranscript, clearTranslation]);

  const handleSpeak = useCallback(() => {
    const locale = translatedText
      ? getNllbSpeechLocale(targetLanguage)
      : getNllbSpeechLocale(sourceLanguage);
    speak(translatedText || transcript, locale);
  }, [speak, sourceLanguage, targetLanguage, translatedText, transcript]);

  const handleSwapLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  }, [sourceLanguage, targetLanguage]);

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

  const activeUiLocale = normalizeUiLocale(i18n.resolvedLanguage ?? i18n.language) as UiLocale;

  const uiLanguageOptions = UI_LOCALES.map((language) => ({
    value: language,
    label: t(`languages.${language}`),
  }));

  const languageOptions = selectedLanguages.map((lang) => ({
    value: lang.code,
    label: getLocalizedLanguageName(lang.code, activeUiLocale),
  }));

  const themeOptions: Array<{ value: ThemeMode; label: string }> = [
    { value: "system", label: t("themeSystem") },
    { value: "light", label: t("themeLight") },
    { value: "dark", label: t("themeDark") },
  ];
  const currentSourceLanguageLabel =
    languageOptions.find((opt) => opt.value === sourceLanguage)?.label ?? "";
  const currentTargetLanguageLabel =
    languageOptions.find((opt) => opt.value === targetLanguage)?.label ?? "";

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader label={t("statusModelLoading")} />}>
            <MainPage
              appName={t("appName")}
              eyebrow={t("heroEyebrow")}
              status={status}
              sourceLanguageLabel={t("sourceLanguage")}
              selectedSourceLanguage={sourceLanguage}
              sourceLanguageOptions={languageOptions}
              onSourceLanguageChange={setSourceLanguage}
              swapLanguagesLabel={t("swapLanguages")}
              onSwapLanguages={handleSwapLanguages}
              translationLanguageLabel={t("translationLanguage")}
              selectedTargetLanguage={targetLanguage}
              translationLanguageOptions={languageOptions}
              onTargetLanguageChange={setTargetLanguage}
              clearLabel={t("clear")}
              canClear={canClear}
              onClear={clearAll}
              settingsLabel={t("settings")}
              onOpenSettings={() => navigate("/settings")}
              sourceTitle={t("sourcePane")}
              targetTitle={t("targetPane")}
              sourceLanguageCurrentLabel={currentSourceLanguageLabel}
              targetLanguageCurrentLabel={currentTargetLanguageLabel}
              transcript={transcript}
              onSourceChange={setTranscript}
              partialTranscript={partialTranscript}
              translatedText={translatedText}
              sourcePlaceholder={t("sourcePlaceholder")}
              targetPlaceholder={t("targetPlaceholder")}
              partialLabel={t("partialLabel")}
              translationNote={t("translationOnlyFromRussian")}
              error={error}
              translationError={translationError}
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
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<Loader label={t("statusModelLoading")} />}>
            <SettingsRoute
              backLabel={t("back")}
              title={t("settings")}
              themeLabel={t("theme")}
              theme={theme}
              themeOptions={themeOptions}
              interfaceLanguageLabel={t("interfaceLanguage")}
              selectedUiLanguage={activeUiLocale}
              uiLanguageOptions={uiLanguageOptions}
              installLabel={isInstalled ? t("installed") : t("install")}
              isInstalled={isInstalled}
              isInstallAvailable={isInstallAvailable}
              onThemeChange={setTheme}
              onUiLanguageChange={handleUiLanguageChange}
              onInstall={install}
              onBack={() => navigate("/")}
              selectedLanguageCodes={selectedLanguages.map((l) => l.code)}
              onAddLanguage={addLanguage}
              onRemoveLanguage={removeLanguage}
            />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
