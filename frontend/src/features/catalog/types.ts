/*
This interface describes the JSON the frontend expects from the backend.
TypeScript helps catch code that uses the wrong field name or data type.
This is the API model for a flavor, which is different from the frontend's internal model for a flavor (ProductFlavor).
*/
export interface ApiFlavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Signature' | 'Seasonal' | 'Dairy-Free';
  available: boolean;
  badge: string;
  ingredients: string[];
  allergens: string[];
  textureNotes: string[];
  pairing: string;
}
