export const AUDIO_SAMPLE_RATE = 16000;
export const SILENCE_TIMEOUT_MS = 1500;
export const VOICE_ACTIVITY_THRESHOLD = 0.01;

// Frames buffered in the AudioWorklet before they are posted to the main thread.
// Each frame is 128 samples (~2.67 ms at 48 kHz / 8 ms at 16 kHz). 16 frames ≈ 43 / 128 ms.
export const WORKLET_FRAMES_PER_BATCH = 16;
