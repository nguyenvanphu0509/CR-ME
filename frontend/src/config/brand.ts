export interface ProductFlavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Signature' | 'Seasonal' | 'Dairy-Free';
  badge: string;
  primaryColor: string;
  accentColor: string;
  ingredients: string[];
  allergens: string[];
  textureNotes: string[];
  pairing: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  category: 'Crunch' | 'Sauce' | 'Fruit' | 'Specialty';
  icon: string;
  color: string;
  description: string;
}

export const brand = {
  background: "#050505",
  foreground: "#FFF4DE",
  primary: "#C98A48",
  primaryHover: "#d89753",
  secondary: "#0B0B0B",
  accent: "#E94362",
  muted: "rgba(255, 255, 255, 0.62)",
  surface: "#0E0E0E",
  surfaceElevated: "#161616",
  chocolate: "#5A2E22",
  honeycomb: "#E5A84B",
  pistachio: "#9FBC69",
  white: "#FFFFFF",
  black: "#000000",
  textPrimary: "rgba(255, 255, 255, 0.94)",
  scrollbarThumb: "rgba(255, 255, 255, 0.15)",
  scrollbarThumbHover: "rgba(201, 138, 72, 0.5)",
  glassPanel: "rgba(14, 14, 14, 0.7)",
  glassNav: "rgba(5, 5, 5, 0.75)",
  glassNavBorder: "rgba(255, 255, 255, 0.06)",
  glow: "rgba(201, 138, 72, 0.15)",
  glowEnd: "rgba(5, 5, 5, 0)",
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.18)",
} as const;

export const BRAND_CONFIG = {
  name: "CRÈME",
  tagline: "Artisanal Soft Serve & Craft Waffles",
  editablePlaceholder: "[BRAND NAME]",
  storyTitle: "Crafted for the Pleasure of Eating",
  heroSubtitle: "Creamy soft serve, crisp golden waffle pieces, and hand-selected toppings in every swirl.",
  colors: {
    bgPrimary: brand.background,
    bgSecondary: brand.secondary,
    vanillaCream: brand.foreground,
    caramelWaffle: brand.primary,
    chocolate: brand.chocolate,
    raspberry: brand.accent,
    pistachio: brand.pistachio,
  },
  sequenceTotalFrames: 300,
  sequencePathPrefix: "/ezgif-frame/ezgif-frame-",
};

export const FLAVOR_LIST: ProductFlavor[] = [
  {
    id: "vanilla-gold",
    name: "Tahitian Vanilla Soft Serve",
    tagline: "Smooth, timeless & ultra-creamy",
    description: "Pure Tahitian vanilla bean soft serve churned slowly with fresh organic cream, served with dark chocolate waffle bites.",
    category: "Signature",
    badge: "Most Popular",
    primaryColor: brand.foreground,
    accentColor: brand.primary,
    ingredients: ["Fresh Organic Milk", "Tahitian Vanilla Pods", "Pure Cane Sugar", "Hand-Bunked Cream"],
    allergens: ["Milk"],
    textureNotes: ["Silky Smooth", "Velvety Melts", "Golden Crisp Finish"],
    pairing: "Pairs exquisitely with warm caramel waffle pieces."
  },
  {
    id: "dark-chocolate-crunch",
    name: "70% Cocoa Honeycomb Crunch",
    tagline: "Rich, deep & irresistibly crunchy",
    description: "Decadent dark chocolate soft serve folded with crisp honeycomb pieces and enrobed in dark cacao drizzle.",
    category: "Signature",
    badge: "Decadent",
    primaryColor: brand.chocolate,
    accentColor: brand.primary,
    ingredients: ["70% Single-Origin Cacao", "Artisanal Honeycomb", "Grass-Fed Milk", "Cocoa Butter"],
    allergens: ["Milk"],
    textureNotes: ["Dense Cocoa", "Satisfying Honeycomb Crunch", "Silky Aftertaste"],
    pairing: "Best paired with crushed roasted hazelnuts."
  },
  {
    id: "wild-raspberry-ribbon",
    name: "Wild Raspberry Cream",
    tagline: "Bright, tart & refreshingly sweet",
    description: "Hand-picked wild raspberry swirl ribboned through vanilla bean cream with white chocolate curls.",
    category: "Seasonal",
    badge: "Fresh Release",
    primaryColor: brand.accent,
    accentColor: brand.foreground,
    ingredients: ["Wild Alpine Raspberries", "Sweet Cream", "White Chocolate Ribbons", "Fresh Lemon Zest"],
    allergens: ["Milk"],
    textureNotes: ["Bright Tartness", "Smooth Swirl", "Melts Gently"],
    pairing: "Perfect with fresh berry reduction."
  },
  {
    id: "pistachio-matcha",
    name: "Pistachio Matcha Soft Swirl",
    tagline: "Delicate, nutty & sophisticated",
    description: "Ceremonial grade Uji matcha combined with Sicilian roasted pistachio cream for an unforgettable earthy richness.",
    category: "Dairy-Free",
    badge: "Artisanal Craft",
    primaryColor: brand.pistachio,
    accentColor: brand.chocolate,
    ingredients: ["Sicilian Pistachio Paste", "First-Harvest Matcha", "Almond Milk Base", "Toasted Pistachio Bits"],
    allergens: ["Almond", "Pistachio"],
    textureNotes: ["Creamy Nuttiness", "Subtle Tea Fragrance", "Smooth Velvet"],
    pairing: "Pairs deliciously with matcha biscuit crumble."
  }
];

