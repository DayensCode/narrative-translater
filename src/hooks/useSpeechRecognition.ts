import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUDIO_SAMPLE_RATE,
  SILENCE_TIMEOUT_MS,
  VOICE_ACTIVITY_THRESHOLD,
} from "../config";
import { getWhisperLanguage } from "../nllb-languages";
import type { WhisperRequest, WhisperResponse } from "../types";

type AudioCaptureMessage = {
  samples: Float32Array;
  rms: number;
};

/**
 * Stitches captured batches together and, if the hardware rate doesn't match
 * Whisper's 16 kHz, resamples via an OfflineAudioContext.
 *
 * `lastVoiceBatchIdx` marks the last batch that actually contained voice; we
 * keep ~150 ms of trailing silence after it for natural-sounding cutoff and
 * drop the rest to avoid feeding silence into the model.
 */
async function prepareWhisperAudio(
  batches: Float32Array[],
  sourceSampleRate: number,
  lastVoiceBatchIdx: number,
): Promise<Float32Array> {
  if (batches.length === 0 || lastVoiceBatchIdx < 0) return new Float32Array(0);

  const firstBatchLength = batches[0].length;
  const trailingBatches = Math.max(
    1,
    Math.ceil((sourceSampleRate * 0.15) / firstBatchLength),
  );
  const trimEnd = Math.min(
    lastVoiceBatchIdx + trailingBatches,
    batches.length - 1,
  );
  const trimmed = batches.slice(0, trimEnd + 1);

  const totalLength = trimmed.reduce((n, c) => n + c.length, 0);
  if (totalLength === 0) return new Float32Array(0);

  if (sourceSampleRate === AUDIO_SAMPLE_RATE) {
    const out = new Float32Array(totalLength);
    let off = 0;
    for (const chunk of trimmed) {
      out.set(chunk, off);
      off += chunk.length;
    }
    return out;
  }

  const inputBuffer = new AudioBuffer({
    length: totalLength,
    numberOfChannels: 1,
    sampleRate: sourceSampleRate,
  });
  const channelData = inputBuffer.getChannelData(0);
  let off = 0;
  for (const chunk of trimmed) {
    channelData.set(chunk, off);
    off += chunk.length;
  }

  const targetLength = Math.ceil(
    (totalLength / sourceSampleRate) * AUDIO_SAMPLE_RATE,
  );
  const offlineCtx = new OfflineAudioContext(1, targetLength, AUDIO_SAMPLE_RATE);
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
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [modelLoadingStage, setModelLoadingStage] = useState("Loading model");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState("");

  const workerRef = useRef<Worker | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletReadyRef = useRef(false);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<AudioWorkletNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const silenceStartedAtRef = useRef<number | null>(null);
  const audioBatchesRef = useRef<Float32Array[]>([]);
  const lastVoiceBatchIdxRef = useRef(-1);

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
    let warmupDone = false;

    // Safety valve: if warmup never completes (e.g. restricted storage in
    // private browsing corrupts the HF cache flow, or the worker crashes
    // before posting anything back), surface an error to the user instead of
    // hanging on the loader screen forever.
    const WARMUP_TIMEOUT_MS = 90_000;
    const timeoutId = window.setTimeout(() => {
      if (warmupDone) return;
      warmupDone = true;
      setIsModelLoading(false);
      setIsTranscribing(false);
      setError(
        "Модель слишком долго загружается. Проверьте сеть или откройте приложение вне режима инкогнито — в приватных окнах браузера ограничена квота хранилища.",
      );
    }, WARMUP_TIMEOUT_MS);

    const finishWarmup = () => {
      warmupDone = true;
      window.clearTimeout(timeoutId);
    };

    const handleMessage = (event: MessageEvent<WhisperResponse>) => {
      const data = event.data;
      if (data.type === "ready") {
        finishWarmup();
        setModelLoadingProgress(100);
        setModelLoadingStage("Model ready");
        setIsModelLoading(false);
      } else if (data.type === "loading-progress") {
        setModelLoadingProgress((prev) => Math.max(prev, data.progress));
        setModelLoadingStage(data.stage);
      } else if (data.type === "result") {
        setIsTranscribing(false);
        if (data.text) {
          setTranscript((prev: string) =>
            prev ? `${prev} ${data.text}` : data.text,
          );
        }
      } else if (data.type === "error") {
        finishWarmup();
        setIsModelLoading(false);
        setIsTranscribing(false);
        setError(data.message);
      }
    };

    // Unhandled exceptions inside the worker (e.g. a failed dynamic import of
    // the HF library, QuotaExceededError on Cache Storage in private mode)
    // never reach our message handler, so the loading flag would stay `true`
    // forever. Catch them explicitly.
    const handleWorkerError = (event: ErrorEvent | Event) => {
      const message =
        event instanceof ErrorEvent && event.message
          ? event.message
          : "Не удалось инициализировать распознавание речи.";
      console.error("Whisper worker failure:", event);
      finishWarmup();
      setIsModelLoading(false);
      setIsTranscribing(false);
      setError(message);
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleWorkerError);
    worker.addEventListener("messageerror", handleWorkerError);
    worker.postMessage({ type: "warmup" } satisfies WhisperRequest);

    return () => {
      window.clearTimeout(timeoutId);
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleWorkerError);
      worker.removeEventListener("messageerror", handleWorkerError);
    };
  }, [getWorker]);

  /**
   * Lazily create a single long-lived AudioContext. We try 16 kHz up-front so
   * that the resampling step becomes a fast straight copy in the common case.
   */
  const getAudioContext = useCallback(async (): Promise<AudioContext> => {
    let ctx = audioContextRef.current;
    if (!ctx) {
      try {
        ctx = new AudioContext({
          sampleRate: AUDIO_SAMPLE_RATE,
          latencyHint: "interactive",
        });
      } catch {
        ctx = new AudioContext();
      }
      audioContextRef.current = ctx;
    }
    if (!workletReadyRef.current) {
      await ctx.audioWorklet.addModule(
        new URL("../workers/audio-capture.worklet.ts", import.meta.url),
      );
      workletReadyRef.current = true;
    }
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx;
  }, []);

  const releaseAudioGraph = useCallback(() => {
    silenceStartedAtRef.current = null;
    audioBatchesRef.current = [];
    lastVoiceBatchIdxRef.current = -1;

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
      mediaStreamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      mediaStreamRef.current = null;
    }

    const ctx = audioContextRef.current;
    if (ctx && ctx.state === "running") {
      void ctx.suspend();
    }
  }, []);

  const transcribeBatches = useCallback(
    (batches: Float32Array[], sampleRate: number, lastVoiceIdx: number) => {
      if (batches.length === 0 || lastVoiceIdx < 0) return;

      setIsTranscribing(true);
      void prepareWhisperAudio(batches, sampleRate, lastVoiceIdx).then(
        (audio) => {
          if (audio.length === 0) {
            setIsTranscribing(false);
            return;
          }
          getWorker().postMessage(
            {
              type: "transcribe",
              audio,
              language: getWhisperLanguage(language),
              sampleRate: AUDIO_SAMPLE_RATE,
            } satisfies WhisperRequest,
            [audio.buffer],
          );
        },
      );
    },
    [language, getWorker],
  );

  const stopRecording = useCallback(() => {
    if (!isRecording) return;

    const batches = audioBatchesRef.current;
    const sampleRate =
      audioContextRef.current?.sampleRate ?? AUDIO_SAMPLE_RATE;
    const lastVoiceIdx = lastVoiceBatchIdxRef.current;

    releaseAudioGraph();
    setPartialTranscript("");
    setIsRecording(false);
    transcribeBatches(batches, sampleRate, lastVoiceIdx);
  }, [isRecording, releaseAudioGraph, transcribeBatches]);

  const startRecording = useCallback(async () => {
    if (isModelLoading) return;

    setError("");
    setPartialTranscript("");

    try {
      const audioContext = await getAudioContext();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          channelCount: 1,
        },
      });
      mediaStreamRef.current = stream;

      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      const processorNode = new AudioWorkletNode(
        audioContext,
        "audio-capture-processor",
      );
      processorNodeRef.current = processorNode;

      audioBatchesRef.current = [];
      lastVoiceBatchIdxRef.current = -1;
      silenceStartedAtRef.current = performance.now();

      processorNode.port.onmessage = (
        event: MessageEvent<AudioCaptureMessage>,
      ) => {
        const { samples, rms } = event.data;
        audioBatchesRef.current.push(samples);

        const now = performance.now();
        if (rms > VOICE_ACTIVITY_THRESHOLD) {
          lastVoiceBatchIdxRef.current = audioBatchesRef.current.length - 1;
          silenceStartedAtRef.current = null;
          return;
        }

        if (silenceStartedAtRef.current === null) {
          silenceStartedAtRef.current = now;
          return;
        }

        if (now - silenceStartedAtRef.current >= SILENCE_TIMEOUT_MS) {
          const batches = audioBatchesRef.current;
          const sampleRate = audioContext.sampleRate;
          const lastVoiceIdx = lastVoiceBatchIdxRef.current;
          silenceStartedAtRef.current = null;
          releaseAudioGraph();
          setPartialTranscript("");
          setIsRecording(false);
          transcribeBatches(batches, sampleRate, lastVoiceIdx);
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
      releaseAudioGraph();
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось запустить распознавание.",
      );
    }
  }, [isModelLoading, getAudioContext, releaseAudioGraph, transcribeBatches]);

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
    releaseAudioGraph();
    const ctx = audioContextRef.current;
    if (ctx) {
      void ctx.close();
      audioContextRef.current = null;
      workletReadyRef.current = false;
    }
  }, [releaseAudioGraph]);

  return {
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
    dispose,
  };
}
