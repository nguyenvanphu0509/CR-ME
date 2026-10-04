import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronDown, ArrowRight, Sparkle } from 'lucide-react';
import { FrameSequenceManager } from '@/utils/frameLoader';
import { BRAND_CONFIG } from '@/config/brand';

/*
Người dùng cuộn
  → tính tiến độ trong section, từ 0 đến 1
  → đổi tiến độ thành số frame, từ 1 đến 300
  → lấy ảnh từ FrameSequenceManager
  → vẽ ảnh lên Canvas
  → cập nhật chữ theo giai đoạn của câu chuyện
*/
interface StoryCanvasSectionProps {
  frameManager: FrameSequenceManager;
  isReady: boolean;
  onOrderClick: () => void;
  onExploreClick: () => void;
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export const StoryCanvasSection: React.FC<StoryCanvasSectionProps> = ({
  frameManager,
  isReady,
  onOrderClick,
  onExploreClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const currentFrame = prefersReducedMotion
    ? 277
    : Math.min(
        Math.max(Math.floor(scrollProgress * (BRAND_CONFIG.sequenceTotalFrames - 1)) + 1, 1),
        BRAND_CONFIG.sequenceTotalFrames,
      );

  // Handle Canvas sizing and Frame Rendering
  useEffect(() => {
    if (!isReady || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // Initial Render
    frameManager.renderFrameToCanvas(canvas, currentFrame);

    const handleResize = () => {
      frameManager.renderFrameToCanvas(canvas, currentFrame);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isReady, currentFrame, frameManager]);

  // Handle Scroll Progress Mapping
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!containerRef.current || !canvasRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.clientHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress between 0.0 and 1.0
      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const initialScrollCheck = window.requestAnimationFrame(handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(initialScrollCheck);
    };
  }, [isReady, prefersReducedMotion]);

  return (
    <div
      id="hero-section"
      ref={containerRef}
      className="relative w-full bg-brand-background text-brand-foreground"
      style={{ height: prefersReducedMotion ? '100vh' : '450vh' }}
    >
      {/* Sticky Full-Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Canvas Background Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />

        {/* Ambient Dark Overlay to enhance text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-background/80 via-transparent to-brand-background/40 pointer-events-none z-10" />

        {/* Dynamic Storytelling Text Overlays */}

        {/* PHASE 1: Introduction (0% - 18%) */}
        <div
          className={`absolute z-20 max-w-2xl px-6 text-center transition-all duration-500 transform ${
            scrollProgress <= 0.18 ? 'translate-y-0 scale-100' : '-translate-y-6 scale-95'
          }`}
          style={{
            opacity: prefersReducedMotion ? 0 : scrollProgress >= 0 && scrollProgress <= 0.18 ? 1 : 0,
            pointerEvents: scrollProgress <= 0.18 ? 'auto' : 'none',
          }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-white/5 border border-brand-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-brand-primary mb-6 backdrop-blur-md">
            <Sparkle className="w-3.5 h-3.5" />
            <span>ARTISANAL ICE CREAM • MADE YOUR WAY</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-brand-foreground tracking-tight mb-6 leading-[1.1]">
            A whole new spin on flavor.
          </h1>

          <p className="text-base md:text-xl text-brand-white/70 max-w-lg mx-auto font-light leading-relaxed mb-8">
            Creamy soft serve, crisp golden waffle pieces, and ingredients that make every single bite unforgettable.
          </p>

          <div className="flex flex-col items-center justify-center space-y-2 text-xs uppercase tracking-[0.2em] text-brand-white/40 animate-bounce">
            <span>Scroll to discover</span>
            <ChevronDown className="w-4 h-4 text-brand-primary" />
          </div>
        </div>

        {/* PHASE 2: Ingredients in Motion (18% - 42%) */}
        <div
          className="absolute z-20 inset-x-0 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-start pointer-events-none"
          style={{
            opacity: scrollProgress > 0.18 && scrollProgress <= 0.42 ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
          }}
        >
          <div className="max-w-md bg-brand-background/60 p-8 rounded-2xl border border-brand-white/10 backdrop-blur-xl pointer-events-auto">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-primary block mb-2">
              REAL INGREDIENTS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-foreground mb-4 leading-tight">
              Freshness in every swirl.
            </h2>
            <p className="text-sm md:text-base text-brand-white/70 font-light mb-4 leading-relaxed">
              Silky ice cream meets rich cacao, crisp waffle pieces, and a playful burst of colorful toppings.
            </p>
            <p className="text-xs text-brand-foreground/60 italic border-l-2 border-brand-primary pl-3 py-1">
              "More than dessert—it is a moment worth savoring."
            </p>
          </div>
        </div>

        {/* PHASE 3: Discover the Flavors (42% - 68%) */}
        <div
          className="absolute z-20 inset-x-0 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-end pointer-events-none"
          style={{
            opacity: scrollProgress > 0.42 && scrollProgress <= 0.68 ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
          }}
        >
          <div className="max-w-md bg-brand-background/60 p-8 rounded-2xl border border-brand-white/10 backdrop-blur-xl pointer-events-auto text-right">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-accent block mb-2">
              FIND YOUR FLAVOR
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-foreground mb-6 leading-tight">
              Every flavor has a personality.
            </h2>

            {/* Flavor Feature Badges */}
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 bg-brand-white/5 border border-brand-white/10 px-4 py-2 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-brand-foreground" />
                <span className="font-semibold text-brand-white">Vanilla</span>
                <span className="text-brand-white/50">— smooth & timeless</span>
              </div>
              <br />
              <div className="inline-flex items-center space-x-2 bg-brand-white/5 border border-brand-white/10 px-4 py-2 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-brand-chocolate" />
                <span className="font-semibold text-brand-white">Chocolate</span>
                <span className="text-brand-white/50">— rich & indulgent</span>
              </div>
              <br />
              <div className="inline-flex items-center space-x-2 bg-brand-white/5 border border-brand-white/10 px-4 py-2 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-brand-accent" />
                <span className="font-semibold text-brand-white">Berry</span>
                <span className="text-brand-white/50">— bright & refreshingly sweet</span>
              </div>
              <br />
              <div className="inline-flex items-center space-x-2 bg-brand-white/5 border border-brand-white/10 px-4 py-2 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-brand-pistachio" />
                <span className="font-semibold text-brand-white">Pistachio</span>
                <span className="text-brand-white/50">— delicate, creamy & nutty</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 4: The Ice Cream Takes Shape (68% - 88%) */}
        <div
          className="absolute z-20 inset-x-0 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-start pointer-events-none"
          style={{
            opacity: scrollProgress > 0.68 && scrollProgress <= 0.88 ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
          }}
        >
          <div className="max-w-md bg-brand-background/60 p-8 rounded-2xl border border-brand-white/10 backdrop-blur-xl pointer-events-auto">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-pistachio block mb-2">
              MADE FOR THIS MOMENT
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-foreground mb-4 leading-tight">
              Smooth. Crisp. Full of surprises.
            </h2>
            <p className="text-sm text-brand-white/70 font-light mb-6 leading-relaxed">
              Every swirl is crafted to balance creamy texture, gentle sweetness, and an irresistible golden waffle crunch.
            </p>

            <ul className="space-y-2 text-xs text-brand-white/80 font-medium">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span>Made fresh daily in small batches</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span>Carefully selected artisanal ingredients</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span>Endless topping & pairing combinations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* PHASE 5: Final Hero Reveal & CTA (88% - 100% or Reduced Motion) */}
        <div
          className="absolute z-20 inset-x-0 bottom-12 md:bottom-16 max-w-3xl mx-auto px-6 text-center"
          style={{
            opacity: prefersReducedMotion || scrollProgress > 0.88 ? 1 : 0,
            pointerEvents: prefersReducedMotion || scrollProgress > 0.88 ? 'auto' : 'none',
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-primary block mb-2">
            READY FOR A TREAT?
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-semibold text-brand-foreground mb-4 tracking-tight">
            Happiness starts with one scoop.
          </h2>
          <p className="text-sm md:text-lg text-brand-white/70 max-w-md mx-auto mb-8 font-light">
            Choose the flavor you love and make today a little sweeter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOrderClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-brand-primary hover:bg-brand-primaryHover text-brand-background font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-brand-primary/25"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-white/5 hover:bg-brand-white/10 text-brand-foreground border border-brand-white/15 font-semibold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-md"
            >
              <span>Explore Flavors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
