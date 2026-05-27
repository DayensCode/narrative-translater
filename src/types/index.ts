export type WhisperRequest =
  | { type: "warmup" }
  | { type: "transcribe"; audio: Float32Array; language: string | undefined; sampleRate: number };

export type WhisperLoadingStatus = "initiate" | "download" | "progress" | "done" | "ready";

export type WhisperResponse =
  | { type: "ready" }
  | {
      type: "loading-progress";
      progress: number;
      stage: string;
      status: WhisperLoadingStatus;
      file?: string;
    }
  | { type: "result"; text: string }
  | { type: "error"; message: string };

export type TranslationRequest =
  | { id: number; action: "warmup" }
  | {
      id: number;
      action: "translate";
      text: string;
      sourceLanguage: string;
      targetLanguage: string;
    };

export type TranslationResponse = {
  id: number;
  action: "warmup" | "translate";
  translatedText: string;
  error?: string;
};

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};