export const FLAVOR_PRESENTATION: Record<string, Pick<ProductFlavor, 'primaryColor' | 'accentColor'>> = {
  'vanilla-gold': {
    primaryColor: brand.foreground,
    accentColor: brand.primary,
  },
  'dark-chocolate-crunch': {
    primaryColor: brand.chocolate,
    accentColor: brand.primary,
  },
  'wild-raspberry-ribbon': {
    primaryColor: brand.accent,
    accentColor: brand.foreground,
  },
  'pistachio-matcha': {
    primaryColor: brand.pistachio,
    accentColor: brand.chocolate,
  },
};

export const TOPPINGS_LIST: ToppingOption[] = [
  {
    id: "waffle-bites",
    name: "Crisp Waffle Bites",
    category: "Crunch",
    icon: "Wheat",
    color: brand.primary,
    description: "Freshly baked butter waffle cone pieces with dark chocolate coating."
  },
  {
    id: "honeycomb",
    name: "Honeycomb Crisp",
    category: "Crunch",
    icon: "Hexagon",
    color: brand.honeycomb,
    description: "Light, airy caramel honeycomb brittle dusted with sea salt."
  },
  {
    id: "raspberry-sauce",
    name: "Wild Raspberry Drizzle",
    category: "Sauce",
    icon: "Sparkles",
    color: brand.accent,
    description: "Slow-simmered wild berry reduction with a punchy sweet-tart balance."
  },
  {
    id: "dark-cacao",
    name: "70% Cocoa Shell",
    category: "Sauce",
    icon: "Flame",
    color: brand.chocolate,
    description: "Warm single-origin cocoa drizzle that sets into a satisfying crisp shell."
  },
  {
    id: "color-sprinkles",
    name: "Artisanal Sprinkles",
    category: "Specialty",
    icon: "Star",
    color: brand.pistachio,
    description: "Naturally dyed vibrant sugar confetti made in small batches."
  },
  {
    id: "pistachio-bits",
    name: "Crushed Pistachio",
    category: "Fruit",
    icon: "CircleDot",
    color: brand.pistachio,
    description: "Lightly toasted Bronte pistachios crushed to perfection."
  }
];

export const STORE_LOCATIONS = [
  {
    id: "store-1",
    name: "Crema SoHo Flagship",
    address: "452 Broome St, New York, NY 10013",
    hours: "11:00 AM – 11:00 PM Daily",
    status: "Open Now",
    phone: "(212) 555-0198"
  },
  {
    id: "store-2",
    name: "Crema Venice Beach",
    address: "1301 Abbot Kinney Blvd, Venice, CA 90291",
    hours: "12:00 PM – 10:30 PM Daily",
    status: "Open Now",
    phone: "(310) 555-0142"
  },
  {
    id: "store-3",
    name: "Crema Marais Paris",
    address: "28 Rue des Francs-Bourgeois, 75003 Paris",
    hours: "12:00 PM – 11:00 PM Daily",
    status: "Open Now",
    phone: "+33 1 42 68 01 92"
  }
];
