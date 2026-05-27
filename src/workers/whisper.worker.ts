import { env, pipeline } from "@huggingface/transformers";
import type { WhisperRequest, WhisperResponse } from "../types";

const WHISPER_MODEL = "Xenova/whisper-small";

type ASRPipeline = (
  audio: Float32Array,
  options?: Record<string, unknown>,
) => Promise<{ text: string }>;

let pipelinePromise: Promise<ASRPipeline> | null = null;
const fileProgress = new Map<string, number>();
let lastLoadingProgress = 0;

type LoaderProgressInfo = {
  status: "initiate" | "download" | "progress" | "done" | "ready";
  file?: string;
  progress?: number;
};

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function getAggregatedProgress(): number {
  if (fileProgress.size === 0) return lastLoadingProgress;
  let sum = 0;
  for (const value of fileProgress.values()) sum += value;
  return Math.round(sum / fileProgress.size);
}

function emitLoadingProgress(data: LoaderProgressInfo): void {
  const file = data.file;
  if (file && data.status === "initiate") {
    fileProgress.set(file, 0);
  } else if (file && data.status === "progress" && typeof data.progress === "number") {
    fileProgress.set(file, clampPercentage(data.progress));
  } else if (file && data.status === "done") {
    fileProgress.set(file, 100);
  }

  const stage =
    data.status === "ready"
      ? "Model ready"
      : data.status === "done" && getAggregatedProgress() >= 100
        ? "Initializing model"
        : "Loading model";
  const progress = clampPercentage(
    data.status === "ready" ? 100 : Math.max(lastLoadingProgress, getAggregatedProgress()),
  );

  lastLoadingProgress = progress;
  self.postMessage({
    type: "loading-progress",
    progress,
    stage,
    status: data.status,
    file,
  } satisfies WhisperResponse);
}

function resetLoadingState(): void {
  fileProgress.clear();
  lastLoadingProgress = 0;
}

async function getASR(): Promise<ASRPipeline> {
  if (pipelinePromise) return pipelinePromise;

  const progressCallback = (progressInfo: LoaderProgressInfo) => {
    emitLoadingProgress(progressInfo);
  };

  pipelinePromise = (async () => {
    if (env.backends?.onnx?.wasm) {
      env.backends.onnx.wasm.numThreads = 1;
    }
    try {
      return (await pipeline("automatic-speech-recognition", WHISPER_MODEL, {
        dtype: "q8",
        progress_callback: progressCallback,
      })) as unknown as ASRPipeline;
    } catch {
      resetLoadingState();
      return (await pipeline("automatic-speech-recognition", WHISPER_MODEL, {
        dtype: "q4",
        progress_callback: progressCallback,
      })) as unknown as ASRPipeline;
    }
  })();

  return pipelinePromise;
}

self.onmessage = async (event: MessageEvent<WhisperRequest>) => {
  const data = event.data;

  if (data.type === "warmup") {
    try {
      resetLoadingState();
      emitLoadingProgress({ status: "initiate" });
      await getASR();
      emitLoadingProgress({ status: "ready" });
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
