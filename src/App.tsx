import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Loader } from "./components/Loader";
import { UpdateBanner } from "./components/UpdateBanner";

import { usePWAInstall } from "./hooks/usePWAInstall";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { type ThemeMode, useTheme } from "./hooks/useTheme";
import { useTranslation } from "./hooks/useTranslation";
import { useLanguageList } from "./hooks/useLanguageList";
import { i18n, type UiLocale, UI_LOCALES } from "./i18n";
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  getLocalizedLanguageName,
  getNllbSpeechLocale,
} from "./nllb-languages";
import { normalizeUiLocale } from "./languages";

const MainPage = lazy(() => import("./pages/MainPage"));
const SettingsRoute = lazy(() => import("./pages/SettingsRoute"));

function App() {
  const { t } = useI18nTranslation();
  const navigate = useNavigate();
  const [sourceLanguage, setSourceLanguage] = useState<string>(DEFAULT_SOURCE_LANGUAGE);
  const [targetLanguage, setTargetLanguage] = useState<string>(DEFAULT_TARGET_LANGUAGE);
  const prevSourceLanguageRef = useRef(sourceLanguage);
  const { theme, setTheme } = useTheme();
  const { selectedLanguages, addLanguage, removeLanguage } = useLanguageList();

  const {
    isRecording,
    isModelLoading,
    modelLoadingProgress,
    modelLoadingStage,
    isTranscribing,
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

  const {
    isSpeaking,
    speak,
    stop: stopSpeaking,
    localOnly: localTtsOnly,
    setLocalOnly: setLocalTtsOnly,
  } = useSpeechSynthesis();
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
    if (selectedLanguages.length === 0) return;
    const codes = selectedLanguages.map((l) => l.code);
    if (!codes.includes(sourceLanguage)) setSourceLanguage(codes[0]);
    if (!codes.includes(targetLanguage)) setTargetLanguage(codes[0]);
  }, [selectedLanguages, sourceLanguage, targetLanguage]);

  const clearAll = useCallback(() => {
    // Irreversible data loss on a single tap is too aggressive for a
    // confidential-use app. Guard with a native confirm (localized).
    const hasContent = Boolean(transcript || partialTranscript || translatedText);
    if (hasContent) {
      const confirmed = window.confirm(
        t("clearConfirm", {
          defaultValue: "Clear all recognized speech and the translation?",
        }),
      );
      if (!confirmed) return;
    }
    clearTranscript();
    clearTranslation();
  }, [clearTranscript, clearTranslation, t, transcript, partialTranscript, translatedText]);

  useEffect(() => {
    if (prevSourceLanguageRef.current !== sourceLanguage) {
      clearAll();
      prevSourceLanguageRef.current = sourceLanguage;
    }
  }, [sourceLanguage, clearAll]);

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

    document.title = t("seoTitle");

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.append(description);
    }
    description.setAttribute("content", t("seoDescription"));
  }, [t]);

  const canClear = Boolean(
    transcript || partialTranscript || translatedText || error || translationError,
  );

  const status = isRecording
    ? t("statusListening")
    : isTranscribing
      ? t("statusTranscribing")
      : isModelLoading
        ? t("statusModelLoading")
        : isTranslating
          ? t("statusTranslating")
          : isInstalled
            ? t("statusInstalled")
            : t("statusReady");

  const activeUiLocale = useMemo<UiLocale>(
    () => normalizeUiLocale(i18n.resolvedLanguage ?? i18n.language),
    // i18n is stable; re-derive only when t changes (which means language changed).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  const uiLanguageOptions = useMemo(
    () =>
      UI_LOCALES.map((language) => ({
        value: language,
        label: t(`languages.${language}`),
      })),
    [t],
  );

  const languageOptions = useMemo(
    () =>
      selectedLanguages.map((lang) => ({
        value: lang.code,
        label: getLocalizedLanguageName(lang.code, activeUiLocale),
      })),
    [selectedLanguages, activeUiLocale],
  );

  const selectedLanguageCodes = useMemo(
    () => selectedLanguages.map((l) => l.code),
    [selectedLanguages],
  );

  const themeOptions = useMemo<Array<{ value: ThemeMode; label: string }>>(
    () => [
      { value: "system", label: t("themeSystem") },
      { value: "light", label: t("themeLight") },
      { value: "dark", label: t("themeDark") },
    ],
    [t],
  );

  const loadingStageLabelByValue = useMemo<Record<string, string>>(
    () => ({
      "Loading model": t("loadingStageLoadingModel"),
      "Initializing model": t("loadingStageInitializingModel"),
      "Model ready": t("loadingStageReady"),
    }),
    [t],
  );
  const loadingHints = useMemo(
    () => [
      t("loadingTipOffline"),
      t("loadingTipPrivacy"),
      t("loadingTipPwa"),
      t("loadingTipLocalCompute"),
    ],
    [t],
  );
  const localizedLoadingStage =
    loadingStageLabelByValue[modelLoadingStage] ?? modelLoadingStage;

  if (isModelLoading) {
    return (
      <Loader
        appName={t("appName")}
        label={t("loadingScreenTitle")}
        processLabel={t("loadingScreenProcessLabel")}
        currentProcess={localizedLoadingStage}
        progress={modelLoadingProgress}
        rotatingMessages={loadingHints}
      />
    );
  }

  const currentSourceLanguageLabel =
    languageOptions.find((opt) => opt.value === sourceLanguage)?.label ?? "";
  const currentTargetLanguageLabel =
    languageOptions.find((opt) => opt.value === targetLanguage)?.label ?? "";

  return (
    <>
      <UpdateBanner />
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
              isTranscribing={isTranscribing}
              isTranslating={isTranslating}
              isSpeaking={isSpeaking}
              canRecord={!isModelLoading && !isTranscribing}
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
              selectedLanguageCodes={selectedLanguageCodes}
              onAddLanguage={addLanguage}
              onRemoveLanguage={removeLanguage}
              localTtsOnly={localTtsOnly}
              onLocalTtsOnlyChange={setLocalTtsOnly}
            />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
