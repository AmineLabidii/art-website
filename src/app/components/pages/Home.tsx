import { useEffect } from "react";
import { Hero } from "../home/Hero";
import { CollectionsShowcase } from "../home/CollectionsShowcase";
import { FeaturedProducts } from "../home/FeaturedProducts";
import { InteriorInspiration } from "../home/InteriorInspiration";
import { BrandStory } from "../home/BrandStory";
import { Testimonials } from "../home/Testimonials";
import { GallerySection } from "../home/GallerySection";

export function Home() {
  useEffect(() => { document.title = "Atelier — Galerie d'Art | Tableaux & Œuvres d'art en Tunisie"; }, []);
  return (
    <>
      <Hero />
      <CollectionsShowcase />
      <FeaturedProducts />
      <InteriorInspiration />
      <BrandStory />
      <Testimonials />
      <GallerySection />
    </>
  );
}
