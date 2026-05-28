import { useEffect, useState } from "react";

export const ThemeMode = {
  System: "system",
  Light: "light",
  Dark: "dark",
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];
export type ResolvedTheme = typeof ThemeMode.Light | typeof ThemeMode.Dark;

const STORAGE_KEY = "narrative-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return ThemeMode.Light;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ThemeMode.Dark
    : ThemeMode.Light;
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return ThemeMode.System;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return Object.values(ThemeMode).includes(saved as ThemeMode)
      ? (saved as ThemeMode)
      : ThemeMode.System;
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    getSystemTheme(),
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      setResolvedTheme(theme === ThemeMode.System ? getSystemTheme() : theme);
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Applying the theme to <html> instead of <body> means the boot snippet in
  // index.html can pre-apply it and we avoid a flash of light theme on dark
  // systems.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  return { theme, resolvedTheme, setTheme };
}
