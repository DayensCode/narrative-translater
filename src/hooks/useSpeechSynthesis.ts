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

/**
 * `SpeechSynthesisVoice.localService` is the canonical signal, but several
 * browsers misreport it. Most importantly, Chromium on Windows flags every
 * voice — including OS-installed Microsoft SAPI engines — as
 * `localService: false`, which would otherwise trip our `localOnly` guard
 * and silently refuse playback for users who clearly have a local engine
 * installed (long-standing crbug.com/634716).
 *
 * As a fallback we also recognise vendor prefixes for engines that ship
 * with the OS and never go to the network: Microsoft on Windows, Apple on
 * macOS/iOS, and eSpeak on Linux. The "Google …" voices, which are the
 * cloud ones we explicitly do not want under `localOnly`, are never matched
 * by these prefixes.
 */
function isLikelyLocalVoice(v: SpeechSynthesisVoice): boolean {
  if (v.localService) return true;
  const name = v.name.toLowerCase();
  if (name.startsWith("microsoft ")) return true;
  if (name.startsWith("apple ") || name.startsWith("com.apple.")) return true;
  if (name.startsWith("espeak")) return true;
  return false;
}

type VoicePick =
  | { voice: SpeechSynthesisVoice; reason: "local" | "cloud" }
  | { voice: undefined; reason: "no-local" | "no-voice" };

function pickVoice(lang: string, localOnly: boolean): VoicePick {
  const prefix = lang.split("-")[0].toLowerCase();
  // Prefer on-device voices: some browser voices (e.g. Chrome's "Google …"
  // voices) stream the utterance text to a cloud TTS provider, which
  // contradicts the app's confidentiality promise. When `localOnly` is set,
  // we refuse cloud voices entirely; otherwise we still prefer local ones
  // when both are available for the requested language.
  const matches = voiceCache.voices.filter((v) =>
    v.lang.toLowerCase().startsWith(prefix),
  );
  if (matches.length === 0) return { voice: undefined, reason: "no-voice" };
  const local = matches.find(isLikelyLocalVoice);
  if (local) return { voice: local, reason: "local" };
  if (localOnly) return { voice: undefined, reason: "no-local" };
  return { voice: matches[0], reason: "cloud" };
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

export type SynthesisErrorCode =
  | "no-local-voice"
  | "no-voice-for-language"
  | "synthesis-failed";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<SynthesisErrorCode | null>(null);
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

      // Refresh the cache synchronously: in Chrome the very first call to
      // getVoices() can populate it without ever firing `voiceschanged`, so
      // a user who clicks Speak fast might otherwise see an empty list.
      if (voiceCache.voices.length === 0 && "speechSynthesis" in window) {
        voiceCache.voices = window.speechSynthesis.getVoices();
      }

      const pick = pickVoice(lang, localOnly);
      if (!pick.voice) {
        setError(
          pick.reason === "no-local" ? "no-local-voice" : "no-voice-for-language",
        );
        return;
      }

      setError(null);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.voice = pick.voice;

      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setIsSpeaking(false);
        }
      };
      utterance.onerror = (event) => {
        if (utteranceRef.current !== utterance) return;
        utteranceRef.current = null;
        setIsSpeaking(false);
        // `interrupted` / `canceled` happen when the user (or our `stop`)
        // aborts a still-speaking utterance; that is not a failure.
        if (event.error !== "interrupted" && event.error !== "canceled") {
          setError("synthesis-failed");
        }
      };
      utteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [stop, localOnly],
  );

  const clearError = useCallback(() => setError(null), []);

  return { isSpeaking, speak, stop, error, clearError, localOnly, setLocalOnly };
}
