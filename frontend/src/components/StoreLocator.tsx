import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { STORE_LOCATIONS } from '@/config/brand';

export const StoreLocator: React.FC = () => {
  return (
    <section id="stores-section" className="relative py-28 bg-brand-background text-brand-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-primary block mb-3">
            PARLOR LOCATIONS
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-brand-foreground mb-4">
            Visit Our Boutiques
          </h2>
          <p className="text-sm md:text-base text-brand-white/70 font-light">
            Experience freshly baked waffle cones, slow-churned soft serve, and ambient soundscapes in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORE_LOCATIONS.map((store) => (
            <div
              key={store.id}
              className="bg-brand-surface p-8 rounded-3xl border border-brand-white/5 hover:border-brand-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-brand-pistachio/10 text-brand-pistachio">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-pistachio animate-pulse" />
                    <span>{store.status}</span>
                  </span>
                  <MapPin className="w-4 h-4 text-brand-primary" />
                </div>

                <h3 className="text-2xl font-display font-semibold text-brand-foreground mb-2">
                  {store.name}
                </h3>
                <p className="text-xs text-brand-white/70 leading-relaxed font-light mb-6">
                  {store.address}
                </p>

                <div className="space-y-3 text-xs text-brand-white/60 pt-4 border-t border-brand-white/5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{store.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{store.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-white/5">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-white/5 hover:bg-brand-white/10 text-brand-white text-xs font-semibold uppercase tracking-wider py-3 rounded-full transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
