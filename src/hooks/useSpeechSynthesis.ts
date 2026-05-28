import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Some browsers (most notably Chromium-based ones) return an empty array from
 * `getVoices()` the first time it is called. The voice list is populated later
 * and emits a `voiceschanged` event. We keep an up-to-date reference in a
 * module-level cache so consumers can pick a voice synchronously.
 */
const voiceCache: { voices: SpeechSynthesisVoice[] } = { voices: [] };
let voiceListenerAttached = false;

function ensureVoiceListener(): void {
  if (voiceListenerAttached) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  voiceCache.voices = window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    voiceCache.voices = window.speechSynthesis.getVoices();
  });
  voiceListenerAttached = true;
}

function pickVoice(
  lang: string,
  localOnly: boolean,
): SpeechSynthesisVoice | undefined {
  const prefix = lang.split("-")[0].toLowerCase();
  // Prefer on-device voices: some browser voices (e.g. Chrome's "Google …"
  // voices) stream the utterance text to a cloud TTS provider, which
  // contradicts the app's confidentiality promise. When `localOnly` is set,
  // we refuse cloud voices entirely; otherwise we still prefer local ones
  // when both are available for the requested language.
  const matches = voiceCache.voices.filter((v) =>
    v.lang.toLowerCase().startsWith(prefix),
  );
  const local = matches.find((v) => v.localService);
  if (local) return local;
  if (localOnly) return undefined;
  return matches[0];
}

const LOCAL_TTS_STORAGE_KEY = "narrative-local-tts-only";

function readLocalOnlyPreference(): boolean {
  try {
    // Default ON — safer for a confidential-use app. Users can opt into
    // cloud voices explicitly in Settings.
    return window.localStorage.getItem(LOCAL_TTS_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [localOnly, setLocalOnlyState] = useState<boolean>(() =>
    typeof window === "undefined" ? true : readLocalOnlyPreference(),
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    ensureVoiceListener();
  }, []);

  const setLocalOnly = useCallback((next: boolean) => {
    setLocalOnlyState(next);
    try {
      window.localStorage.setItem(LOCAL_TTS_STORAGE_KEY, String(next));
    } catch {
      // Ignore quota / private-mode write errors.
    }
  }, []);

  const stop = useCallback(() => {
    const utterance = utteranceRef.current;
    if (utterance) {
      // Detach handlers first so the onend we triggered via cancel() doesn't
      // race with a subsequent `speak()` call and flip `isSpeaking` back off.
      utterance.onend = null;
      utterance.onerror = null;
      utteranceRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, lang: string) => {
      if (!text.trim()) return;

      stop();
      const matchedVoice = pickVoice(lang, localOnly);
      if (localOnly && !matchedVoice) {
        // No local voice available — refuse rather than silently fall back
        // to a cloud voice that would leak the text off-device.
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setIsSpeaking(false);
        }
      };
      utterance.onerror = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setIsSpeaking(false);
        }
      };
      utteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [stop, localOnly],
  );

  return { isSpeaking, speak, stop, localOnly, setLocalOnly };
}
