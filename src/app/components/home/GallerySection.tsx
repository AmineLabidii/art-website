import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "motion/react";
import { Instagram } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;

const GALLERY = [
  img("1605721911519-3dfeb3be25e7"),
  img("1552312097-8ef75595e2a2"),
  img("1618331833071-ce81bd50d300"),
  img("1563882687284-b4381efc07f5"),
  img("1541450082960-e071e6e3fc27"),
  img("1566048652471-5869737a4c92"),
  img("1564483658547-215f1846c6fb"),
  img("1618331835717-801e976710b2"),
  img("1532949293134-3eb646d213f1"),
];

export function GallerySection() {
  return (
    <section className="bg-cream-deep py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="@atelier.tn"
          title={
            <>
              La galerie <span className="italic text-gold">vivante.</span>
            </>
          }
          description="Suivez nos dernières acquisitions et l'art tel qu'il vit chez nos clients."
          align="center"
        />

        <div className="mt-14">
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 900: 3 }}>
            <Masonry gutter="18px">
              {GALLERY.map((src, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="group relative block overflow-hidden bg-cream"
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                >
                  <ImageWithFallback src={src} alt="Œuvre en galerie" className="w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                    <Instagram size={26} className="text-cream" strokeWidth={1.5} />
                  </div>
                </motion.a>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    </section>
  );
}
