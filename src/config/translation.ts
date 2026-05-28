// Debounce between the last user keystroke / finalized transcript and the
// actual translation request. Higher value — fewer wasted inferences.
export const TRANSLATION_DEBOUNCE_MS = 300;

// Maximum number of characters per chunk fed into the NLLB model.
export const MAX_CHUNK_CHARS = 220;

// NLLB generation parameters.
export const TRANSLATION_MAX_NEW_TOKENS = 96;
export const TRANSLATION_NUM_BEAMS = 1;
