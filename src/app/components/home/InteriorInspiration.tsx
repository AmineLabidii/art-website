import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200`;

const SPACES = [
  { id: "salon", label: "Salon", image: img("1691036561573-4b76998b60de") },
  { id: "chambre", label: "Chambre", image: img("1700226034367-2fb120f48dfa") },
  { id: "bureau", label: "Bureau", image: img("1682662046610-fbdb3db4bd74") },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function InteriorInspiration() {
  return (
    <section className="bg-ink py-24 text-cream md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* text */}
          <div className="max-w-lg">
            <div className="eyebrow mb-5 flex items-center gap-3 text-gold-soft">
              <span className="h-px w-8 bg-gold-soft" />
              Inspiration intérieure
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08, fontWeight: 500 }}>
              Imaginez-la <span className="italic text-gold-soft">chez vous.</span>
            </h2>
            <p className="font-serif mt-6 text-cream/70" style={{ fontSize: "1.35rem", lineHeight: 1.6 }}>
              Une œuvre change tout. Découvrez comment nos pièces subliment un salon, une chambre ou un espace de travail, et projetez-vous avant même de commander.
            </p>
            <Link
              to="/boutique"
              className="group mt-8 inline-flex items-center gap-3 text-gold-soft transition-colors hover:text-gold"
              style={{ fontSize: "0.9rem", letterSpacing: "0.06em" }}
            >
              <span className="border-b border-current pb-1">Trouver l'œuvre idéale</span>
              <ArrowRight size={17} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* image mosaic */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="col-span-2 aspect-[16/10] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease }}
            >
              <ImageWithFallback src={SPACES[0].image} alt="Salon avec œuvre d'art" className="h-full w-full object-cover" />
            </motion.div>
            {SPACES.slice(1).map((s, i) => (
              <motion.div
                key={s.id}
                className="aspect-square overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease }}
              >
                <ImageWithFallback src={s.image} alt={`${s.label} avec œuvre d'art`} className="h-full w-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
