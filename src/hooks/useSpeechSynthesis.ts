import { useCallback, useRef, useState } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, lang: string) => {
      if (!text.trim()) return;

      stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      const langPrefix = lang.split("-")[0].toLowerCase();
      const matchedVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase().startsWith(langPrefix));
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [stop],
  );

  return { isSpeaking, speak, stop };
}
