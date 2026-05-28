import { describe, expect, it } from "vitest";
import { normalizeUiLocale } from "../src/languages";

describe("normalizeUiLocale", () => {
  it("falls back to English for undefined input", () => {
    expect(normalizeUiLocale(undefined)).toBe("en");
  });

  it("accepts a short language code", () => {
    expect(normalizeUiLocale("ru")).toBe("ru");
    expect(normalizeUiLocale("zh")).toBe("zh");
  });

  it("accepts BCP-47-style codes", () => {
    expect(normalizeUiLocale("ru-RU")).toBe("ru");
    expect(normalizeUiLocale("zh-Hant-TW")).toBe("zh");
  });

  it("falls back to English for unknown locales", () => {
    expect(normalizeUiLocale("xx")).toBe("en");
    expect(normalizeUiLocale("de-DE")).toBe("en");
  });
});
