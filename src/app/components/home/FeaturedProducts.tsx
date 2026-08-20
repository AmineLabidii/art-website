import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { ProductCard } from "../product/ProductCard";
import { SectionHeading } from "../shared/SectionHeading";

export function FeaturedProducts() {
  const { products } = useAdmin();
  const featured = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="bg-cream-deep py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="Pièces d'exception"
          title={
            <>
              Les œuvres les plus <span className="italic text-gold">convoitées.</span>
            </>
          }
          description="Une sélection de nos best-sellers, plébiscités par nos collectionneurs à travers toute la Tunisie."
        />

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            to="/boutique"
            className="group inline-flex items-center gap-3 border border-ink px-9 py-4 text-ink transition-colors hover:bg-ink hover:text-cream"
            style={{ fontSize: "0.85rem", letterSpacing: "0.08em" }}
          >
            Voir toute la boutique
            <ArrowRight size={17} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
