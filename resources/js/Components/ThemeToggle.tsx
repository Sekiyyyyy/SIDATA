import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '@/Utils/useTheme';
import { ThemeMode } from '@/Utils/theme';
import { cn } from '@/Utils/cn';

interface ThemeToggleProps {
  className?: string;
  variant?: 'segmented' | 'compact';
  showLabels?: boolean;
}

export default function ThemeToggle({
  className,
  variant = 'segmented',
  showLabels = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: React.ElementType }[] = [
    { mode: 'light', label: 'Terang', icon: Sun },
    { mode: 'system', label: 'Sistem', icon: Laptop },
    { mode: 'dark', label: 'Gelap', icon: Moon },
  ];

  if (variant === 'compact') {
    // Quick cycling compact button
    const handleNext = () => {
      if (theme === 'system') setTheme('light');
      else if (theme === 'light') setTheme('dark');
      else setTheme('system');
    };

    return (
      <button
        onClick={handleNext}
        className={cn(
          'neu-icon-pill relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition dark:text-slate-300',
          className
        )}
        title={`Tema: ${theme === 'system' ? 'Sistem (' + resolvedTheme + ')' : theme}. Klik untuk ubah.`}
        aria-label="Ganti Tema"
      >
        {theme === 'system' ? (
          <Laptop className="h-4 w-4 text-blue-500" />
        ) : theme === 'dark' ? (
          <Moon className="h-4 w-4 text-indigo-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
        {theme === 'system' && (
          <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 ring-1 ring-white dark:ring-slate-900" />
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'neu-track inline-flex items-center rounded-2xl p-1 gap-1 select-none',
        className
      )}
      role="group"
      aria-label="Pilih Tema"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.mode;

        return (
          <button
            key={opt.mode}
            type="button"
            onClick={() => setTheme(opt.mode)}
            className={cn(
              'group relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none',
              isActive
                ? 'neu-thumb-active text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            )}
            title={`Mode ${opt.label}${opt.mode === 'system' ? ' (Mengikuti warna perangkat default)' : ''}`}
          >
            <Icon
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                isActive && 'scale-110 text-blue-600 dark:text-blue-400',
                !isActive && 'opacity-70 group-hover:opacity-100'
              )}
            />
            {showLabels && (
              <span className="text-[11px] font-medium tracking-tight">
                {opt.label}
              </span>
            )}
            {opt.mode === 'system' && !showLabels && (
              <span className="sr-only">Default Perangkat</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
