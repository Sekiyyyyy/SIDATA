import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { SharedProps } from '@/Types';
import { cn } from '@/Utils/cn';

export default function FlashMessage() {
  const { flash } = usePage<SharedProps>().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (flash?.success) {
      setMessage({ type: 'success', text: flash.success });
      setVisible(true);
      setProgress(100);
    } else if (flash?.error) {
      setMessage({ type: 'error', text: flash.error });
      setVisible(true);
      setProgress(100);
    }
  }, [flash]);

  useEffect(() => {
    if (!visible) return;

    const duration = 5000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setVisible(false);
          return 0;
        }
        return Math.max(0, prev - decrement);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [visible]);

  if (!visible || !message) return null;

  const isSuccess = message.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={cn(
          'neu-alert relative overflow-hidden rounded-2xl p-4 transition-all duration-300',
          isSuccess ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'
        )}
      >
        <div className="flex items-start gap-3.5">
          {/* Tactile Inset Icon Container */}
          <div
            className={cn(
              'neu-inset-sm flex shrink-0 items-center justify-center rounded-xl p-2',
              isSuccess
                ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'
            )}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500" />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className={cn(
                  'h-2 w-2 rounded-full inline-block animate-pulse',
                  isSuccess
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                    : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                )}
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isSuccess ? 'Berhasil' : 'Pemberitahuan'}
              </span>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
              {message.text}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="neu-icon-pill -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
            aria-label="Tutup Notifikasi"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tactile Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-slate-800/50">
          <div
            className={cn(
              'h-full transition-all duration-75',
              isSuccess ? 'bg-emerald-500' : 'bg-rose-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
