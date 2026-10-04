import { brand, FLAVOR_PRESENTATION, ProductFlavor } from '@/config/brand';
import { requestJson } from '@/api/client';
import { ApiFlavor } from '@/features/catalog/types';

export async function getFlavors(): Promise<ApiFlavor[]> {
  return requestJson<ApiFlavor[]>('/api/flavors');
}

export function toProductFlavor(flavor: ApiFlavor): ProductFlavor {
  const presentation = FLAVOR_PRESENTATION[flavor.id] ?? {
    primaryColor: brand.foreground,
    accentColor: brand.primary,
  };

  return {
    ...flavor,
    ...presentation,
  };
}
