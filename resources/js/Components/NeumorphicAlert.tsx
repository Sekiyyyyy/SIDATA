import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/Utils/cn';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface NeumorphicAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  compact?: boolean;
}

const variantConfig: Record<
  AlertVariant,
  {
    icon: React.ElementType;
    iconColor: string;
    glowColor: string;
    barColor: string;
    dotColor: string;
    bgTint: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    barColor: 'bg-emerald-500',
    dotColor: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    bgTint: 'border-l-4 border-l-emerald-500',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
    glowColor: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    barColor: 'bg-rose-500',
    dotColor: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    bgTint: 'border-l-4 border-l-rose-500',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    barColor: 'bg-amber-500',
    dotColor: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    bgTint: 'border-l-4 border-l-amber-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    glowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    barColor: 'bg-blue-500',
    dotColor: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]',
    bgTint: 'border-l-4 border-l-blue-500',
  },
};

export default function NeumorphicAlert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  compact = false,
}: NeumorphicAlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        'neu-alert relative flex items-start gap-3.5 rounded-2xl p-4 transition-all duration-200',
        config.bgTint,
        className
      )}
    >
      {/* Tactile Inset Icon Well */}
      <div
        className={cn(
          'neu-inset-sm flex shrink-0 items-center justify-center rounded-xl p-2',
          config.glowColor
        )}
      >
        <Icon className={cn('h-5 w-5', config.iconColor)} />
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 mb-0.5">
          {/* Glowing Status Dot */}
          <span className={cn('h-2 w-2 rounded-full inline-block animate-pulse', config.dotColor)} />
          {title && (
            <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h4>
          )}
        </div>
        <div className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </div>

      {/* Dismiss Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="neu-icon-pill -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
