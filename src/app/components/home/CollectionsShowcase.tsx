import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "../../data/collections";
import { SectionHeading } from "../shared/SectionHeading";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const ease = [0.22, 1, 0.36, 1] as const;

export function CollectionsShowcase() {
  // feature the first four collections in an asymmetric editorial grid
  const feature = COLLECTIONS.slice(0, 4);

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Nos univers"
          title={
            <>
              Des collections pensées
              <br />
              comme des <span className="italic text-gold">expositions.</span>
            </>
          }
        />
        <Link
          to="/collections"
          className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-ink transition-colors hover:border-gold hover:text-gold-deep"
          style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
        >
          Toutes les collections
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-12">
        {feature.map((c, i) => {
          // asymmetric spans
          const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];
          const heights = ["aspect-[16/10]", "aspect-[16/10]", "aspect-[16/10]", "aspect-[16/10]"];
          return (
            <motion.div
              key={c.id}
              className={`${spans[i]} `}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease }}
            >
              <Link to={`/boutique?collection=${c.id}`} className="group block">
                <div className={`relative overflow-hidden bg-cream-deep ${heights[i]}`}>
                  <ImageWithFallback
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <div className="eyebrow mb-2 text-gold-soft">{c.tagline}</div>
                    <div className="flex items-end justify-between">
                      <h3 className="font-display text-cream" style={{ fontSize: "1.9rem", fontWeight: 500 }}>
                        {c.name}
                      </h3>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 text-cream transition-all duration-300 group-hover:border-gold group-hover:bg-gold">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
