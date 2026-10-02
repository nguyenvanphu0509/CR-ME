import React, { useEffect, useState } from 'react';
import { BRAND_CONFIG } from '@/config/brand';

interface PreloaderProps {
  progress: number;
  isReady: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ progress, isReady }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isReady) {
      const timer1 = setTimeout(() => setFadeOut(true), 300);
      const timer2 = setTimeout(() => setShouldRender(false), 900);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isReady]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-background text-brand-foreground transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Brand Ring */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-brand-white/10"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-brand-primary transition-all duration-200"
              strokeWidth="2"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progress) / 100}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="absolute text-2xl font-light font-display tracking-tight text-brand-foreground">
            {progress}%
          </span>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-display tracking-widest text-brand-foreground mb-2 uppercase">
          {BRAND_CONFIG.name}
        </h1>
        
        <p className="text-xs uppercase tracking-[0.25em] text-brand-primary font-medium mb-6">
          ARTISANAL ICE CREAM
        </p>

        <div className="flex items-center space-x-2 text-xs text-brand-white/40 tracking-wider">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
          <span>Handcrafting your experience...</span>
        </div>
      </div>
    </div>
  );
};
