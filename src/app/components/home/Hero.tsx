import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const HERO_IMG =
  "https://images.unsplash.com/photo-1635141849017-c531949fb5b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600";
const HERO_IMG_2 =
  "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] bg-ink">
      {/* overflow clip wrapper — keeps ref element non-overflow-hidden for Motion scroll tracking */}
      <div className="absolute inset-0 overflow-hidden">
        {/* background art */}
        <motion.div style={{ y: yImg }} className="absolute inset-0 scale-110">
          <ImageWithFallback
            src={HERO_IMG}
            alt="Œuvre d'art abstraite"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        </motion.div>

        {/* floating framed piece */}
        <motion.div
          className="absolute right-[6%] top-1/2 hidden aspect-[3/4] w-[22vw] max-w-[320px] -translate-y-1/2 lg:block"
          initial={{ opacity: 0, y: 60, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 1.4, delay: 0.6, ease }}
          style={{ y: yImg }}
        >
          <div className="h-full w-full border-[10px] border-cream/95 shadow-2xl">
            <ImageWithFallback src={HERO_IMG_2} alt="Peinture encadrée" className="h-full w-full object-cover" />
          </div>
        </motion.div>

        {/* content */}
        <motion.div
          style={{ y: yText, opacity }}
          className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 md:px-10"
        >
          <motion.div
            className="eyebrow mb-6 flex items-center gap-3 text-gold-soft"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            <span className="h-px w-10 bg-gold-soft" />
            Galerie d'art décoratif · Tunisie
          </motion.div>

          <h1 className="font-display max-w-3xl text-cream" style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)", lineHeight: 1.02, fontWeight: 500 }}>
            {["L'art qui", "habite", "vos murs."].map((line, i) => (
              <motion.span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.4 + i * 0.12, ease }}
                >
                  {i === 1 ? <span className="italic text-gold-soft">{line}</span> : line}
                </motion.span>
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="font-serif mt-8 max-w-xl text-cream/75"
            style={{ fontSize: "1.4rem", lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease }}
          >
            Des peintures originales et des éditions d'exception, sélectionnées à la main pour transformer chaque intérieur en galerie privée.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease }}
          >
            <Link
              to="/boutique"
              className="group inline-flex items-center gap-3 bg-cream px-8 py-4 text-ink transition-colors hover:bg-gold hover:text-cream"
              style={{ fontSize: "0.85rem", letterSpacing: "0.08em" }}
            >
              Explorer la collection
              <ArrowRight size={17} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/histoire"
              className="inline-flex items-center gap-2 border-b border-cream/40 pb-1 text-cream/90 transition-colors hover:border-gold hover:text-gold-soft"
              style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
            >
              Notre histoire
            </Link>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <span className="eyebrow" style={{ fontSize: "0.6rem" }}>Défiler</span>
          <motion.span
            className="h-10 w-px bg-cream/40"
            animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
