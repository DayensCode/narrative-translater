// AudioWorkletGlobalScope globals — not in WebWorker lib, declared locally.
declare abstract class AudioWorkletProcessor {
  readonly port: MessagePort;
  abstract process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean;
}
declare function registerProcessor(
  name: string,
  ctor: new (...args: unknown[]) => AudioWorkletProcessor,
): void;

class AudioCaptureProcessor extends AudioWorkletProcessor {
  process(inputs: Float32Array[][], _outputs: Float32Array[][]): boolean {
    const channel = inputs[0]?.[0];
    if (channel) {
      this.port.postMessage(channel);
    }
    return true;
  }
}

registerProcessor("audio-capture-processor", AudioCaptureProcessor);
