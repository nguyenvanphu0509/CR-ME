import React, { useEffect, useState, useMemo } from 'react';
import Lenis from 'lenis';
import { FrameSequenceManager } from '@/utils/frameLoader';
import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { StoryCanvasSection } from '@/components/StoryCanvasSection';
import { FlavorShowcase } from '@/features/catalog/FlavorShowcase';
import { OurStory } from '@/components/OurStory';
import { ToppingBuilder } from '@/features/custom-builder/ToppingBuilder';
import { StoreLocator } from '@/features/stores/StoreLocator';
import { OrderModal } from '@/features/checkout/OrderModal';
import { Footer } from '@/components/Footer';
import { BRAND_CONFIG, ProductFlavor, ToppingOption } from '@/config/brand';

export const App: React.FC = () => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderFlavor, setOrderFlavor] = useState<ProductFlavor | null>(null);
  const [orderToppings, setOrderToppings] = useState<ToppingOption[]>([]);

  // Singleton Frame Manager
  const frameManager = useMemo(
    () => new FrameSequenceManager(BRAND_CONFIG.sequenceTotalFrames),
    []
  );

  // Initialize Lenis smooth scroll & Frame Preloader
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Preload frames
    frameManager.loadFrames((progress) => {
      setLoadProgress(progress);
      if (progress >= 35 && !isReady) {
        // Fast ready state once critical frames are ready
        setIsReady(true);
      }
    });

    return () => {
      lenis.destroy();
    };
  }, [frameManager, isReady]);

  const handleNavigate = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSpecificFlavor = (flavor: ProductFlavor) => {
    setOrderFlavor(flavor);
    setOrderToppings([]);
    setIsOrderModalOpen(true);
  };

  const handleOrderCustomSwirl = (flavor: ProductFlavor, toppings: ToppingOption[]) => {
    setOrderFlavor(flavor);
    setOrderToppings(toppings);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-foreground font-sans relative selection:bg-brand-primary selection:text-brand-black">
      {/* Loading Progress Screen */}
      <Preloader progress={loadProgress} isReady={isReady} />

      {/* Fixed Navigation */}
      <Navbar
        onOrderClick={() => {
          setOrderFlavor(null);
          setOrderToppings([]);
          setIsOrderModalOpen(true);
        }}
        onNavigateSection={handleNavigate}
      />

      {/* Main Landing Flow */}
      <main>
        {/* Core Scroll Storytelling Canvas Experience */}
        <StoryCanvasSection
          frameManager={frameManager}
          isReady={isReady}
          onOrderClick={() => setIsOrderModalOpen(true)}
          onExploreClick={() => handleNavigate('flavors-section')}
        />

        {/* Commercial Flavor Collection */}
        <FlavorShowcase onOrderFlavor={handleOrderSpecificFlavor} />

        {/* Brand Philosophy & Craftsmanship */}
        <OurStory />

        {/* Custom Swirl & Topping Builder */}
        <ToppingBuilder onOrderCustom={handleOrderCustomSwirl} />

        {/* Parlor Store Locator */}
        <StoreLocator />
      </main>

      {/* Footer */}
      <Footer onNavigateSection={handleNavigate} />

      {/* Pickup Order Modal */}
      <OrderModal
        key={`${isOrderModalOpen}-${orderFlavor?.id ?? 'default'}`}
        isOpen={isOrderModalOpen}
        initialFlavor={orderFlavor}
        initialToppings={orderToppings}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
};

export default App;
