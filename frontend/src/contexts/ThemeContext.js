import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Theme choices
const themes = { light: 'light', dark: 'dark' };
const STORAGE_KEY = 'theme';

const ThemeContext = createContext({
  theme: themes.light,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(themes.light);

  // Apply theme class to <html>
  const applyTheme = useCallback((nextTheme) => {
    const root = document.documentElement;
    if (nextTheme === themes.dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Load initial preference (localStorage or system)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === themes.dark || stored === themes.light) {
      setThemeState(stored);
      applyTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = prefersDark ? themes.dark : themes.light;
    setThemeState(initial);
    applyTheme(initial);
  }, [applyTheme]);

  // Persist and apply when changing
  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const next = theme === themes.dark ? themes.light : themes.dark;
    setTheme(next);
  }, [theme, setTheme]);

  const value = {
    theme,
    isDark: theme === themes.dark,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
