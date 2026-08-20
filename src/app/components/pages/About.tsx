import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SectionHeading } from "../shared/SectionHeading";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400`;

const STEPS = [
  { n: "01", title: "La sélection", text: "Nous parcourons ateliers et artistes pour ne retenir que des œuvres qui ont une âme." },
  { n: "02", title: "L'encadrement", text: "Chêne clair, noir mat ou feuille d'or : chaque cadre est monté à la main dans nos ateliers." },
  { n: "03", title: "La livraison", text: "Emballage muséal et livraison suivie dans les 24 gouvernorats de Tunisie." },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function About() {
  return (
    <div className="bg-cream pt-[72px]">
      {/* hero */}
      <section className="relative flex h-[60vh] min-h-[440px] items-end overflow-hidden bg-ink">
        <ImageWithFallback src={img("1647082550285-119acfd169f2")} alt="Intérieur avec art" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-14 md:px-10">
          <motion.div className="eyebrow mb-4 text-gold-soft" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            Notre histoire
          </motion.div>
          <motion.h1
            className="font-display max-w-3xl text-cream"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.02, fontWeight: 500 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease }}
          >
            L'art comme <span className="italic text-gold-soft">art de vivre.</span>
          </motion.h1>
        </div>
      </section>

      {/* intro */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:px-10">
        <p className="font-serif text-ink-soft" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", lineHeight: 1.5 }}>
          Atelier est une maison d'art tunisienne fondée par des passionnés convaincus qu'une œuvre bien choisie transforme un lieu — et ceux qui l'habitent. Nous réunissons artistes, artisans et amateurs d'art autour d'une même idée : rendre la beauté accessible, sans jamais rien céder sur l'exigence.
        </p>
      </section>

      {/* process */}
      <section className="bg-cream-deep py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <SectionHeading eyebrow="Notre savoir-faire" title={<>De l'atelier à <span className="italic text-gold">votre mur.</span></>} align="center" />
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
              >
                <div className="font-display text-gold" style={{ fontSize: "3.5rem", fontWeight: 500 }}>{s.n}</div>
                <h3 className="font-display mt-2 text-ink" style={{ fontSize: "1.5rem", fontWeight: 500 }}>{s.title}</h3>
                <p className="font-serif mx-auto mt-3 max-w-xs text-ink-soft/70" style={{ fontSize: "1.2rem", lineHeight: 1.55 }}>{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
        <div className="grid gap-10 border-y border-ink/10 py-14 text-center sm:grid-cols-3">
          {[
            ["+400", "œuvres livrées"],
            ["24", "gouvernorats desservis"],
            ["4,9/5", "note moyenne"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-ink" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 500 }}>{v}</div>
              <div className="eyebrow mt-2 text-stone">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="bg-ink py-24 text-center text-cream">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08, fontWeight: 500 }}>
            Prêt à donner une âme <span className="italic text-gold-soft">à vos murs ?</span>
          </h2>
          <Link
            to="/boutique"
            className="group mt-8 inline-flex items-center gap-3 bg-cream px-9 py-4 text-ink transition-colors hover:bg-gold hover:text-cream"
            style={{ fontSize: "0.85rem", letterSpacing: "0.08em" }}
          >
            Explorer la collection
            <ArrowRight size={17} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
