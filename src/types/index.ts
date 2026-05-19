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
