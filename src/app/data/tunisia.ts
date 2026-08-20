import { Governorate } from "./types";

/** The 24 governorates of Tunisia with indicative delivery fees (TND). */
export const GOVERNORATES: Governorate[] = [
  { id: "tunis", name: "Tunis", deliveryFee: 7, days: "1 à 2 jours" },
  { id: "ariana", name: "Ariana", deliveryFee: 7, days: "1 à 2 jours" },
  { id: "ben-arous", name: "Ben Arous", deliveryFee: 7, days: "1 à 2 jours" },
  { id: "manouba", name: "La Manouba", deliveryFee: 7, days: "1 à 2 jours" },
  { id: "nabeul", name: "Nabeul", deliveryFee: 8, days: "2 à 3 jours" },
  { id: "zaghouan", name: "Zaghouan", deliveryFee: 9, days: "2 à 3 jours" },
  { id: "bizerte", name: "Bizerte", deliveryFee: 9, days: "2 à 3 jours" },
  { id: "beja", name: "Béja", deliveryFee: 9, days: "2 à 3 jours" },
  { id: "jendouba", name: "Jendouba", deliveryFee: 10, days: "3 à 4 jours" },
  { id: "kef", name: "Le Kef", deliveryFee: 10, days: "3 à 4 jours" },
  { id: "siliana", name: "Siliana", deliveryFee: 10, days: "3 à 4 jours" },
  { id: "sousse", name: "Sousse", deliveryFee: 8, days: "2 à 3 jours" },
  { id: "monastir", name: "Monastir", deliveryFee: 8, days: "2 à 3 jours" },
  { id: "mahdia", name: "Mahdia", deliveryFee: 9, days: "2 à 3 jours" },
  { id: "kairouan", name: "Kairouan", deliveryFee: 9, days: "3 à 4 jours" },
  { id: "kasserine", name: "Kasserine", deliveryFee: 11, days: "3 à 5 jours" },
  { id: "sidi-bouzid", name: "Sidi Bouzid", deliveryFee: 11, days: "3 à 5 jours" },
  { id: "sfax", name: "Sfax", deliveryFee: 8, days: "2 à 3 jours" },
  { id: "gabes", name: "Gabès", deliveryFee: 11, days: "3 à 5 jours" },
  { id: "medenine", name: "Médenine", deliveryFee: 12, days: "4 à 5 jours" },
  { id: "tataouine", name: "Tataouine", deliveryFee: 13, days: "4 à 6 jours" },
  { id: "gafsa", name: "Gafsa", deliveryFee: 12, days: "4 à 5 jours" },
  { id: "tozeur", name: "Tozeur", deliveryFee: 13, days: "4 à 6 jours" },
  { id: "kebili", name: "Kébili", deliveryFee: 13, days: "4 à 6 jours" },
];

export const FREE_DELIVERY_THRESHOLD = 600; // TND
