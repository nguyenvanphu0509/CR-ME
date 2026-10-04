import React, { useEffect, useState } from 'react';
import { Sparkles, Info, RefreshCw, ShoppingBag } from 'lucide-react';
import { getFlavors, toProductFlavor } from '@/features/catalog/api/flavors';
import { ProductFlavor } from '@/config/brand';
import { FlavorModal } from '@/features/catalog/components/FlavorModal';

interface FlavorShowcaseProps {
  onOrderFlavor: (flavor: ProductFlavor) => void;
}

export const FlavorShowcase: React.FC<FlavorShowcaseProps> = ({ onOrderFlavor }) => {
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | null>(null);
  const [flavors, setFlavors] = useState<ProductFlavor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Signature', 'Seasonal', 'Dairy-Free'];

  useEffect(() => {
    let isCancelled = false;

    getFlavors()
      .then((apiFlavors) => {
        if (!isCancelled) {
          setFlavors(apiFlavors.filter((flavor) => flavor.available).map(toProductFlavor));
        }
      })
      .catch((requestError: unknown) => {
        if (!isCancelled) {
          setError(requestError instanceof Error ? requestError.message : 'Không tải được danh sách kem');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [retryCount]);

  const filteredFlavors = activeCategory === 'All'
    ? flavors
    : flavors.filter(f => f.category === activeCategory);

  return (
    <section id="flavors-section" className="relative py-28 bg-brand-secondary text-brand-foreground overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-primary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE COLLECTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-brand-foreground">
              Artisanal Flavors
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-primary text-brand-background shadow-lg shadow-brand-primary/20'
                    : 'bg-brand-white/5 text-brand-white/60 hover:text-brand-white hover:bg-brand-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="py-16 text-center text-sm text-brand-white/60" role="status">
            Đang tải danh sách kem...
          </div>
        )}

        {!isLoading && error && (
          <div className="py-16 text-center" role="alert">
            <p className="text-sm text-brand-white/70 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setRetryCount((count) => count + 1);
              }}
              className="inline-flex items-center space-x-2 bg-brand-primary text-brand-background px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {!isLoading && !error && filteredFlavors.length === 0 && (
          <div className="py-16 text-center text-sm text-brand-white/60">
            Chưa có flavor nào trong danh mục này.
          </div>
        )}

        {!isLoading && !error && filteredFlavors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredFlavors.map((flavor) => (
            <div
              key={flavor.id}
              className="group relative bg-brand-surface rounded-3xl border border-brand-white/5 hover:border-brand-white/20 p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-black/80"
            >
              <div>
                {/* Top Badge & Indicator */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${flavor.accentColor}20`,
                      color: flavor.accentColor,
                    }}
                  >
                    {flavor.badge}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: flavor.primaryColor }}
                  />
                </div>

                {/* Name & Tagline */}
                <h3 className="text-2xl font-display font-semibold text-brand-foreground group-hover:text-brand-primary transition-colors mb-2">
                  {flavor.name}
                </h3>
                <p className="text-xs text-brand-white/50 font-light mb-4">{flavor.tagline}</p>
                <p className="text-xs text-brand-white/70 line-clamp-3 leading-relaxed mb-6 font-light">
                  {flavor.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-brand-white/5 flex items-center justify-between">
                <button
                  onClick={() => setSelectedFlavor(flavor)}
                  className="inline-flex items-center space-x-1.5 text-xs text-brand-white/60 hover:text-brand-foreground transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-brand-primary" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => onOrderFlavor(flavor)}
                  className="bg-brand-white/10 hover:bg-brand-primary text-brand-white hover:text-brand-background p-2.5 rounded-full transition-all duration-300 transform group-hover:scale-110"
                  aria-label={`Order ${flavor.name}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Flavor Details Modal */}
      <FlavorModal
        flavor={selectedFlavor}
        onClose={() => setSelectedFlavor(null)}
        onOrder={onOrderFlavor}
      />
    </section>
  );
};
