export type CollectionId =
  | "abstrait"
  | "moderne"
  | "luxe"
  | "nature"
  | "tunisien"
  | "minimaliste"
  | "islamique";

export type Orientation = "portrait" | "paysage" | "carre";

export interface Collection {
  id: CollectionId;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface FrameOption {
  id: string;
  name: string;
  priceModifier: number; // TND added to base price
  swatch: string; // css color
}

export interface SizeOption {
  id: string;
  label: string; // e.g. "60 × 90 cm"
  priceModifier: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  artist: string;
  collection: CollectionId;
  price: number; // base price in TND
  orientation: Orientation;
  style: string;
  images: string[];
  roomImage: string; // artwork shown in a room
  description: string;
  materials: string;
  dimensions: string; // default dimensions text
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: number; // for "new arrivals" sorting
  popularity: number;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
}

export interface Governorate {
  id: string;
  name: string;
  deliveryFee: number; // TND
  days: string;
}
