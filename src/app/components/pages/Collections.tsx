import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "../../data/collections";
import { PRODUCTS } from "../../data/products";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const ease = [0.22, 1, 0.36, 1] as const;

export function Collections() {
  return (
    <div className="bg-cream pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        <div className="eyebrow mb-4 text-gold">Nos collections</div>
        <h1 className="font-display max-w-3xl text-ink" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.02, fontWeight: 500 }}>
          Sept univers, une même <span className="italic text-gold">exigence.</span>
        </h1>
        <p className="font-serif mt-5 max-w-xl text-ink-soft/70" style={{ fontSize: "1.3rem", lineHeight: 1.5 }}>
          Chaque collection raconte une histoire. Trouvez celle qui résonne avec votre intérieur et votre sensibilité.
        </p>

        <div className="mt-16 space-y-20 md:space-y-28">
          {COLLECTIONS.map((c, i) => {
            const count = PRODUCTS.filter((p) => p.collection === c.id).length;
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={c.id}
                className={`grid items-center gap-10 md:grid-cols-2 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease }}
              >
                <Link to={`/boutique?collection=${c.id}`} className="group block">
                  <div className="relative aspect-[5/4] overflow-hidden bg-cream-deep">
                    <ImageWithFallback src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-ink/10 transition-colors group-hover:bg-ink/0" />
                  </div>
                </Link>
                <div className={reversed ? "md:pr-10" : "md:pl-10"}>
                  <div className="eyebrow mb-3 text-gold">{c.tagline}</div>
                  <h2 className="font-display text-ink" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.05, fontWeight: 500 }}>
                    {c.name}
                  </h2>
                  <p className="font-serif mt-5 text-ink-soft/80" style={{ fontSize: "1.3rem", lineHeight: 1.6 }}>
                    {c.description}
                  </p>
                  <div className="mt-6 flex items-center gap-6">
                    <Link
                      to={`/boutique?collection=${c.id}`}
                      className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-ink transition-colors hover:border-gold hover:text-gold-deep"
                      style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}
                    >
                      Découvrir la collection
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <span className="text-stone" style={{ fontSize: "0.82rem" }}>{count} œuvre{count > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
