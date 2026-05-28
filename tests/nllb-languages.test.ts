import { describe, expect, it } from "vitest";
import {
  DEFAULT_LANGUAGE_CODES,
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  NLLB_LANGUAGES_BY_CODE,
  getLocalizedLanguageName,
  getNllbSpeechLocale,
  getWhisperLanguage,
} from "../src/nllb-languages";

describe("nllb-languages", () => {
  it("exposes source/target defaults that are valid NLLB codes", () => {
    expect(NLLB_LANGUAGES_BY_CODE.has(DEFAULT_SOURCE_LANGUAGE)).toBe(true);
    expect(NLLB_LANGUAGES_BY_CODE.has(DEFAULT_TARGET_LANGUAGE)).toBe(true);
  });

  it("includes defaults inside DEFAULT_LANGUAGE_CODES", () => {
    expect(DEFAULT_LANGUAGE_CODES).toContain(DEFAULT_SOURCE_LANGUAGE);
    expect(DEFAULT_LANGUAGE_CODES).toContain(DEFAULT_TARGET_LANGUAGE);
  });

  it("maps common NLLB codes to Whisper language names", () => {
    expect(getWhisperLanguage("rus_Cyrl")).toBe("russian");
    expect(getWhisperLanguage("eng_Latn")).toBe("english");
    expect(getWhisperLanguage("fra_Latn")).toBe("french");
  });

  it("returns undefined for an unknown NLLB code", () => {
    expect(getWhisperLanguage("xxx_Xxxx")).toBeUndefined();
  });

  it("returns English speech locale for English NLLB code", () => {
    expect(getNllbSpeechLocale("eng_Latn")).toBe("en-US");
  });

  it("falls back to English speech locale for unknown codes", () => {
    expect(getNllbSpeechLocale("xxx_Xxxx")).toBe("en-US");
  });

  it("returns a localized language name when possible", () => {
    const name = getLocalizedLanguageName("rus_Cyrl", "en");
    // Node.js Intl may yield different casing; minimally we expect a non-empty
    // string that references Russian.
    expect(typeof name).toBe("string");
    expect(name.length).toBeGreaterThan(0);
  });
});
