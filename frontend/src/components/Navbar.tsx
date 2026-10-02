import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

interface NavbarProps {
  onOrderClick: () => void;
  onNavigateSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOrderClick, onNavigateSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'hero-section' },
    { name: 'Flavors', id: 'flavors-section' },
    { name: 'Our Story', id: 'story-section' },
    { name: 'Customizer', id: 'topping-section' },
    { name: 'Stores', id: 'stores-section' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-nav py-3.5 shadow-2xl shadow-brand-black/80'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigateSection('hero-section')}
            className="flex items-center space-x-2 text-left group focus:outline-none"
          >
            <span className="text-2xl font-display font-bold tracking-widest text-brand-foreground group-hover:text-brand-primary transition-colors">
              {BRAND_CONFIG.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          </button>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center space-x-9 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigateSection(link.id)}
                className="text-brand-white/70 hover:text-brand-foreground hover:scale-105 transition-all duration-200 relative py-1 focus:outline-none"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOrderClick}
              className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-primaryHover text-brand-background font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-brand-primary/20 focus:outline-none active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={onOrderClick}
              className="bg-brand-primary text-brand-black p-2 rounded-full text-xs font-semibold"
              aria-label="Order Now"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-white/80 hover:text-brand-white p-2 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-background/95 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden transition-all duration-300">
          <div className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateSection(link.id);
                }}
                className="text-2xl font-display text-brand-white/90 hover:text-brand-primary py-2 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-6">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOrderClick();
                }}
                className="w-full bg-brand-primary text-brand-background font-bold text-sm uppercase tracking-widest py-3.5 rounded-full shadow-lg"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
