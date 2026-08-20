import { CartItem } from "../context/CartContext";
import { Order, OrderStatus, ORDER_STATUS_META } from "../data/orders";
import { formatTND } from "./format";

// Fallback number — overridden at runtime by company.whatsapp from settings.
export const WHATSAPP_NUMBER = "21600000000";

export interface WhatsappCustomer {
  name?: string;
  phone?: string;
  governorate?: string;
  city?: string;
  address?: string;
  notes?: string;
}

function waLink(number: string, text: string): string {
  const clean = number.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

// ── Customer-facing links ─────────────────────────────────────────────────────

/** Pre-filled order message from cart — used in Checkout. */
export function buildWhatsappOrderLink(
  items: CartItem[],
  opts: { subtotal: number; delivery?: number; total?: number; customer?: WhatsappCustomer },
  number = WHATSAPP_NUMBER,
): string {
  const lines: string[] = [
    "Bonjour Atelier ✨",
    "Je souhaite passer commande :",
    "",
  ];
  items.forEach((i, idx) => {
    lines.push(`${idx + 1}. ${i.name} — ${i.artist}`);
    lines.push(`   ${i.sizeLabel} · ${i.frameName} · ×${i.quantity} · ${formatTND(i.unitPrice * i.quantity)}`);
  });
  lines.push("");
  lines.push(`Sous-total : ${formatTND(opts.subtotal)}`);
  if (opts.delivery !== undefined) lines.push(`Livraison : ${formatTND(opts.delivery)}`);
  if (opts.total !== undefined) lines.push(`*Total : ${formatTND(opts.total)}*`);
  const c = opts.customer;
  if (c && (c.name || c.phone || c.address)) {
    lines.push("", "📍 Mes coordonnées :");
    if (c.name) lines.push(`Nom : ${c.name}`);
    if (c.phone) lines.push(`Téléphone : ${c.phone}`);
    if (c.address) lines.push(`Adresse : ${c.address}`);
    if (c.city) lines.push(`Ville : ${c.city}`);
    if (c.governorate) lines.push(`Gouvernorat : ${c.governorate}`);
    if (c.notes) lines.push(`Notes : ${c.notes}`);
  }
  return waLink(number, lines.join("\n"));
}

/** Single-product enquiry — used on product pages. */
export function buildWhatsappProductLink(
  productName: string,
  artist: string,
  price: number,
  number = WHATSAPP_NUMBER,
): string {
  return waLink(
    number,
    `Bonjour Atelier ✨\nJe suis intéressé(e) par l'œuvre « ${productName} » de ${artist} (${formatTND(price)}). Est-elle disponible ?`,
  );
}

// ── Admin-to-customer message templates ──────────────────────────────────────

const STATUS_MESSAGES: Partial<Record<OrderStatus, (order: Order) => string>> = {
  confirmed: (o) =>
    `Bonjour ${o.customer.name} 👋\n\nVotre commande *${o.id}* a bien été *confirmée* par Atelier ✅\n\nMontant total : ${formatTND(o.total)}\nMode de paiement : ${o.paymentMethod === "cod" ? "Paiement à la livraison" : "Payé en ligne"}\n\nNous vous contacterons dès qu'elle sera expédiée.\nMerci de votre confiance ! 🎨`,
  preparing: (o) =>
    `Bonjour ${o.customer.name} 👋\n\nVotre commande *${o.id}* est actuellement *en cours de préparation* 🖼️\n\nNos équipes emballent votre œuvre avec le plus grand soin.\nVous recevrez une notification dès l'expédition.\n\n— Atelier`,
  shipped: (o) =>
    `Bonjour ${o.customer.name} 👋\n\nBonne nouvelle ! Votre commande *${o.id}* est *expédiée* 🚚\n\nLivraison estimée : ${o.customer.governorate}, ${o.customer.city}.\n\nRestez disponible pour la réception. En cas de question, répondez à ce message.\n\n— Atelier`,
  delivered: (o) =>
    `Bonjour ${o.customer.name} 👋\n\nNous espérons que votre commande *${o.id}* est bien arrivée 🎉\n\nVotre avis nous est précieux — n'hésitez pas à partager une photo de votre œuvre chez vous !\n\nMerci d'avoir choisi Atelier 🎨`,
  cancelled: (o) =>
    `Bonjour ${o.customer.name} 👋\n\nNous vous informons que votre commande *${o.id}* a été *annulée*.\n\nSi vous avez des questions, nous sommes disponibles sur WhatsApp ou par email.\n\n— Atelier`,
};

/** Build an admin→customer WhatsApp link for a given order status update. */
export function buildAdminStatusLink(order: Order, status: OrderStatus, shopNumber: string): string {
  const builder = STATUS_MESSAGES[status];
  const text = builder
    ? builder(order)
    : `Bonjour ${order.customer.name}, mise à jour de votre commande ${order.id} : ${ORDER_STATUS_META[status].label}. — Atelier`;
  // Send TO customer's phone
  const customerPhone = order.customer.phone.replace(/\D/g, "");
  const dest = customerPhone.startsWith("216") ? customerPhone : `216${customerPhone}`;
  return waLink(dest, text);
}

/** Generic "contact this customer" link without a specific message. */
export function buildAdminCustomerLink(order: Order): string {
  const phone = order.customer.phone.replace(/\D/g, "");
  const dest = phone.startsWith("216") ? phone : `216${phone}`;
  const text = `Bonjour ${order.customer.name} 👋\n\nNous vous contactons au sujet de votre commande *${order.id}*.\n\n— Atelier`;
  return waLink(dest, text);
}
