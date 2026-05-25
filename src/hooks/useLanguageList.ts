import { useCallback, useState } from "react";
import {
  DEFAULT_LANGUAGE_CODES,
  NLLB_LANGUAGES_BY_CODE,
  type NllbLanguage,
} from "../nllb-languages";

const STORAGE_KEY = "selected-languages";

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((c): c is string => typeof c === "string");
      }
    }
  } catch {
    // ignore
  }
  return [...DEFAULT_LANGUAGE_CODES];
}

function saveToStorage(codes: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
}

export function useLanguageList() {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(loadFromStorage);

  const addLanguage = useCallback((code: string) => {
    setSelectedCodes((prev) => {
      if (prev.includes(code)) return prev;
      const next = [...prev, code];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeLanguage = useCallback((code: string) => {
    setSelectedCodes((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((c) => c !== code);
      saveToStorage(next);
      return next;
    });
  }, []);

  const selectedLanguages: NllbLanguage[] = selectedCodes
    .map((code) => NLLB_LANGUAGES_BY_CODE.get(code))
    .filter((l): l is NllbLanguage => l !== undefined);

  return { selectedCodes, selectedLanguages, addLanguage, removeLanguage };
}
