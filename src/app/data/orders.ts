export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "En attente", color: "#8a6d1a", bg: "#f7edcf" },
  confirmed: { label: "Confirmée", color: "#1a5a8a", bg: "#d6e8f5" },
  preparing: { label: "En préparation", color: "#6a3fa0", bg: "#e8dcf5" },
  shipped: { label: "Expédiée", color: "#8a5a1a", bg: "#f5e4cf" },
  delivered: { label: "Livrée", color: "#2f7a44", bg: "#d6f0dd" },
  cancelled: { label: "Annulée", color: "#a02f2f", bg: "#f5d6d6" },
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
];

export type PaymentMethod = "cod" | "online";
export type PaymentStatus = "paid" | "pending" | "unpaid";

export interface OrderLine {
  productId: string;
  name: string;
  artist: string;
  image: string;
  sizeLabel: string;
  frameName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string; // CMD-2026-0001
  createdAt: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    governorate: string;
    postal?: string;
    notes?: string;
  };
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  invoiceId?: string; // FACT-2026-0001 once generated
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400`;

const line = (
  productId: string,
  name: string,
  artist: string,
  imgId: string,
  unitPrice: number,
  quantity = 1,
  sizeLabel = "60 × 90 cm",
  frameName = "Chêne clair"
): OrderLine => ({
  productId,
  name,
  artist,
  image: img(imgId),
  sizeLabel,
  frameName,
  unitPrice,
  quantity,
});

const D = (daysAgo: number) => Date.now() - daysAgo * 86400000;

export const SEED_ORDERS: Order[] = [
  {
    id: "CMD-2026-0007",
    createdAt: D(0),
    customer: { name: "Sana Ben Ali", phone: "20 123 456", email: "sana@example.tn", address: "12 Rue du Lac", city: "La Marsa", governorate: "Tunis", postal: "2078" },
    lines: [line("p1", "Aurore Méditerranéenne", "Leïla Mansour", "1605721911519-3dfeb3be25e7", 620, 1)],
    subtotal: 620, delivery: 0, discount: 0, total: 620,
    status: "pending", paymentMethod: "cod", paymentStatus: "pending",
  },
  {
    id: "CMD-2026-0006",
    createdAt: D(1),
    customer: { name: "Mehdi Karray", phone: "22 987 654", email: "mehdi@example.tn", address: "45 Av. Habib Bourguiba", city: "Sousse", governorate: "Sousse" },
    lines: [line("p6", "Bleu de Sidi Bou", "Karim Trabelsi", "1552312097-8ef75595e2a2", 700, 1, "80 × 80 cm"), line("p2", "Silence du Lin", "Atelier Nova", "1761156254622-7b66649b1f69", 390, 1, "40 × 60 cm", "Sans cadre")],
    subtotal: 1090, delivery: 0, discount: 50, total: 1040,
    status: "confirmed", paymentMethod: "online", paymentStatus: "paid",
  },
  {
    id: "CMD-2026-0005",
    createdAt: D(2),
    customer: { name: "Ines Trabelsi", phone: "50 111 222", email: "ines@example.tn", address: "8 Rue Ibn Khaldoun", city: "Sfax", governorate: "Sfax" },
    lines: [line("p4", "Or de Carthage", "Yasmine Belhadj", "1635141849017-c531949fb5b3", 1430, 1, "90 × 130 cm", "Feuille d'or")],
    subtotal: 1430, delivery: 0, discount: 0, total: 1430,
    status: "preparing", paymentMethod: "online", paymentStatus: "paid",
    invoiceId: "FACT-2026-0003",
  },
  {
    id: "CMD-2026-0004",
    createdAt: D(4),
    customer: { name: "Walid Hamdi", phone: "24 333 444", address: "Cité El Manar", city: "Nabeul", governorate: "Nabeul" },
    lines: [line("p9", "Rêverie Rouge", "Paul Blenkhorn", "1563882687284-b4381efc07f5", 590, 2, "80 × 80 cm")],
    subtotal: 1180, delivery: 8, discount: 0, total: 1188,
    status: "shipped", paymentMethod: "cod", paymentStatus: "pending",
    invoiceId: "FACT-2026-0002",
  },
  {
    id: "CMD-2026-0003",
    createdAt: D(7),
    customer: { name: "Rania Mabrouk", phone: "27 555 666", email: "rania@example.tn", address: "Résidence Jasmin", city: "Ariana", governorate: "Ariana" },
    lines: [line("p11", "Terre Craquelée", "Logan Voss", "1774391562866-372bd882f283", 510, 1)],
    subtotal: 510, delivery: 7, discount: 0, total: 517,
    status: "delivered", paymentMethod: "cod", paymentStatus: "paid",
    invoiceId: "FACT-2026-0001",
  },
  {
    id: "CMD-2026-0002",
    createdAt: D(11),
    customer: { name: "Foued Dridi", phone: "23 777 888", address: "Av. de la République", city: "Monastir", governorate: "Monastir" },
    lines: [line("p3", "Flux Cobalt", "Steve Karim", "1618331833071-ce81bd50d300", 660, 1, "90 × 130 cm")],
    subtotal: 660, delivery: 0, discount: 0, total: 660,
    status: "delivered", paymentMethod: "online", paymentStatus: "paid",
  },
  {
    id: "CMD-2026-0001",
    createdAt: D(16),
    customer: { name: "Nadia Cherif", phone: "29 999 000", email: "nadia@example.tn", address: "Rue de Rome", city: "Tunis", governorate: "Tunis" },
    lines: [line("p12", "Constellation Dorée", "Yasmine Belhadj", "1541450082960-e071e6e3fc27", 1660, 1, "120 × 180 cm", "Feuille d'or")],
    subtotal: 1660, delivery: 0, discount: 100, total: 1560,
    status: "cancelled", paymentMethod: "cod", paymentStatus: "unpaid",
  },
];
