import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Check, ChevronDown, ShoppingBag, Tag, X, CreditCard } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAdmin } from "../../context/AdminContext";
import { Order } from "../../data/orders";
import { addMyOrderRef } from "../../lib/my-orders";
import { GOVERNORATES, FREE_DELIVERY_THRESHOLD } from "../../data/tunisia";
import { formatTND, formatTimestampTN } from "../../lib/format";
import { buildWhatsappOrderLink } from "../../lib/whatsapp";
import { WhatsappIcon } from "../shared/WhatsappIcon";
import { ImageWithFallback } from "../figma/ImageWithFallback";

type Payment = "cod" | "online";

export function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { orders, addOrder, company, validatePromo } = useAdmin();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    address: "",
    postal: "",
    notes: "",
  });
  const [payment, setPayment] = useState<Payment>("cod");
  const [placed, setPlaced] = useState<{ ref: string; at: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => { document.title = "Finaliser la commande — Atelier"; }, []);

  const gov = GOVERNORATES.find((g) => g.id === form.governorate);
  const delivery = useMemo(() => {
    if (!gov) return 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return gov.deliveryFee;
  }, [gov, subtotal]);
  const discountAmount = appliedPromo ? Math.round(subtotal * appliedPromo.discount / 100) : 0;
  const total = subtotal - discountAmount + delivery;

  const applyPromo = () => {
    const promo = validatePromo(promoInput);
    if (!promo) {
      toast.error("Code promo invalide ou expiré.");
      return;
    }
    setAppliedPromo({ code: promo.code, discount: promo.discount });
    toast.success(`Code ${promo.code} appliqué — ${promo.discount}% de remise !`);
    setPromoInput("");
  };

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: false }));
  };

  const validate = () => {
    const req: (keyof typeof form)[] = ["name", "phone", "governorate", "city", "address"];
    const next: Record<string, boolean> = {};
    req.forEach((k) => {
      if (!form[k].trim()) next[k] = true;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = () => {
    if (!validate()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const year = new Date().getFullYear();
    const nums = orders
      .map((o) => parseInt(o.id.split("-")[2] || "0", 10))
      .filter((n) => !Number.isNaN(n));
    const nextNum = (nums.length ? Math.max(...nums) : 0) + 1;
    const ref = `CMD-${year}-${String(nextNum).padStart(4, "0")}`;

    const order: Order = {
      id: ref,
      createdAt: Date.now(),
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address,
        city: form.city,
        governorate: gov?.name || form.governorate,
        postal: form.postal || undefined,
        notes: form.notes || undefined,
      },
      lines: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        artist: i.artist,
        image: i.image,
        sizeLabel: i.sizeLabel,
        frameName: i.frameName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      subtotal,
      delivery,
      discount: discountAmount,
      total,
      status: "pending",
      paymentMethod: payment,
      paymentStatus: payment === "online" ? "paid" : "pending",
    };
    addOrder(order);
    addMyOrderRef(ref);

    // Notify admin via WhatsApp
    const adminNumber = (company.whatsapp ?? "21600000000").replace(/\D/g, "");
    const adminText = encodeURIComponent(
      `🛍️ *Nouvelle commande reçue !*\n` +
      `Réf : ${ref}\n` +
      `Client : ${form.name} · ${form.phone}\n` +
      `Ville : ${form.city}, ${gov?.name ?? form.governorate}\n` +
      `Total : ${formatTND(total)}\n` +
      `Paiement : ${payment === "cod" ? "À la livraison" : "En ligne"}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/${adminNumber}?text=${adminText}`, "_blank");
    }, 500);

    setPlaced({ ref, at: formatTimestampTN() });
    clear();
    toast.success("Commande confirmée !");
    window.scrollTo({ top: 0 });
  };

  // ── confirmation screen ──
  if (placed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 pt-[72px] text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gold text-cream"
        >
          <Check size={40} strokeWidth={1.5} />
        </motion.div>
        <div className="eyebrow mb-3 text-gold">Merci pour votre confiance</div>
        <h1 className="font-display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500 }}>
          Votre commande est confirmée.
        </h1>
        <p className="font-serif mt-4 max-w-md text-ink-soft/70" style={{ fontSize: "1.25rem", lineHeight: 1.5 }}>
          Référence <span className="text-ink">{placed.ref}</span>. Nous vous contacterons très prochainement pour organiser la livraison.
        </p>
        <p className="mt-2 text-stone" style={{ fontSize: "0.8rem" }}>Passée le {placed.at} (heure de Tunis)</p>
        <Link
          to="/boutique"
          className="mt-10 inline-flex items-center gap-2 bg-ink px-8 py-4 text-cream transition-colors hover:bg-ink-soft"
          style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
        >
          Continuer mes découvertes
        </Link>
      </div>
    );
  }

  // ── empty cart ──
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-6 pt-[72px] text-center">
        <ShoppingBag size={48} strokeWidth={1} className="text-stone" />
        <h1 className="font-display text-ink" style={{ fontSize: "2rem", fontWeight: 500 }}>Votre panier est vide</h1>
        <Link to="/boutique" className="border-b border-gold pb-1 text-gold-deep" style={{ fontSize: "0.9rem" }}>
          Explorer la collection
        </Link>
      </div>
    );
  }

  const inputCls = (k: string) =>
    `w-full border bg-cream px-4 py-3 text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-gold ${
      errors[k] ? "border-destructive" : "border-ink/15"
    }`;

  return (
    <div className="bg-cream pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="eyebrow mb-3 text-gold">Finaliser la commande</div>
        <h1 className="font-display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500 }}>
          Livraison & <span className="italic text-gold">paiement.</span>
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_420px]">
          {/* form */}
          <div className="space-y-10">
            <section>
              <h2 className="font-display mb-5 text-ink" style={{ fontSize: "1.4rem", fontWeight: 500 }}>Vos coordonnées</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom complet *" full={false}>
                  <input className={inputCls("name")} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex : Sana Ben Ali" />
                </Field>
                <Field label="Téléphone *">
                  <input className={inputCls("phone")} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Ex : 20 123 456" />
                </Field>
                <Field label="Email (optionnel)" full>
                  <input className={inputCls("email")} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="pour recevoir votre facture" />
                </Field>
              </div>
            </section>

            <section>
              <h2 className="font-display mb-5 text-ink" style={{ fontSize: "1.4rem", fontWeight: 500 }}>Adresse de livraison</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Gouvernorat *">
                  <div className="relative">
                    <select
                      className={`${inputCls("governorate")} appearance-none pr-10`}
                      value={form.governorate}
                      onChange={(e) => set("governorate", e.target.value)}
                    >
                      <option value="">Choisir…</option>
                      {GOVERNORATES.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone" />
                  </div>
                </Field>
                <Field label="Ville / Délégation *">
                  <input className={inputCls("city")} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ex : La Marsa" />
                </Field>
                <Field label="Adresse *" full>
                  <input className={inputCls("address")} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Rue, immeuble, appartement…" />
                </Field>
                <Field label="Code postal">
                  <input className={inputCls("postal")} value={form.postal} onChange={(e) => set("postal", e.target.value)} placeholder="Ex : 2078" />
                </Field>
                <Field label="Notes (optionnel)" full>
                  <textarea rows={3} className={inputCls("notes")} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Indications pour la livraison…" />
                </Field>
              </div>
              {gov && (
                <p className="mt-3 text-stone" style={{ fontSize: "0.82rem" }}>
                  Délai estimé pour {gov.name} : <span className="text-ink-soft">{gov.days}</span>
                </p>
              )}
            </section>

            <section>
              <h2 className="font-display mb-5 text-ink" style={{ fontSize: "1.4rem", fontWeight: 500 }}>Mode de paiement</h2>
              <div className="space-y-3">
                <PaymentOption
                  active={payment === "cod"}
                  onClick={() => setPayment("cod")}
                  title="Paiement à la livraison"
                  desc="Payez en espèces à la réception de votre œuvre."
                />
                <PaymentOption
                  active={payment === "online"}
                  onClick={() => setPayment("online")}
                  title="Paiement en ligne — Paymee"
                  desc="Carte bancaire locale (CIB, Mastercard, Visa) · Paiement sécurisé."
                  badge="Bientôt"
                />
              </div>
              {payment === "online" && (
                <div className="mt-4 rounded border border-ink/10 bg-cream-deep/60 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CreditCard size={16} className="text-stone" />
                    <span className="text-ink-soft" style={{ fontSize: "0.82rem" }}>Paymee — Passerelle de paiement tunisienne</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Numéro de carte", "Date d'expiration", "Nom du porteur", "CVV"].map((label) => (
                      <div key={label} className={label === "Nom du porteur" ? "col-span-2" : ""}>
                        <label className="mb-1 block text-stone" style={{ fontSize: "0.7rem" }}>{label}</label>
                        <div className="border border-ink/15 bg-cream px-3 py-2.5 text-stone/40" style={{ fontSize: "0.82rem" }}>
                          {label === "Numéro de carte" ? "•••• •••• •••• ••••" : label === "CVV" ? "•••" : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-stone/60" style={{ fontSize: "0.7rem" }}>
                    Mode démonstration — aucune carte n'est débitée. L'intégration Paymee sera activée en production.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* summary */}
          <aside>
            <div className="sticky top-[96px] border border-ink/10 bg-cream-deep/40 p-7">
              <h2 className="font-display mb-5 text-ink" style={{ fontSize: "1.3rem", fontWeight: 500 }}>Votre commande</h2>
              <div className="no-scrollbar max-h-72 space-y-4 overflow-y-auto">
                {items.map((i) => (
                  <div key={i.key} className="flex gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream-deep">
                      <ImageWithFallback src={i.image} alt={i.name} className="h-full w-full object-cover" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-cream" style={{ fontSize: "0.65rem" }}>{i.quantity}</span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-ink" style={{ fontSize: "0.85rem" }}>{i.name}</p>
                      <p className="text-stone" style={{ fontSize: "0.72rem" }}>{i.sizeLabel} · {i.frameName}</p>
                    </div>
                    <span className="self-center text-ink" style={{ fontSize: "0.82rem" }}>{formatTND(i.unitPrice * i.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Promo code input */}
              <div className="mt-5 border-t border-ink/10 pt-5">
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded bg-gold/10 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag size={13} className="text-gold-deep" />
                      <span className="text-gold-deep font-mono" style={{ fontSize: "0.8rem" }}>{appliedPromo.code}</span>
                      <span className="text-gold-deep" style={{ fontSize: "0.75rem" }}>-{appliedPromo.discount}%</span>
                    </div>
                    <button onClick={() => setAppliedPromo(null)}>
                      <X size={14} className="text-stone hover:text-ink" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="Code promo"
                      className="flex-1 border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none placeholder:text-stone/60 focus:border-gold font-mono"
                      style={{ fontSize: "0.82rem" }}
                    />
                    <button
                      onClick={applyPromo}
                      className="border border-ink/15 bg-cream px-4 py-2.5 text-ink transition-colors hover:border-gold hover:text-gold-deep"
                      style={{ fontSize: "0.78rem", letterSpacing: "0.04em" }}
                    >
                      Appliquer
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2" style={{ fontSize: "0.9rem" }}>
                <Row label="Sous-total" value={formatTND(subtotal)} />
                {appliedPromo && (
                  <div className="flex items-center justify-between" style={{ color: "var(--gold-deep)" }}>
                    <span>Remise ({appliedPromo.discount}%)</span>
                    <span>-{formatTND(discountAmount)}</span>
                  </div>
                )}
                <Row
                  label="Livraison"
                  value={!form.governorate ? "—" : delivery === 0 ? "Offerte" : formatTND(delivery)}
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="font-serif text-ink" style={{ fontSize: "1.2rem" }}>Total</span>
                <span className="font-display text-ink" style={{ fontSize: "1.6rem", fontWeight: 500 }}>{formatTND(total)}</span>
              </div>

              <button
                onClick={placeOrder}
                className="mt-6 w-full bg-ink py-4 text-cream transition-colors hover:bg-ink-soft"
                style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
              >
                Confirmer la commande
              </button>

              <a
                href={buildWhatsappOrderLink(items, {
                  subtotal,
                  delivery,
                  total,
                  customer: {
                    name: form.name,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    governorate: gov?.name,
                    notes: form.notes,
                  },
                })}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 border border-[#25D366] py-3.5 text-[#128C7E] transition-colors hover:bg-[#25D366] hover:text-white"
                style={{ fontSize: "0.82rem", letterSpacing: "0.05em" }}
              >
                <WhatsappIcon size={17} /> Commander via WhatsApp
              </a>

              <p className="mt-4 text-center text-stone" style={{ fontSize: "0.72rem", lineHeight: 1.4 }}>
                Livraison offerte dès {formatTND(FREE_DELIVERY_THRESHOLD)} d'achat.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-ink-soft" style={{ fontSize: "0.8rem", letterSpacing: "0.02em" }}>{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-soft">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

function PaymentOption({
  active,
  onClick,
  title,
  desc,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 border p-4 text-left transition-colors ${active ? "border-gold bg-gold/5" : "border-ink/15 hover:border-ink/40"}`}
    >
      <span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${active ? "border-gold" : "border-ink/30"}`}>
        {active && <span className="h-2 w-2 rounded-full bg-gold" />}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="text-ink" style={{ fontSize: "0.92rem" }}>{title}</span>
          {badge && <span className="bg-cream-deep px-2 py-0.5 text-stone eyebrow" style={{ fontSize: "0.55rem" }}>{badge}</span>}
        </span>
        <span className="mt-1 block text-stone" style={{ fontSize: "0.78rem" }}>{desc}</span>
      </span>
    </button>
  );
}
