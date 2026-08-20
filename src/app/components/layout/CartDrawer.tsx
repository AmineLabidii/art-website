import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, Bookmark, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatTND } from "../../lib/format";
import { FREE_DELIVERY_THRESHOLD } from "../../data/tunisia";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function CartDrawer() {
  const {
    items,
    saved,
    isOpen,
    setOpen,
    subtotal,
    setQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSaved,
  } = useCart();

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-ink" style={{ fontSize: "1.35rem", fontWeight: 500 }}>
                Votre panier
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-ink transition-opacity hover:opacity-60">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag size={44} strokeWidth={1} className="text-stone" />
                <p className="font-serif text-ink-soft" style={{ fontSize: "1.3rem" }}>
                  Votre panier est vide.
                </p>
                <Link
                  to="/boutique"
                  onClick={() => setOpen(false)}
                  className="mt-2 border-b border-gold pb-1 text-gold-deep"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
                >
                  Découvrir la collection
                </Link>
              </div>
            ) : (
              <>
                {/* free delivery progress */}
                <div className="border-b border-ink/10 px-6 py-4">
                  <p className="text-ink-soft" style={{ fontSize: "0.78rem" }}>
                    {remaining > 0 ? (
                      <>
                        Plus que <span className="text-gold-deep">{formatTND(remaining)}</span> pour la livraison offerte
                      </>
                    ) : (
                      <span className="text-gold-deep">🎉 Vous bénéficiez de la livraison offerte !</span>
                    )}
                  </p>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand/60">
                    <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* items */}
                <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <div key={item.key} className="flex gap-4 border-b border-ink/5 py-4">
                      <Link to={`/produit/${item.slug}`} onClick={() => setOpen(false)} className="block h-24 w-20 shrink-0 overflow-hidden bg-cream-deep">
                        <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-display text-ink" style={{ fontSize: "1rem", fontWeight: 500 }}>
                            {item.name}
                          </h3>
                          <button onClick={() => removeItem(item.key)} aria-label="Retirer" className="text-stone transition-colors hover:text-destructive">
                            <Trash2 size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="text-stone" style={{ fontSize: "0.72rem" }}>
                          {item.sizeLabel} · {item.frameName}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-ink/15">
                            <button onClick={() => setQuantity(item.key, item.quantity - 1)} className="px-2 py-1 text-ink transition-colors hover:bg-ink/5" aria-label="Moins">
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-ink" style={{ fontSize: "0.8rem" }}>
                              {item.quantity}
                            </span>
                            <button onClick={() => setQuantity(item.key, item.quantity + 1)} className="px-2 py-1 text-ink transition-colors hover:bg-ink/5" aria-label="Plus">
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-ink" style={{ fontSize: "0.9rem" }}>
                            {formatTND(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                        <button
                          onClick={() => saveForLater(item.key)}
                          className="mt-2 inline-flex items-center gap-1 self-start text-stone transition-colors hover:text-gold-deep"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <Bookmark size={12} /> Garder pour plus tard
                        </button>
                      </div>
                    </div>
                  ))}

                  {saved.length > 0 && (
                    <div className="mt-6">
                      <h4 className="eyebrow mb-3 text-stone">Gardés pour plus tard</h4>
                      {saved.map((item) => (
                        <div key={item.key} className="flex items-center gap-3 py-3">
                          <div className="h-14 w-12 shrink-0 overflow-hidden bg-cream-deep">
                            <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-ink" style={{ fontSize: "0.85rem" }}>{item.name}</p>
                            <div className="mt-1 flex gap-3">
                              <button onClick={() => moveToCart(item.key)} className="text-gold-deep" style={{ fontSize: "0.72rem" }}>
                                Remettre au panier
                              </button>
                              <button onClick={() => removeSaved(item.key)} className="text-stone" style={{ fontSize: "0.72rem" }}>
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* footer */}
                <div className="border-t border-ink/10 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-serif text-ink-soft" style={{ fontSize: "1.15rem" }}>Sous-total</span>
                    <span className="font-display text-ink" style={{ fontSize: "1.4rem" }}>{formatTND(subtotal)}</span>
                  </div>
                  <Link
                    to="/commande"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 bg-ink py-4 text-cream transition-colors hover:bg-ink-soft"
                    style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
                  >
                    Passer la commande
                    <ArrowRight size={17} strokeWidth={1.5} />
                  </Link>
                  <p className="mt-3 text-center text-stone" style={{ fontSize: "0.72rem" }}>
                    Paiement à la livraison disponible · Livraison partout en Tunisie
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
