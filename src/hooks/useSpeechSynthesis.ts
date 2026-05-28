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

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const prefix = lang.split("-")[0].toLowerCase();
  return voiceCache.voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    ensureVoiceListener();
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      const matchedVoice = pickVoice(lang);
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
    [stop],
  );

  return { isSpeaking, speak, stop };
}
