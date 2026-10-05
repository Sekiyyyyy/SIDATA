import React from 'react';
import { cn } from '@/Utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withBezel?: boolean;
  withGlow?: boolean;
}

export default function Logo({
  className,
  size = 'md',
  withBezel = true,
  withGlow = false,
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const imgSizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 transition-transform duration-200',
        sizeClasses[size],
        withBezel && 'neu-flat-sm rounded-2xl p-1.5',
        withGlow && 'shadow-[0_0_25px_rgba(59,130,246,0.35)]',
        className
      )}
    >
      <img
        src="/images/logo.png"
        alt="SMK Negeri 1 Beringin Deli Serdang"
        className={cn(
          'object-contain rounded-xl select-none pointer-events-none drop-shadow-sm',
          imgSizeClasses[size]
        )}
        onError={(e) => {
          // Fallback to assets path if needed
          const target = e.currentTarget;
          if (target.src !== '/assets/logo.png') {
            target.src = '/assets/logo.png';
          }
        }}
      />
    </div>
  );
}
