import React from 'react';
import { BRAND_CONFIG } from '@/config/brand';
import { Instagram, Twitter, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  return (
    <footer className="bg-brand-background text-brand-white/60 border-t border-brand-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-brand-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-3xl font-display font-bold tracking-widest text-brand-foreground block">
              {BRAND_CONFIG.name}
            </span>
            <p className="text-xs text-brand-white/50 max-w-sm leading-relaxed font-light">
              Artisanal soft serve, golden craft waffles, and organic ingredient storytelling churned daily.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="p-2.5 rounded-full bg-brand-white/5 hover:bg-brand-white/10 text-brand-white/80 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-brand-white/5 hover:bg-brand-white/10 text-brand-white/80 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-brand-white/5 hover:bg-brand-white/10 text-brand-white/80 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-brand-primary font-bold">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateSection('hero-section')} className="hover:text-white transition-colors">
                  Home Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('flavors-section')} className="hover:text-white transition-colors">
                  Artisanal Flavors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('story-section')} className="hover:text-white transition-colors">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('topping-section')} className="hover:text-white transition-colors">
                  Swirl Customizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('stores-section')} className="hover:text-white transition-colors">
                  Parlor Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Pledge */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-brand-primary font-bold">The Crema Quality Pledge</h4>
            <p className="text-xs text-brand-white/50 leading-relaxed font-light">
              Every cone served at Crema is prepared with organic pasture-raised cream, real fruit purees, and cocoa sourced from sustainable single-origin farms.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-white/40 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-brand-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-white/70 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-white/70 transition-colors">Allergen Guide</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
