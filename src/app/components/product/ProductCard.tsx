import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Eye, Heart } from "lucide-react";
import { Product } from "../../data/types";
import { formatTND } from "../../lib/format";
import { StarRating } from "../shared/StarRating";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { QuickView } from "./QuickView";
import { useWishlist } from "../../context/WishlistContext";

const orientationClass: Record<string, string> = {
  portrait: "aspect-[3/4]",
  paysage: "aspect-[4/3]",
  carre: "aspect-square",
};

export function ProductCard({ product }: { product: Product }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const { toggle, has } = useWishlist();
  const wished = has(product.id);

  return (
    <>
      <motion.article
        className="group relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to={`/produit/${product.slug}`} className="block">
          <div
            className={`relative overflow-hidden bg-cream-deep ${
              orientationClass[product.orientation]
            }`}
          >
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />

            {/* badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-cream/95 px-3 py-1 text-ink eyebrow" style={{ fontSize: "0.6rem" }}>
                  Nouveau
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-gold px-3 py-1 text-cream eyebrow" style={{ fontSize: "0.6rem" }}>
                  Best-seller
                </span>
              )}
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                <span className="border border-cream/70 px-4 py-2 text-cream eyebrow" style={{ fontSize: "0.65rem" }}>
                  Épuisé
                </span>
              </div>
            )}

            {/* wishlist */}
            <button
              onClick={(e) => { e.preventDefault(); toggle(product.id); }}
              aria-label={wished ? "Retirer des favoris" : "Ajouter aux favoris"}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 backdrop-blur transition-all hover:bg-cream"
              style={{ opacity: wished ? 1 : undefined }}
            >
              <Heart
                size={15}
                strokeWidth={1.5}
                className="transition-colors"
                style={{ fill: wished ? "var(--gold)" : "none", stroke: wished ? "var(--gold)" : "currentColor" }}
              />
            </button>

            {/* quick view */}
            {product.inStock && (
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuickOpen(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 bg-cream/95 py-3 text-ink backdrop-blur transition-colors hover:bg-cream"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.08em" }}
                >
                  <Eye size={16} strokeWidth={1.5} />
                  Aperçu rapide
                </button>
              </div>
            )}
          </div>
        </Link>

        <div className="pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <Link to={`/produit/${product.slug}`}>
              <h3 className="font-display text-ink" style={{ fontSize: "1.15rem", fontWeight: 500 }}>
                {product.name}
              </h3>
            </Link>
            <span className="font-sans text-ink whitespace-nowrap" style={{ fontSize: "0.95rem" }}>
              {formatTND(product.price)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-serif text-stone" style={{ fontSize: "1rem" }}>
              {product.artist}
            </p>
            <StarRating rating={product.rating} size={12} />
          </div>
        </div>
      </motion.article>

      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
}
