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

async function resampleAudioTo16k(
  chunks: Float32Array[],
  sourceSampleRate: number,
  lastVoiceChunkIdx: number,
): Promise<Float32Array> {
  const TRAILING_CHUNKS = Math.ceil(sourceSampleRate * 0.15 / 128);
  const trimEnd = Math.min(lastVoiceChunkIdx + TRAILING_CHUNKS, chunks.length - 1);
  const trimmedChunks = chunks.slice(0, trimEnd + 1);

  const totalLength = trimmedChunks.reduce((n, c) => n + c.length, 0);
  if (totalLength === 0) return new Float32Array(0);

  if (sourceSampleRate === 16000) {
    const out = new Float32Array(totalLength);
    let off = 0;
    for (const chunk of trimmedChunks) { out.set(chunk, off); off += chunk.length; }
    return out;
  }

  const inputBuffer = new AudioBuffer({
    length: totalLength,
    numberOfChannels: 1,
    sampleRate: sourceSampleRate,
  });
  const channelData = inputBuffer.getChannelData(0);
  let off = 0;
  for (const chunk of trimmedChunks) { channelData.set(chunk, off); off += chunk.length; }

  const targetLength = Math.ceil((totalLength / sourceSampleRate) * 16000);
  const offlineCtx = new OfflineAudioContext(1, targetLength, 16000);
  const source = offlineCtx.createBufferSource();
  source.buffer = inputBuffer;
  source.connect(offlineCtx.destination);
  source.start();

  const rendered = await offlineCtx.startRendering();
  return rendered.getChannelData(0);
}

export function useSpeechRecognition(language: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
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
  const lastVoiceChunkIdxRef = useRef(-1);

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
        setIsTranscribing(false);
        if (data.text) {
          setTranscript((prev: string) => (prev ? `${prev} ${data.text}` : data.text));
        }
      } else if (data.type === "error") {
        setIsModelLoading(false);
        setIsTranscribing(false);
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
    lastVoiceChunkIdxRef.current = -1;

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
    (chunks: Float32Array[], sampleRate: number, lastVoiceIdx: number) => {
      if (chunks.length === 0 || lastVoiceIdx < 0) return;

      setIsTranscribing(true);
      void resampleAudioTo16k(chunks, sampleRate, lastVoiceIdx).then((audio) => {
        if (audio.length === 0) { setIsTranscribing(false); return; }
        getWorker().postMessage(
          {
            type: "transcribe",
            audio,
            language: nllbToWhisperLanguage(language),
            sampleRate: 16000,
          } satisfies WhisperRequest,
          [audio.buffer],
        );
      });
    },
    [language, getWorker],
  );

  const stopRecording = useCallback(() => {
    if (!isRecording) return;

    const chunks = [...audioChunksRef.current];
    const sampleRate = audioContextRef.current?.sampleRate ?? 16000;
    const lastVoiceIdx = lastVoiceChunkIdxRef.current;
    void clearAudioResources();
    setPartialTranscript("");
    setIsRecording(false);
    transcribeBuffer(chunks, sampleRate, lastVoiceIdx);
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
          noiseSuppression: false,
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
          lastVoiceChunkIdxRef.current = audioChunksRef.current.length - 1;
          silenceStartedAtRef.current = null;
        } else if (silenceStartedAtRef.current === null) {
          silenceStartedAtRef.current = now;
        } else if (now - silenceStartedAtRef.current >= SILENCE_TIMEOUT_MS) {
          const chunks = [...audioChunksRef.current];
          const sampleRate = audioContext.sampleRate;
          const lastVoiceIdx = lastVoiceChunkIdxRef.current;
          silenceStartedAtRef.current = null;
          void clearAudioResources();
          setPartialTranscript("");
          setIsRecording(false);
          transcribeBuffer(chunks, sampleRate, lastVoiceIdx);
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
    isTranscribing,
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
