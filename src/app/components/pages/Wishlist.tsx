import { useEffect } from "react";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useAdmin } from "../../context/AdminContext";
import { ProductCard } from "../product/ProductCard";

export function Wishlist() {
  const { ids } = useWishlist();
  const { products } = useAdmin();

  const wished = products.filter((p) => ids.includes(p.id));

  useEffect(() => {
    document.title = `Mes favoris — Atelier`;
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="eyebrow mb-3 text-gold">Ma liste</div>
        <h1 className="font-display text-ink" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 500 }}>
          Mes <span className="italic text-gold">favoris.</span>
        </h1>

        {wished.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <Heart size={48} strokeWidth={1} className="mb-5 text-stone" />
            <p className="font-serif text-ink-soft" style={{ fontSize: "1.3rem" }}>
              Vous n'avez pas encore de favoris.
            </p>
            <Link
              to="/boutique"
              className="mt-6 border-b border-gold pb-1 text-gold-deep"
              style={{ fontSize: "0.9rem" }}
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {wished.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
