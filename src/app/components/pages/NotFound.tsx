import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 pt-[72px] text-center">
      <div className="font-display text-gold" style={{ fontSize: "clamp(5rem, 15vw, 10rem)", fontWeight: 500, lineHeight: 1 }}>
        404
      </div>
      <h1 className="font-display mt-4 text-ink" style={{ fontSize: "2rem", fontWeight: 500 }}>
        Cette page s'est perdue dans la galerie.
      </h1>
      <p className="font-serif mt-3 text-ink-soft/70" style={{ fontSize: "1.25rem" }}>
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 bg-ink px-8 py-4 text-cream transition-colors hover:bg-ink-soft"
        style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
