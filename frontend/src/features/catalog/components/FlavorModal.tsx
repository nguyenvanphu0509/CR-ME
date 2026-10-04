import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { ProductFlavor } from '@/config/brand';

interface FlavorModalProps {
  flavor: ProductFlavor | null;
  onClose: () => void;
  onOrder: (flavor: ProductFlavor) => void;
}

export const FlavorModal: React.FC<FlavorModalProps> = ({ flavor, onClose, onOrder }) => {
  if (!flavor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-brand-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-brand-foreground overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-brand-white/5 hover:bg-brand-white/10 text-brand-white/70 hover:text-brand-white transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-[0.25em] px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: `${flavor.accentColor}20`, color: flavor.accentColor }}
          >
            {flavor.badge}
          </span>
          <h3 className="text-3xl md:text-4xl font-display font-semibold text-brand-foreground">
            {flavor.name}
          </h3>
          <p className="text-sm text-brand-white/60 font-light mt-1">{flavor.tagline}</p>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-brand-white/80 leading-relaxed font-light mb-8 border-l-2 border-brand-primary pl-4">
          {flavor.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Ingredients */}
          <div className="bg-brand-white/5 p-4 rounded-2xl border border-brand-white/5">
            <h4 className="text-xs uppercase tracking-widest text-brand-primary font-bold mb-3 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Ingredients</span>
            </h4>
            <ul className="space-y-2 text-xs text-brand-white/70">
              {flavor.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Texture & Notes */}
          <div className="bg-brand-white/5 p-4 rounded-2xl border border-brand-white/5">
            <h4 className="text-xs uppercase tracking-widest text-brand-primary font-bold mb-3">
              Texture & Profile
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {flavor.textureNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-brand-white/10 px-2.5 py-1 rounded-lg text-brand-white/80"
                >
                  {note}
                </span>
              ))}
            </div>
            <p className="text-xs text-brand-white/50 italic">{flavor.pairing}</p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-brand-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-white/60 hover:text-brand-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onOrder(flavor);
              onClose();
            }}
            className="bg-brand-primary hover:bg-brand-primaryHover text-brand-background font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all transform hover:scale-105"
          >
            Order This Flavor
          </button>
        </div>
      </div>
    </div>
  );
};
