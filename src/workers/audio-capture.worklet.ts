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

// Each input frame from the audio graph is 128 samples. Batching N frames before
// posting reduces main-thread wakeups ~N× and lets us compute RMS once per batch.
const FRAMES_PER_BATCH = 16;
const FRAME_SIZE = 128;
const BATCH_SAMPLES = FRAMES_PER_BATCH * FRAME_SIZE;

export type AudioCaptureMessage = {
  samples: Float32Array;
  rms: number;
};

class AudioCaptureProcessor extends AudioWorkletProcessor {
  private buffer = new Float32Array(BATCH_SAMPLES);
  private offset = 0;
  private sumSquares = 0;

  process(inputs: Float32Array[][]): boolean {
    const channel = inputs[0]?.[0];
    if (!channel || channel.length === 0) return true;

    const remaining = BATCH_SAMPLES - this.offset;
    const copyLength = Math.min(channel.length, remaining);

    for (let i = 0; i < copyLength; i += 1) {
      const sample = channel[i];
      this.buffer[this.offset + i] = sample;
      this.sumSquares += sample * sample;
    }
    this.offset += copyLength;

    if (this.offset >= BATCH_SAMPLES) {
      const samples = this.buffer;
      const rms = Math.sqrt(this.sumSquares / BATCH_SAMPLES);
      const message: AudioCaptureMessage = { samples, rms };
      this.port.postMessage(message, [samples.buffer]);

      this.buffer = new Float32Array(BATCH_SAMPLES);
      this.offset = 0;
      this.sumSquares = 0;

      const leftover = channel.length - copyLength;
      if (leftover > 0) {
        for (let i = 0; i < leftover; i += 1) {
          const sample = channel[copyLength + i];
          this.buffer[i] = sample;
          this.sumSquares += sample * sample;
        }
        this.offset = leftover;
      }
    }

    return true;
  }
}

registerProcessor("audio-capture-processor", AudioCaptureProcessor);
