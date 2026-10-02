import React from 'react';
import { Heart, Sun, Award, Cookie } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export const OurStory: React.FC = () => {
  return (
    <section id="story-section" className="relative py-28 bg-brand-background text-brand-foreground overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-primary block">
              OUR PHILOSOPHY
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-medium leading-[1.15] text-brand-foreground">
              {BRAND_CONFIG.storyTitle}
            </h2>

            <p className="text-base md:text-lg text-brand-white/70 font-light leading-relaxed">
              We believe that ice cream should be an unhurried celebration of pure ingredients, velvety textures, and joyful moments. Each swirl is meticulously crafted using organic dairy, whole pods of Tahitian vanilla, and dark single-origin cacao.
            </p>

            <p className="text-sm md:text-base text-brand-white/60 font-light leading-relaxed">
              Our golden waffle cones are rolled warm right before your eyes, filling the air with the aroma of caramelized butter and toasted vanilla. No shortcuts, no compromises—just pure artisanal ice cream.
            </p>

            {/* Craft Pillars */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-brand-white/10">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-brand-white/5 border border-brand-white/10 text-brand-primary">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-foreground">Fresh Daily</h4>
                  <p className="text-xs text-brand-white/50 mt-1">Churned in small batches every morning.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-brand-white/5 border border-brand-white/10 text-brand-accent">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-foreground">Pure Cream</h4>
                  <p className="text-xs text-brand-white/50 mt-1">Rich, silky & unadulterated dairy base.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-brand-white/5 border border-brand-white/10 text-brand-primary">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-foreground">Hand-Rolled Waffles</h4>
                  <p className="text-xs text-brand-white/50 mt-1">Crisp golden waffle baked in-house.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-brand-white/5 border border-brand-white/10 text-brand-pistachio">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-foreground">Masterful Toppings</h4>
                  <p className="text-xs text-brand-white/50 mt-1">Single-origin cacao & fresh berries.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Quote Card */}
          <div className="lg:col-span-5">
            <div className="relative p-8 md:p-12 rounded-3xl bg-brand-surface border border-brand-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-6xl font-display text-brand-primary/30 block -mb-4">“</span>
              <blockquote className="text-xl md:text-2xl font-display font-light text-brand-foreground leading-relaxed mb-6">
                Ice cream is not just a dessert. It is a moment where time slows down, and sweetness takes center stage.
              </blockquote>

              <div className="flex items-center space-x-4 pt-4 border-t border-brand-white/10">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center font-bold text-brand-black text-sm font-display">
                  C
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-foreground tracking-widest uppercase">
                    The Crema Kitchen
                  </p>
                  <p className="text-[11px] text-brand-white/50">Artisanal Gelato & Soft Serve Master</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
