import { env, pipeline, type DataType, type PipelineType } from "@huggingface/transformers";

export type LoaderProgressInfo = {
  status: "initiate" | "download" | "progress" | "done" | "ready";
  file?: string;
  progress?: number;
};

export type HfPipelineOptions = {
  progressCallback?: (info: LoaderProgressInfo) => void;
  /**
   * Pin a specific HF revision (commit sha / branch / tag). Without this the
   * hub resolves to `main`, which can silently move underneath us — a
   * non-starter for a confidential build where we want the model bytes to
   * match what we audited.
   */
  revision?: string;
};

/**
 * Configures the ONNX WASM backend.
 *
 * 1. Threading: multiple threads require `SharedArrayBuffer`, which in turn
 *    requires cross-origin isolation (COOP+COEP). Without it we must stay
 *    single-threaded.
 * 2. Asset path: by default transformers.js loads the ORT runtime
 *    (`ort-wasm-simd-threaded.jsep.mjs` + `.wasm`) from
 *    `cdn.jsdelivr.net`. That conflicts with our `script-src 'self'` CSP
 *    (the `.mjs` is fetched as a dynamic ES module) and creates a hard
 *    third-party supply-chain dependency for an offline-first PWA. We
 *    self-host the two files in `/public/onnx/` and pin ORT to that path.
 */
function configureOnnxWasm(): void {
  if (!env.backends?.onnx?.wasm) return;
  const cores = self.navigator?.hardwareConcurrency ?? 1;
  const isIsolated =
    typeof (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated !==
      "undefined" && (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated;
  env.backends.onnx.wasm.numThreads = isIsolated ? Math.min(4, Math.max(1, cores)) : 1;

  const origin =
    typeof self !== "undefined" && self.location?.origin
      ? self.location.origin
      : "";
  // Trailing slash matters: ORT does string concatenation, not URL joining.
  env.backends.onnx.wasm.wasmPaths = `${origin}/onnx/`;
}

/**
 * Detects private / incognito browsing (best-effort). We don't have a reliable
 * API for this, so we probe Cache Storage: in Firefox private windows it
 * throws, in Chrome incognito storage.estimate() reports a very small quota.
 */
async function detectRestrictedStorage(): Promise<boolean> {
  try {
    if (typeof caches === "undefined") return true;
    await caches.open("narrative-probe").then((c) => caches.delete("narrative-probe").then(() => c));
  } catch {
    return true;
  }

  try {
    const est = await (navigator as { storage?: { estimate?: () => Promise<{ quota?: number }> } })
      .storage?.estimate?.();
    // < 700 MB is a strong indicator of incognito-like quotas (real devices
    // report tens of GB even on phones).
    if (est && typeof est.quota === "number" && est.quota < 700 * 1024 * 1024) {
      return true;
    }
  } catch {
    // estimate unavailable — assume normal storage
  }
  return false;
}

/**
 * Heuristic: choose a quantization level before we start downloading gigabytes
 * of weights. If the device is low on RAM or storage is restricted (private
 * browsing), prefer the smaller q4 build so we don't blow the quota mid-load.
 */
export async function pickPreferredDtype(): Promise<DataType> {
  const mem = (self.navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  const cores = self.navigator?.hardwareConcurrency ?? 1;
  if (mem < 4 || cores <= 2) return "q4";
  if (await detectRestrictedStorage()) return "q4";
  return "q8";
}

/**
 * Creates an HF pipeline with a sensible dtype picked up front (no
 * download-then-fail-then-retry cycle) and ONNX threading configured.
 *
 * The return type is intentionally `unknown`: task-specific pipelines have
 * very different shapes and the discriminated union confuses TS quickly.
 * Callers cast to their concrete pipeline type.
 */
export async function createHfPipeline(
  task: PipelineType,
  model: string,
  options: HfPipelineOptions = {},
): Promise<unknown> {
  configureOnnxWasm();
  const dtype = await pickPreferredDtype();
  return await pipeline(task, model, {
    dtype,
    progress_callback: options.progressCallback,
    revision: options.revision,
  });
}
