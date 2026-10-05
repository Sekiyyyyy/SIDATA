export type ThemeMode = 'light' | 'dark' | 'system';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getSavedTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('theme') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

export function getResolvedTheme(): 'light' | 'dark' {
  const mode = getSavedTheme();
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isDark = mode === 'dark' || (mode === 'system' && getSystemTheme() === 'dark');

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update meta color-scheme
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

export function setTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', mode);
  applyTheme(mode);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: mode }));
}

export function initThemeListener(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Apply initially
  applyTheme(getSavedTheme());

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    if (getSavedTheme() === 'system') {
      applyTheme('system');
      window.dispatchEvent(new CustomEvent('theme-change', { detail: 'system' }));
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    mediaQuery.addListener(handleChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.removeListener(handleChange);
    }
  };
}
