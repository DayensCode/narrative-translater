import { env, pipeline } from "@huggingface/transformers";
import type { WhisperRequest, WhisperResponse } from "../types";

const WHISPER_MODEL = "Xenova/whisper-small";

type ASRPipeline = (
  audio: Float32Array,
  options?: Record<string, unknown>,
) => Promise<{ text: string }>;

let pipelinePromise: Promise<ASRPipeline> | null = null;

async function getASR(): Promise<ASRPipeline> {
  if (pipelinePromise) return pipelinePromise;

  pipelinePromise = (async () => {
    if (env.backends?.onnx?.wasm) {
      env.backends.onnx.wasm.numThreads = 1;
    }
    try {
      return (await pipeline("automatic-speech-recognition", WHISPER_MODEL, {
        dtype: "q8",
      })) as unknown as ASRPipeline;
    } catch {
      return (await pipeline("automatic-speech-recognition", WHISPER_MODEL, {
        dtype: "q4",
      })) as unknown as ASRPipeline;
    }
  })();

  return pipelinePromise;
}

self.onmessage = async (event: MessageEvent<WhisperRequest>) => {
  const data = event.data;

  if (data.type === "warmup") {
    try {
      await getASR();
      self.postMessage({ type: "ready" } satisfies WhisperResponse);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось загрузить модель Whisper.";
      self.postMessage({ type: "error", message } satisfies WhisperResponse);
    }
    return;
  }

  if (data.type === "transcribe") {
    const { audio, language, sampleRate } = data;
    try {
      const asr = await getASR();
      const result = await asr(audio, {
        language: language ?? undefined,
        task: "transcribe",
        sampling_rate: sampleRate,
      });
      self.postMessage({ type: "result", text: result.text.trim() } satisfies WhisperResponse);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось распознать речь.";
      self.postMessage({ type: "error", message } satisfies WhisperResponse);
    }
  }
};
