import { Link } from "react-router";
import { toast } from "sonner";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Product } from "../../data/types";
import { FRAME_OPTIONS, SIZE_OPTIONS } from "../../data/products";
import { formatTND } from "../../lib/format";
import { buildCartItem } from "../../lib/cart-helpers";
import { useCart } from "../../context/CartContext";
import { StarRating } from "../shared/StarRating";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";

interface QuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickView({ product, open, onOpenChange }: QuickViewProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    // default frame (sans cadre) & default size (first)
    addItem(buildCartItem(product, FRAME_OPTIONS[0], SIZE_OPTIONS[0], 1));
    toast.success(`« ${product.name} » ajouté au panier`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden border-none bg-cream p-0 sm:max-w-3xl">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-cream-deep md:aspect-auto">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col p-8">
            <div className="eyebrow mb-3 text-gold">{product.style}</div>
            <DialogTitle asChild>
              <h2 className="font-display text-ink" style={{ fontSize: "1.9rem", fontWeight: 500 }}>
                {product.name}
              </h2>
            </DialogTitle>
            <p className="font-serif mt-1 text-stone" style={{ fontSize: "1.15rem" }}>
              par {product.artist}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-stone" style={{ fontSize: "0.8rem" }}>
                ({product.reviewCount} avis)
              </span>
            </div>
            <DialogDescription asChild>
              <p className="font-serif mt-5 text-ink-soft/80" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                {product.description}
              </p>
            </DialogDescription>

            <div className="mt-auto pt-8">
              <div className="mb-4 font-display text-ink" style={{ fontSize: "1.6rem" }}>
                {formatTND(product.price)}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-2 bg-ink py-3.5 text-cream transition-colors hover:bg-ink-soft"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
                >
                  <ShoppingBag size={17} strokeWidth={1.5} />
                  Ajouter au panier
                </button>
                <Link
                  to={`/produit/${product.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center justify-center gap-2 border border-ink/20 py-3.5 text-ink transition-colors hover:border-ink"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
                >
                  Voir tous les détails
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
