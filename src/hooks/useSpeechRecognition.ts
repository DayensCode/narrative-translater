import { createModel, type KaldiRecognizer, type Model } from "vosk-browser";
import { useCallback, useRef, useState } from "react";
import {
  AUDIO_SAMPLE_RATE,
  SILENCE_TIMEOUT_MS,
  VOICE_ACTIVITY_THRESHOLD,
} from "../config";

export function useSpeechRecognition(modelUrl: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState("");

  const modelRef = useRef<Model | null>(null);
  const recognizerRef = useRef<KaldiRecognizer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<AudioWorkletNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const silenceStartedAtRef = useRef<number | null>(null);

  const clearAudioResources = useCallback(async () => {
    silenceStartedAtRef.current = null;

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
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const ensureModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current;
    setIsModelLoading(true);
    try {
      const model = await createModel(modelUrl);
      modelRef.current = model;
      return model;
    } finally {
      setIsModelLoading(false);
    }
  }, [modelUrl]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;

    const recognizer = recognizerRef.current;
    if (recognizer) {
      recognizer.retrieveFinalResult();
      recognizer.remove();
      recognizerRef.current = null;
    }

    silenceStartedAtRef.current = null;
    void clearAudioResources();
    setPartialTranscript("");
    setIsRecording(false);
  }, [clearAudioResources, isRecording]);

  const startRecording = useCallback(async () => {
    if (isModelLoading) return;

    setError("");
    setPartialTranscript("");

    try {
      const model = await ensureModel();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: AUDIO_SAMPLE_RATE,
        },
      });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      await audioContext.audioWorklet.addModule(
        new URL("../workers/audio-capture.worklet.ts", import.meta.url),
      );

      const recognizer = new model.KaldiRecognizer(audioContext.sampleRate);
      recognizerRef.current = recognizer;

      recognizer.on("result", (message) => {
        const { text } = (message as { result: { text: string } }).result;
        if (!text.trim()) return;
        setTranscript((prev) => (prev ? `${prev} ${text.trim()}` : text.trim()));
      });

      recognizer.on("partialresult", (message) => {
        setPartialTranscript(
          (message as { result: { partial: string } }).result.partial.trim(),
        );
      });

      recognizer.on("error", (message) => {
        setError(
          (message as { error?: string }).error ?? "Ошибка распознавания Vosk.",
        );
      });

      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      const processorNode = new AudioWorkletNode(
        audioContext,
        "audio-capture-processor",
      );
      processorNodeRef.current = processorNode;

      processorNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
        try {
          const samples = event.data;
          let sum = 0;
          for (let i = 0; i < samples.length; i += 1) {
            sum += samples[i] * samples[i];
          }
          const rms = Math.sqrt(sum / samples.length);
          const now = performance.now();

          if (rms > VOICE_ACTIVITY_THRESHOLD) {
            silenceStartedAtRef.current = null;
          } else if (silenceStartedAtRef.current === null) {
            silenceStartedAtRef.current = now;
          } else if (now - silenceStartedAtRef.current >= SILENCE_TIMEOUT_MS) {
            recognizer.retrieveFinalResult();
            recognizer.remove();
            recognizerRef.current = null;
            silenceStartedAtRef.current = null;
            void clearAudioResources();
            setPartialTranscript("");
            setIsRecording(false);
            return;
          }

          recognizer.acceptWaveformFloat(samples, audioContext.sampleRate);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось обработать аудиопоток.",
          );
        }
      };

      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;
      silentGainRef.current = silentGain;
      silenceStartedAtRef.current = performance.now();

      sourceNode.connect(processorNode);
      processorNode.connect(silentGain);
      silentGain.connect(audioContext.destination);

      setIsRecording(true);
    } catch (err) {
      await clearAudioResources();
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось запустить распознавание.",
      );
    }
  }, [isModelLoading, clearAudioResources, ensureModel]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setPartialTranscript("");
    setError("");
  }, []);

  const dispose = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.remove();
      recognizerRef.current = null;
    }
    if (modelRef.current) {
      modelRef.current.terminate();
      modelRef.current = null;
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
