import { ReactNode } from "react";
import { Reveal } from "../motion/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <Reveal
      className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <div
          className={`eyebrow mb-4 flex items-center gap-3 ${
            isCenter ? "justify-center" : ""
          } ${light ? "text-gold-soft" : "text-gold"}`}
        >
          <span className="h-px w-8 bg-current opacity-60" />
          {eyebrow}
        </div>
      )}
      <h2
        className={`font-display leading-[1.05] ${
          light ? "text-cream" : "text-ink"
        }`}
        style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 500 }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`font-serif mt-5 ${light ? "text-cream/70" : "text-ink-soft/70"}`}
          style={{ fontSize: "1.35rem", lineHeight: 1.6 }}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
