import { brand, ToppingOption } from '@/config/brand';
import { requestJson } from '@/api/client';

export interface ApiTopping {
  id: string;
  name: string;
  category: ToppingOption['category'];
  description: string;
  price: number;
  available: boolean;
}

export interface ApiStore {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: Record<string, string>;
  active: boolean;
}

const toppingPresentation: Record<string, Pick<ToppingOption, 'icon' | 'color'>> = {
  'waffle-bites': { icon: 'Wheat', color: brand.primary },
  honeycomb: { icon: 'Hexagon', color: brand.honeycomb },
  'raspberry-sauce': { icon: 'Sparkles', color: brand.accent },
  'dark-cacao': { icon: 'Flame', color: brand.chocolate },
  'color-sprinkles': { icon: 'Star', color: brand.pistachio },
  'pistachio-bits': { icon: 'CircleDot', color: brand.pistachio },
};

export async function getToppings(): Promise<ToppingOption[]> {
  const toppings = await requestJson<ApiTopping[]>('/api/toppings');
  return toppings.filter((topping) => topping.available).map((topping) => ({
    ...topping,
    ...toppingPresentation[topping.id] ?? { icon: 'Sparkles', color: brand.primary },
  }));
}

export async function getStores(): Promise<ApiStore[]> {
  return requestJson<ApiStore[]>('/api/stores');
}
