import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  ShoppingBag,
  Zap,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { productBySlug, relatedProducts, FRAME_OPTIONS, SIZE_OPTIONS } from "../../data/products";
import { collectionById } from "../../data/collections";
import { REVIEWS } from "../../data/reviews";
import { formatTND } from "../../lib/format";
import { computeUnitPrice, buildCartItem } from "../../lib/cart-helpers";
import { buildWhatsappProductLink } from "../../lib/whatsapp";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { StarRating } from "../shared/StarRating";
import { ProductCard } from "../product/ProductCard";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { WhatsappIcon } from "../shared/WhatsappIcon";
import { Heart } from "lucide-react";

export function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = slug ? productBySlug(slug) : undefined;
  const { addItem } = useCart();
  const { toggle: toggleWish, has: isWished } = useWishlist();

  const [activeImg, setActiveImg] = useState(0);
  const [roomView, setRoomView] = useState(false);
  const [frame, setFrame] = useState(FRAME_OPTIONS[0]);
  const [size, setSize] = useState(SIZE_OPTIONS[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) document.title = `${product.name} — Atelier`;
    else document.title = "Atelier — Galerie d'Art";
  }, [product]);

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-[72px] text-center">
        <p className="font-serif text-ink-soft" style={{ fontSize: "1.5rem" }}>Cette œuvre est introuvable.</p>
        <Link to="/boutique" className="border-b border-gold pb-1 text-gold-deep">Retour à la boutique</Link>
      </div>
    );
  }

  const unitPrice = computeUnitPrice(product, frame, size);
  const collection = collectionById(product.collection);
  const related = relatedProducts(product, 4);
  const gallery = roomView ? [product.roomImage, ...product.images] : product.images;
  const currentImg = gallery[Math.min(activeImg, gallery.length - 1)];

  const handleMouse = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  const addToCart = () => {
    addItem(buildCartItem(product, frame, size, qty));
    toast.success(`« ${product.name} » ajouté au panier`);
  };

  const buyNow = () => {
    addItem(buildCartItem(product, frame, size, qty));
    navigate("/commande");
  };

  return (
    <div className="bg-cream pt-[72px]">
      {/* breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-6 pt-8 md:px-10">
        <nav className="flex items-center gap-2 text-stone" style={{ fontSize: "0.78rem" }}>
          <Link to="/" className="hover:text-ink">Accueil</Link>
          <ChevronRight size={13} />
          <Link to="/boutique" className="hover:text-ink">Boutique</Link>
          <ChevronRight size={13} />
          <Link to={`/boutique?collection=${product.collection}`} className="hover:text-ink">{collection?.name}</Link>
          <ChevronRight size={13} />
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* gallery */}
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            <div className="flex gap-3 md:flex-col">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors ${
                    i === activeImg ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <ImageWithFallback src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1">
              <div
                ref={imgRef}
                className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-cream-deep"
                onMouseMove={handleMouse}
                onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
              >
                <ImageWithFallback
                  src={currentImg}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-200"
                  style={
                    zoom.active
                      ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                      : undefined
                  }
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRoomView((v) => !v);
                    setActiveImg(0);
                  }}
                  className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-cream/95 px-4 py-2.5 text-ink backdrop-blur transition-colors hover:bg-cream"
                  style={{ fontSize: "0.78rem", letterSpacing: "0.04em" }}
                >
                  <RotateCcw size={15} strokeWidth={1.5} />
                  {roomView ? "Vue œuvre" : "Voir dans une pièce"}
                </button>
              </div>
            </div>
          </div>

          {/* details */}
          <div className="lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="eyebrow text-gold">{collection?.name}</span>
              {product.isNew && <span className="bg-cream-deep px-2 py-0.5 text-ink-soft eyebrow" style={{ fontSize: "0.6rem" }}>Nouveau</span>}
            </div>
            <h1 className="font-display mt-3 text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05, fontWeight: 500 }}>
              {product.name}
            </h1>
            <p className="font-serif mt-2 text-stone" style={{ fontSize: "1.25rem" }}>
              par {product.artist}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={product.rating} size={16} />
              <span className="text-stone" style={{ fontSize: "0.82rem" }}>{product.rating} · {product.reviewCount} avis</span>
            </div>

            <div className="mt-6 font-display text-ink" style={{ fontSize: "2rem", fontWeight: 500 }}>
              {formatTND(unitPrice)}
            </div>

            <p className="font-serif mt-6 text-ink-soft/80" style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* size */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow text-ink">Format</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {SIZE_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s)}
                    className={`border px-4 py-2.5 transition-colors ${size.id === s.id ? "border-gold bg-gold/10 text-ink" : "border-ink/15 text-ink-soft hover:border-ink/40"}`}
                    style={{ fontSize: "0.82rem" }}
                  >
                    {s.label}
                    {s.priceModifier > 0 && <span className="ml-1 text-stone">+{formatTND(s.priceModifier)}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* frame */}
            <div className="mt-6">
              <div className="mb-3 eyebrow text-ink">Cadre — <span className="text-gold-deep">{frame.name}</span></div>
              <div className="flex flex-wrap gap-3">
                {FRAME_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrame(f)}
                    className={`flex items-center gap-2 border px-3 py-2 transition-colors ${frame.id === f.id ? "border-gold" : "border-ink/15 hover:border-ink/40"}`}
                    style={{ fontSize: "0.8rem" }}
                    title={f.name}
                  >
                    <span className="h-5 w-5 rounded-full border border-ink/10" style={{ background: f.swatch }} />
                    <span className="text-ink-soft">{f.priceModifier > 0 ? `+${formatTND(f.priceModifier)}` : "Inclus"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* stock + qty */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center border border-ink/15">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3 text-ink hover:bg-ink/5" aria-label="Moins"><Minus size={15} /></button>
                <span className="w-10 text-center text-ink">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3 text-ink hover:bg-ink/5" aria-label="Plus"><Plus size={15} /></button>
              </div>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-ink-soft" style={{ fontSize: "0.85rem" }}>
                  <Check size={16} className="text-gold-deep" />
                  {product.stockCount <= 4 ? `Plus que ${product.stockCount} en stock` : "En stock"}
                </span>
              ) : (
                <span className="text-destructive" style={{ fontSize: "0.85rem" }}>Épuisé</span>
              )}
            </div>

            {/* actions */}
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className="flex items-center justify-center gap-2 border border-ink py-4 text-ink transition-colors hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ fontSize: "0.82rem", letterSpacing: "0.05em" }}
                >
                  <ShoppingBag size={17} strokeWidth={1.5} /> Ajouter
                </button>
                <button
                  onClick={buyNow}
                  disabled={!product.inStock}
                  className="flex items-center justify-center gap-2 bg-ink py-4 text-cream transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ fontSize: "0.82rem", letterSpacing: "0.05em" }}
                >
                  <Zap size={17} strokeWidth={1.5} /> Acheter
                </button>
              </div>
              <a
                href={buildWhatsappProductLink(product.name, product.artist, unitPrice)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 border border-[#25D366] py-4 text-[#128C7E] transition-colors hover:bg-[#25D366] hover:text-white"
                style={{ fontSize: "0.82rem", letterSpacing: "0.05em" }}
              >
                <WhatsappIcon size={18} /> Commander via WhatsApp
              </a>
              <button
                onClick={() => toggleWish(product.id)}
                className="flex items-center justify-center gap-2 border border-ink/15 py-3 text-ink-soft transition-colors hover:border-gold/50 hover:text-gold-deep"
                style={{ fontSize: "0.8rem", letterSpacing: "0.04em" }}
              >
                <Heart
                  size={16}
                  strokeWidth={1.5}
                  style={{ fill: isWished(product.id) ? "var(--gold)" : "none", stroke: isWished(product.id) ? "var(--gold)" : "currentColor" }}
                />
                {isWished(product.id) ? "Retiré des favoris" : "Ajouter aux favoris"}
              </button>
            </div>

            {/* reassurance */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">
              {[
                { icon: Truck, label: "Livraison en Tunisie" },
                { icon: ShieldCheck, label: "Paiement à la livraison" },
                { icon: RotateCcw, label: "Emballage sécurisé" },
              ].map((x) => (
                <div key={x.label} className="flex flex-col items-center gap-2 text-center">
                  <x.icon size={20} strokeWidth={1.4} className="text-gold" />
                  <span className="text-ink-soft/70" style={{ fontSize: "0.72rem", lineHeight: 1.3 }}>{x.label}</span>
                </div>
              ))}
            </div>

            {/* specs */}
            <div className="mt-8 space-y-3 border-t border-ink/10 pt-6">
              {[
                ["Dimensions", product.dimensions],
                ["Matériaux", product.materials],
                ["Orientation", product.orientation],
                ["Style", product.style],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4" style={{ fontSize: "0.88rem" }}>
                  <span className="w-32 shrink-0 text-stone">{k}</span>
                  <span className="text-ink-soft capitalize">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* reviews */}
      <ReviewsSection productId={product.id} productRating={product.rating} reviewCount={product.reviewCount} />

      {/* related */}
      <div className="bg-cream-deep py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <motion.h2
            className="font-display text-ink"
            style={{ fontSize: "2.2rem", fontWeight: 500 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Vous aimerez aussi
          </motion.h2>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReviewEntry {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  createdAt: number;
}

function ReviewsSection({ productId, productRating, reviewCount }: { productId: string; productRating: number; reviewCount: number }) {
  const LS_KEY = `atelier:reviews:${productId}`;
  const [customReviews, setCustomReviews] = useState<ReviewEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);

  const allReviews = [...customReviews, ...REVIEWS.slice(0, 4)];
  const totalCount = reviewCount + customReviews.length;

  const submitReview = () => {
    if (!form.name.trim() || !form.text.trim()) { toast.error("Veuillez remplir votre nom et votre avis."); return; }
    setSubmitting(true);
    const entry: ReviewEntry = { id: Date.now().toString(), ...form, createdAt: Date.now() };
    const updated = [entry, ...customReviews];
    setCustomReviews(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setForm({ name: "", city: "", rating: 5, text: "" });
    setShowForm(false);
    toast.success("Merci pour votre avis !");
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
      <div className="grid gap-12 border-t border-ink/10 pt-14 lg:grid-cols-[320px_1fr]">
        <div>
          <h2 className="font-display text-ink" style={{ fontSize: "2rem", fontWeight: 500 }}>Avis clients</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-gold-deep" style={{ fontSize: "3rem", fontWeight: 500 }}>{productRating}</span>
            <div>
              <StarRating rating={productRating} size={18} />
              <p className="mt-1 text-stone" style={{ fontSize: "0.82rem" }}>{totalCount} avis vérifiés</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="mt-6 border border-ink/20 px-5 py-3 text-ink transition-colors hover:border-gold hover:text-gold-deep"
            style={{ fontSize: "0.82rem", letterSpacing: "0.04em" }}
          >
            {showForm ? "Annuler" : "Laisser un avis"}
          </button>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-3">
              <input
                value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Votre nom" className="w-full border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none focus:border-gold placeholder:text-stone/60"
                style={{ fontSize: "0.85rem" }}
              />
              <input
                value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="Ville (optionnel)" className="w-full border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none focus:border-gold placeholder:text-stone/60"
                style={{ fontSize: "0.85rem" }}
              />
              <div className="flex items-center gap-2">
                <span className="text-stone" style={{ fontSize: "0.8rem" }}>Note :</span>
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className="transition-colors" style={{ color: n <= form.rating ? "var(--gold)" : "var(--stone)", fontSize: "1.2rem" }}>★</button>
                ))}
              </div>
              <textarea
                rows={4} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="Partagez votre expérience…"
                className="w-full border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none focus:border-gold placeholder:text-stone/60 resize-none"
                style={{ fontSize: "0.85rem" }}
              />
              <button onClick={submitReview} disabled={submitting}
                className="w-full bg-ink py-3 text-cream transition-colors hover:bg-ink-soft disabled:opacity-50"
                style={{ fontSize: "0.82rem", letterSpacing: "0.04em" }}>
                Publier mon avis
              </button>
            </motion.div>
          )}
        </div>
        <div className="space-y-6">
          {allReviews.map((r) => (
            <div key={r.id} className="border-b border-ink/10 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display text-ink" style={{ fontSize: "1.05rem", fontWeight: 500 }}>{r.name}</span>
                  {r.city && <span className="ml-2 text-stone" style={{ fontSize: "0.78rem" }}>· {r.city}</span>}
                </div>
                <StarRating rating={r.rating} />
              </div>
              <p className="font-serif mt-3 text-ink-soft/80" style={{ fontSize: "1.15rem", lineHeight: 1.55 }}>« {r.text} »</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
