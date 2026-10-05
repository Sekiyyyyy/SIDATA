import { useState, useEffect } from 'react';
import { ThemeMode, getSavedTheme, getResolvedTheme, setTheme as setGlobalTheme, initThemeListener } from './theme';

export function useTheme() {
  const [theme, setLocalTheme] = useState<ThemeMode>(() => getSavedTheme());
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => getResolvedTheme());

  useEffect(() => {
    const cleanup = initThemeListener();

    const handleCustomChange = () => {
      setLocalTheme(getSavedTheme());
      setResolvedTheme(getResolvedTheme());
    };

    window.addEventListener('theme-change', handleCustomChange);
    return () => {
      cleanup();
      window.removeEventListener('theme-change', handleCustomChange);
    };
  }, []);

  const changeTheme = (newMode: ThemeMode) => {
    setGlobalTheme(newMode);
    setLocalTheme(newMode);
    setResolvedTheme(getResolvedTheme());
  };

  return {
    theme,
    resolvedTheme,
    setTheme: changeTheme,
    isDark: resolvedTheme === 'dark',
  };
}
