import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Boutique", to: "/boutique" },
  { label: "Collections", to: "/collections" },
  { label: "Notre Histoire", to: "/histoire" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const location = useLocation();

  // Home page has a dark hero → header starts transparent/light there.
  const transparentCapable = location.pathname === "/";
  const solid = scrolled || !transparentCapable || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const textColor = solid ? "text-ink" : "text-cream";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid ? "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 md:px-10">
        {/* Left nav (desktop) */}
        <nav className={`hidden items-center gap-8 md:flex ${textColor}`}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative py-1 transition-opacity hover:opacity-100"
              style={{ fontSize: "0.82rem", letterSpacing: "0.08em", opacity: location.pathname === item.to ? 1 : 0.75 }}
            >
              {item.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                  location.pathname === item.to ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* mobile menu btn */}
        <button
          className={`md:hidden ${textColor}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo center */}
        <Link
          to="/"
          className={`absolute left-1/2 -translate-x-1/2 ${textColor}`}
        >
          <span className="font-display" style={{ fontSize: "1.55rem", letterSpacing: "0.18em", fontWeight: 500 }}>
            ATELIER
          </span>
        </Link>

        {/* Right actions */}
        <div className={`flex items-center gap-5 ${textColor}`}>
          <Link to="/boutique" aria-label="Rechercher" className="hidden transition-opacity hover:opacity-70 sm:block">
            <Search size={19} strokeWidth={1.5} />
          </Link>
          <Link to="/favoris" aria-label="Favoris" className="relative hidden transition-opacity hover:opacity-70 sm:block">
            <Heart size={19} strokeWidth={1.5} />
            {wishCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-cream" style={{ fontSize: "0.62rem" }}>
                {wishCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative transition-opacity hover:opacity-70"
            aria-label="Panier"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-cream" style={{ fontSize: "0.62rem" }}>
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-ink/10 bg-cream md:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="border-b border-ink/5 py-4 font-serif text-ink"
                  style={{ fontSize: "1.3rem" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
