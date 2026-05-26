import { useCallback, useEffect, useRef, useState } from "react";
import { SILENCE_TIMEOUT_MS, VOICE_ACTIVITY_THRESHOLD } from "../config";
import type { WhisperRequest, WhisperResponse } from "../types";

// Map NLLB ISO 639-3 prefix → Whisper language name
const NLLB_PREFIX_TO_WHISPER: Record<string, string> = {
  acm: "arabic", acq: "arabic", aeb: "arabic", afr: "afrikaans",
  ajp: "arabic", aka: "akan", amh: "amharic", apc: "arabic",
  arb: "arabic", ars: "arabic", ary: "arabic", arz: "arabic",
  asm: "assamese", ast: "asturian", awa: "hindi", ayr: "aymara",
  azb: "azerbaijani", azj: "azerbaijani", bak: "bashkir", bel: "belarusian",
  ben: "bengali", bho: "hindi", bos: "bosnian", bul: "bulgarian",
  cat: "catalan", ceb: "cebuano", ces: "czech", ckb: "kurdish",
  cym: "welsh", dan: "danish", deu: "german", ell: "greek",
  eng: "english", est: "estonian", fas: "persian", fin: "finnish",
  fra: "french", gle: "irish", glg: "galician", guj: "gujarati",
  hau: "hausa", heb: "hebrew", hin: "hindi", hrv: "croatian",
  hun: "hungarian", hye: "armenian", ibo: "igbo", ind: "indonesian",
  isl: "icelandic", ita: "italian", jav: "javanese", jpn: "japanese",
  kan: "kannada", kat: "georgian", kaz: "kazakh", khm: "khmer",
  kin: "kinyarwanda", kir: "kyrgyz", kor: "korean", lao: "lao",
  lav: "latvian", lit: "lithuanian", lvs: "latvian", mal: "malayalam",
  mar: "marathi", mkd: "macedonian", mlt: "maltese", mri: "maori",
  msa: "malay", mya: "burmese", nep: "nepali", nld: "dutch",
  nob: "norwegian", nno: "norwegian", nya: "nyanja", oci: "occitan",
  ory: "odia", pan: "punjabi", pol: "polish", por: "portuguese",
  ron: "romanian", run: "rundi", rus: "russian", sin: "sinhala",
  slk: "slovak", slv: "slovenian", sna: "shona", som: "somali",
  spa: "spanish", srp: "serbian", swe: "swedish", swh: "swahili",
  tam: "tamil", tel: "telugu", tgk: "tajik", tgl: "tagalog",
  tha: "thai", tur: "turkish", ukr: "ukrainian", urd: "urdu",
  uzn: "uzbek", vie: "vietnamese", wol: "wolof", xho: "xhosa",
  yor: "yoruba", yue: "cantonese", zho: "chinese", zsm: "malay",
  zul: "zulu",
};

function nllbToWhisperLanguage(nllbCode: string): string | undefined {
  const prefix = nllbCode.split("_")[0].toLowerCase();
  return NLLB_PREFIX_TO_WHISPER[prefix];
}

export function useSpeechRecognition(language: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState("");

  const workerRef = useRef<Worker | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<AudioWorkletNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const silenceStartedAtRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/whisper.worker.ts", import.meta.url),
        { type: "module" },
      );
    }
    return workerRef.current;
  }, []);

  useEffect(() => {
    const worker = getWorker();

    const handleMessage = (event: MessageEvent<WhisperResponse>) => {
      const data = event.data;
      if (data.type === "ready") {
        setIsModelLoading(false);
      } else if (data.type === "result") {
        setIsModelLoading(false);
        if (data.text) {
          setTranscript((prev: string) => (prev ? `${prev} ${data.text}` : data.text));
        }
      } else if (data.type === "error") {
        setIsModelLoading(false);
        setError(data.message);
      }
    };

    worker.addEventListener("message", handleMessage);
    worker.postMessage({ type: "warmup" } satisfies WhisperRequest);

    return () => worker.removeEventListener("message", handleMessage);
  }, [getWorker]);

  const clearAudioResources = useCallback(async () => {
    silenceStartedAtRef.current = null;
    audioChunksRef.current = [];

    if (processorNodeRef.current) {
      processorNodeRef.current.port.onmessage = null;
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (silentGainRef.current) {
      silentGainRef.current.disconnect();
      silentGainRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const transcribeBuffer = useCallback(
    (chunks: Float32Array[], sampleRate: number) => {
      if (chunks.length === 0) return;

      const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
      const buffer = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }

      setIsModelLoading(true);
      getWorker().postMessage(
        {
          type: "transcribe",
          audio: buffer,
          language: nllbToWhisperLanguage(language),
          sampleRate,
        } satisfies WhisperRequest,
        [buffer.buffer],
      );
    },
    [language, getWorker],
  );

  const stopRecording = useCallback(() => {
    if (!isRecording) return;

    const chunks = [...audioChunksRef.current];
    const sampleRate = audioContextRef.current?.sampleRate ?? 16000;
    void clearAudioResources();
    setPartialTranscript("");
    setIsRecording(false);
    transcribeBuffer(chunks, sampleRate);
  }, [clearAudioResources, isRecording, transcribeBuffer]);

  const startRecording = useCallback(async () => {
    if (isModelLoading) return;

    setError("");
    setPartialTranscript("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      await audioContext.audioWorklet.addModule(
        new URL("../workers/audio-capture.worklet.ts", import.meta.url),
      );

      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      const processorNode = new AudioWorkletNode(audioContext, "audio-capture-processor");
      processorNodeRef.current = processorNode;

      audioChunksRef.current = [];
      silenceStartedAtRef.current = performance.now();

      processorNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
        const samples = event.data;
        let sum = 0;
        for (let i = 0; i < samples.length; i += 1) {
          sum += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sum / samples.length);
        const now = performance.now();

        audioChunksRef.current.push(new Float32Array(samples));

        if (rms > VOICE_ACTIVITY_THRESHOLD) {
          silenceStartedAtRef.current = null;
        } else if (silenceStartedAtRef.current === null) {
          silenceStartedAtRef.current = now;
        } else if (now - silenceStartedAtRef.current >= SILENCE_TIMEOUT_MS) {
          const chunks = [...audioChunksRef.current];
          const sampleRate = audioContext.sampleRate;
          silenceStartedAtRef.current = null;
          void clearAudioResources();
          setPartialTranscript("");
          setIsRecording(false);
          transcribeBuffer(chunks, sampleRate);
        }
      };

      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;
      silentGainRef.current = silentGain;

      sourceNode.connect(processorNode);
      processorNode.connect(silentGain);
      silentGain.connect(audioContext.destination);

      setIsRecording(true);
    } catch (err) {
      await clearAudioResources();
      setError(
        err instanceof Error ? err.message : "Не удалось запустить распознавание.",
      );
    }
  }, [isModelLoading, clearAudioResources, transcribeBuffer]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setPartialTranscript("");
    setError("");
  }, []);

  const dispose = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    void clearAudioResources();
  }, [clearAudioResources]);

  return {
    isRecording,
    isModelLoading,
    transcript,
    setTranscript,
    partialTranscript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    dispose,
  };
}
