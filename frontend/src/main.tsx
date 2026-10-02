import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import { brand } from '@/config/brand';
import '@/index.css';

const brandCssVariables = {
  '--brand-background': brand.background,
  '--brand-foreground': brand.foreground,
  '--brand-primary': brand.primary,
  '--brand-white': brand.white,
  '--brand-border': brand.border,
  '--brand-text-primary': brand.textPrimary,
  '--brand-scrollbar-thumb': brand.scrollbarThumb,
  '--brand-scrollbar-thumb-hover': brand.scrollbarThumbHover,
  '--brand-glass-panel': brand.glassPanel,
  '--brand-glass-nav': brand.glassNav,
  '--brand-glass-nav-border': brand.glassNavBorder,
  '--brand-glow': brand.glow,
  '--brand-glow-end': brand.glowEnd,
} as const;

Object.entries(brandCssVariables).forEach(([name, value]) => {
  document.documentElement.style.setProperty(name, value);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
