import React, { useState } from 'react';
import { Sparkles, Check, Plus, RefreshCw, ShoppingBag } from 'lucide-react';
import { TOPPINGS_LIST, ToppingOption, ProductFlavor, FLAVOR_LIST } from '@/config/brand';

interface ToppingBuilderProps {
  onOrderCustom: (flavor: ProductFlavor, toppings: ToppingOption[]) => void;
}

export const ToppingBuilder: React.FC<ToppingBuilderProps> = ({ onOrderCustom }) => {
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor>(FLAVOR_LIST[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['waffle-bites', 'honeycomb']);

  const toggleTopping = (id: string) => {
    if (selectedToppings.includes(id)) {
      if (selectedToppings.length > 1) {
        setSelectedToppings(selectedToppings.filter((t) => t !== id));
      }
    } else {
      if (selectedToppings.length < 4) {
        setSelectedToppings([...selectedToppings, id]);
      }
    }
  };

  const currentToppingObjects = TOPPINGS_LIST.filter((t) => selectedToppings.includes(t.id));

  return (
    <section id="topping-section" className="relative py-28 bg-brand-secondary text-brand-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-primary mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CUSTOM CRAFT</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-brand-foreground mb-4">
            Build Your Swirl
          </h2>
          <p className="text-sm md:text-base text-brand-white/70 font-light">
            Pair our organic Tahitian vanilla or dark cocoa soft serve with up to 4 hand-picked artisanal toppings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Base Flavor Selector */}
          <div className="lg:col-span-5 bg-brand-surface p-8 rounded-3xl border border-brand-white/10 space-y-6">
            <h3 className="text-lg font-display font-semibold text-brand-foreground border-b border-brand-white/10 pb-4">
              1. Choose Base Soft Serve
            </h3>

            <div className="space-y-3">
              {FLAVOR_LIST.map((flavor) => {
                const isSelected = selectedFlavor.id === flavor.id;
                return (
                  <button
                    key={flavor.id}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left ${
                      isSelected
                        ? 'bg-brand-white/10 border-brand-primary shadow-lg shadow-brand-primary/10'
                        : 'bg-brand-white/5 border-brand-white/5 hover:border-brand-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: flavor.primaryColor }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-brand-foreground">{flavor.name}</p>
                        <p className="text-xs text-brand-white/50">{flavor.tagline}</p>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-brand-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toppings Picker */}
          <div className="lg:col-span-7 bg-brand-surface p-8 rounded-3xl border border-brand-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-white/10 pb-4">
              <h3 className="text-lg font-display font-semibold text-brand-foreground">
                2. Select Toppings ({selectedToppings.length}/4)
              </h3>
              <button
                onClick={() => setSelectedToppings(['waffle-bites'])}
                className="text-xs text-brand-white/40 hover:text-brand-white flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Toppings Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOPPINGS_LIST.map((topping) => {
                const isSelected = selectedToppings.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                      isSelected
                        ? 'bg-brand-white/10 border-brand-primary shadow-md'
                        : 'bg-brand-white/5 border-brand-white/5 hover:border-brand-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-brand-foreground">{topping.name}</span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-brand-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-brand-white/40" />
                      )}
                    </div>
                    <p className="text-xs text-brand-white/50 leading-relaxed font-light">
                      {topping.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Live Combination Summary Bar */}
            <div className="pt-6 border-t border-brand-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-brand-white/50 block">Selected Combination:</span>
                <p className="text-sm font-semibold text-brand-foreground">
                  {selectedFlavor.name} with {currentToppingObjects.map((t) => t.name).join(', ')}
                </p>
              </div>

              <button
                onClick={() => onOrderCustom(selectedFlavor, currentToppingObjects)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primaryHover text-brand-background font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Custom Swirl</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
