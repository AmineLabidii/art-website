import { motion } from "motion/react";
import { Palette, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const STORY_IMG =
  "https://images.unsplash.com/photo-1647082550285-119acfd169f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200";

const VALUES = [
  { icon: Palette, title: "Œuvres originales", text: "Chaque pièce est sélectionnée à la main auprès d'artistes." },
  { icon: Truck, title: "Livraison en Tunisie", text: "Emballage sécurisé et suivi, dans les 24 gouvernorats." },
  { icon: ShieldCheck, title: "Paiement à la livraison", text: "Payez en toute confiance, à réception de votre œuvre." },
  { icon: MessageCircle, title: "Conseil personnalisé", text: "Une question ? Commandez et échangez via WhatsApp." },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function BrandStory() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="aspect-[4/5] overflow-hidden bg-cream-deep">
            <ImageWithFallback src={STORY_IMG} alt="Atelier d'artiste" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-8 -right-4 hidden bg-ink px-8 py-7 text-cream md:block">
            <div className="font-display text-gold-soft" style={{ fontSize: "2.6rem", fontWeight: 500 }}>+400</div>
            <div className="eyebrow mt-1 text-cream/60">œuvres livrées</div>
          </div>
        </motion.div>

        <div>
          <div className="eyebrow mb-5 flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" />
            Notre philosophie
          </div>
          <h2 className="font-display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08, fontWeight: 500 }}>
            Une maison d'art née <span className="italic text-gold">en Tunisie.</span>
          </h2>
          <p className="font-serif mt-6 text-ink-soft/80" style={{ fontSize: "1.35rem", lineHeight: 1.6 }}>
            Atelier est né d'une conviction simple : l'art ne devrait pas rester dans les musées. Nous rendons accessibles des œuvres qui ont une âme, et accompagnons chaque client comme un galeriste accompagne un collectionneur.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
              >
                <v.icon size={26} strokeWidth={1.4} className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-display text-ink" style={{ fontSize: "1.1rem", fontWeight: 500 }}>{v.title}</h3>
                  <p className="mt-1 text-ink-soft/70" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
