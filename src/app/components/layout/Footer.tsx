import { Link } from "react-router";
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { COLLECTIONS } from "../../data/collections";
import { WHATSAPP_NUMBER } from "../../lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* brand */}
          <div>
            <span className="font-display" style={{ fontSize: "1.8rem", letterSpacing: "0.18em", fontWeight: 500 }}>
              ATELIER
            </span>
            <p className="font-serif mt-5 max-w-xs text-cream/60" style={{ fontSize: "1.15rem", lineHeight: 1.6 }}>
              Galerie d'art décoratif tunisienne. Des œuvres uniques, choisies pour donner une âme à vos espaces.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href={i === 2 ? `https://wa.me/${WHATSAPP_NUMBER}` : "#"}
                  target={i === 2 ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-cream/20 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon size={17} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* explorer */}
          <div>
            <h4 className="eyebrow mb-5 text-gold-soft">Explorer</h4>
            <ul className="space-y-3">
              {[
                { label: "Boutique", to: "/boutique" },
                { label: "Collections", to: "/collections" },
                { label: "Notre histoire", to: "/histoire" },
                { label: "Mes commandes", to: "/mes-commandes" },
                { label: "Espace admin", to: "/admin" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-cream/60 transition-colors hover:text-cream" style={{ fontSize: "0.9rem" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* collections */}
          <div>
            <h4 className="eyebrow mb-5 text-gold-soft">Collections</h4>
            <ul className="space-y-3">
              {COLLECTIONS.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link to={`/boutique?collection=${c.id}`} className="text-cream/60 transition-colors hover:text-cream" style={{ fontSize: "0.9rem" }}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="eyebrow mb-5 text-gold-soft">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-cream/60" style={{ fontSize: "0.9rem" }}>
                <MapPin size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
                Rue de la Kasbah, Tunis, Tunisie
              </li>
              <li className="flex items-center gap-3 text-cream/60" style={{ fontSize: "0.9rem" }}>
                <Phone size={17} strokeWidth={1.5} className="shrink-0 text-gold" />
                +216 00 000 000
              </li>
              <li className="flex items-center gap-3 text-cream/60" style={{ fontSize: "0.9rem" }}>
                <Mail size={17} strokeWidth={1.5} className="shrink-0 text-gold" />
                contact@atelier.tn
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 md:flex-row">
          <p className="text-cream/40" style={{ fontSize: "0.78rem" }}>
            © {new Date().getFullYear()} Atelier. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-cream/40" style={{ fontSize: "0.78rem" }}>
            <span>Paiement à la livraison</span>
            <span>Livraison en Tunisie</span>
            <span>Prix en DT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
