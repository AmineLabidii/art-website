import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { REVIEWS } from "../../data/reviews";
import { SectionHeading } from "../shared/SectionHeading";
import { StarRating } from "../shared/StarRating";

const ease = [0.22, 1, 0.36, 1] as const;

export function Testimonials() {
  const shown = REVIEWS.slice(0, 3);
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <SectionHeading
        eyebrow="Ils nous font confiance"
        title={
          <>
            Le mot de nos <span className="italic text-gold">collectionneurs.</span>
          </>
        }
        align="center"
      />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {shown.map((r, i) => (
          <motion.figure
            key={r.id}
            className="flex flex-col border border-ink/10 bg-cream p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease }}
          >
            <Quote size={30} strokeWidth={1} className="text-gold" />
            <blockquote className="font-serif mt-5 flex-1 text-ink-soft" style={{ fontSize: "1.35rem", lineHeight: 1.55 }}>
              « {r.text} »
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
              <div>
                <div className="font-display text-ink" style={{ fontSize: "1.1rem", fontWeight: 500 }}>{r.name}</div>
                <div className="text-stone" style={{ fontSize: "0.8rem" }}>{r.city}</div>
              </div>
              <StarRating rating={r.rating} />
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
