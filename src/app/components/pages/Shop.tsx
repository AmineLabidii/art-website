import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { SIZE_OPTIONS } from "../../data/products";
import { useAdmin } from "../../context/AdminContext";
import { COLLECTIONS } from "../../data/collections";
import { Orientation } from "../../data/types";
import { formatTND } from "../../lib/format";
import { ProductCard } from "../product/ProductCard";
import { Slider } from "../ui/slider";

type SortKey = "nouveau" | "populaire" | "prix-asc" | "prix-desc" | "mieux-note";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "nouveau", label: "Nouveautés" },
  { key: "populaire", label: "Les plus populaires" },
  { key: "prix-asc", label: "Prix croissant" },
  { key: "prix-desc", label: "Prix décroissant" },
  { key: "mieux-note", label: "Les mieux notés" },
];

const ORIENTATIONS: { key: Orientation; label: string }[] = [
  { key: "portrait", label: "Portrait" },
  { key: "paysage", label: "Paysage" },
  { key: "carre", label: "Carré" },
];

const PRICE_MAX = 1600;

export function Shop() {
  const { products: PRODUCTS } = useAdmin();
  const [params, setParams] = useSearchParams();
  const initialCollection = params.get("collection") ?? "all";

  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState(initialCollection);
  const [orientation, setOrientation] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, PRICE_MAX]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("nouveau");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => { document.title = "Boutique — Atelier Galerie d'Art"; }, []);
  useEffect(() => {
    setCollection(params.get("collection") ?? "all");
  }, [params]);

  const allStyles = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.style))),
    [PRODUCTS]
  );

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.artist.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (collection !== "all" && p.collection !== collection) return false;
      if (orientation.length && !orientation.includes(p.orientation)) return false;
      if (styles.length && !styles.includes(p.style)) return false;
      if (inStockOnly && !p.inStock) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (query.trim().length >= 2) {
        const q = query.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.artist.toLowerCase().includes(q) &&
          !p.style.toLowerCase().includes(q)
        )
          return false;
      }
      // size filter is informational (all sizes available) — keep all when selected
      return true;
    });

    switch (sort) {
      case "nouveau":
        list = [...list].sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "populaire":
        list = [...list].sort((a, b) => b.popularity - a.popularity);
        break;
      case "prix-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "prix-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "mieux-note":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [collection, orientation, styles, sizes, inStockOnly, priceRange, query, sort]);

  const toggle = (
    value: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const setCollectionParam = (id: string) => {
    setCollection(id);
    if (id === "all") {
      params.delete("collection");
    } else {
      params.set("collection", id);
    }
    setParams(params, { replace: true });
  };

  const resetFilters = () => {
    setCollectionParam("all");
    setOrientation([]);
    setSizes([]);
    setStyles([]);
    setPriceRange([0, PRICE_MAX]);
    setInStockOnly(false);
    setQuery("");
  };

  const activeCount =
    (collection !== "all" ? 1 : 0) +
    orientation.length +
    sizes.length +
    styles.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < PRICE_MAX ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-8">
      {/* collection */}
      <FilterGroup title="Collection">
        <div className="space-y-2">
          <RadioRow label="Toutes" checked={collection === "all"} onClick={() => setCollectionParam("all")} />
          {COLLECTIONS.map((c) => (
            <RadioRow key={c.id} label={c.name} checked={collection === c.id} onClick={() => setCollectionParam(c.id)} />
          ))}
        </div>
      </FilterGroup>

      {/* price */}
      <FilterGroup title="Prix">
        <Slider
          value={priceRange}
          min={0}
          max={PRICE_MAX}
          step={20}
          onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
          className="my-4"
        />
        <div className="flex justify-between text-stone" style={{ fontSize: "0.8rem" }}>
          <span>{formatTND(priceRange[0])}</span>
          <span>{formatTND(priceRange[1])}</span>
        </div>
      </FilterGroup>

      {/* orientation */}
      <FilterGroup title="Orientation">
        <div className="flex flex-wrap gap-2">
          {ORIENTATIONS.map((o) => (
            <Chip key={o.key} label={o.label} active={orientation.includes(o.key)} onClick={() => toggle(o.key, orientation, setOrientation)} />
          ))}
        </div>
      </FilterGroup>

      {/* size */}
      <FilterGroup title="Format">
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => (
            <Chip key={s.id} label={s.label} active={sizes.includes(s.id)} onClick={() => toggle(s.id, sizes, setSizes)} />
          ))}
        </div>
      </FilterGroup>

      {/* style */}
      <FilterGroup title="Style">
        <div className="flex flex-wrap gap-2">
          {allStyles.map((s) => (
            <Chip key={s} label={s} active={styles.includes(s)} onClick={() => toggle(s, styles, setStyles)} />
          ))}
        </div>
      </FilterGroup>

      {/* availability */}
      <FilterGroup title="Disponibilité">
        <label className="flex cursor-pointer items-center gap-3 text-ink-soft" style={{ fontSize: "0.9rem" }}>
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 accent-[var(--gold)]" />
          En stock uniquement
        </label>
      </FilterGroup>

      {activeCount > 0 && (
        <button onClick={resetFilters} className="inline-flex items-center gap-2 text-gold-deep" style={{ fontSize: "0.85rem" }}>
          <X size={15} /> Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-cream pt-[72px]">
      {/* page header */}
      <div className="mx-auto max-w-[1400px] px-6 pb-8 pt-14 md:px-10">
        <div className="eyebrow mb-4 text-gold">La boutique</div>
        <h1 className="font-display text-ink" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.02, fontWeight: 500 }}>
          Toutes les <span className="italic text-gold">œuvres.</span>
        </h1>
        <p className="font-serif mt-4 max-w-xl text-ink-soft/70" style={{ fontSize: "1.3rem", lineHeight: 1.5 }}>
          Parcourez notre catalogue, affinez selon vos envies et trouvez la pièce qui vous ressemble.
        </p>

        {/* search */}
        <div className="relative mt-8 max-w-xl">
          <Search size={19} strokeWidth={1.5} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une œuvre, un artiste, un style…"
            className="w-full border border-ink/15 bg-cream py-3.5 pl-12 pr-4 text-ink outline-none transition-colors placeholder:text-stone focus:border-gold"
            style={{ fontSize: "0.95rem" }}
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute z-20 mt-1 w-full border border-ink/10 bg-cream shadow-xl"
              >
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setQuery(s.name)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-cream-deep"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden bg-cream-deep">
                        <img src={s.images[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="text-ink" style={{ fontSize: "0.9rem" }}>{s.name}</div>
                        <div className="text-stone" style={{ fontSize: "0.75rem" }}>{s.artist} · {s.style}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-[1400px] px-6 pb-28 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-[96px]">{FilterPanel}</div>
          </aside>

          {/* results */}
          <div>
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 border border-ink/15 px-4 py-2 text-ink lg:hidden"
                  style={{ fontSize: "0.85rem" }}
                >
                  <SlidersHorizontal size={16} /> Filtres {activeCount > 0 && `(${activeCount})`}
                </button>
                <span className="text-stone" style={{ fontSize: "0.85rem" }}>
                  {filtered.length} œuvre{filtered.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none border border-ink/15 bg-cream py-2 pl-4 pr-10 text-ink outline-none focus:border-gold"
                  style={{ fontSize: "0.85rem" }}
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <p className="font-serif text-ink-soft" style={{ fontSize: "1.4rem" }}>Aucune œuvre ne correspond à votre recherche.</p>
                <button onClick={resetFilters} className="mt-4 border-b border-gold pb-1 text-gold-deep" style={{ fontSize: "0.9rem" }}>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filters drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-y-auto bg-cream p-6 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-ink" style={{ fontSize: "1.3rem", fontWeight: 500 }}>Filtres</h2>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fermer"><X size={22} className="text-ink" /></button>
              </div>
              {FilterPanel}
              <button onClick={() => setMobileFiltersOpen(false)} className="mt-8 w-full bg-ink py-3.5 text-cream" style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}>
                Voir {filtered.length} œuvre{filtered.length > 1 ? "s" : ""}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-4 text-ink">{title}</h3>
      {children}
    </div>
  );
}

function RadioRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 text-left transition-colors" style={{ fontSize: "0.9rem" }}>
      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${checked ? "border-gold" : "border-ink/30"}`}>
        {checked && <span className="h-2 w-2 rounded-full bg-gold" />}
      </span>
      <span className={checked ? "text-ink" : "text-ink-soft/70"}>{label}</span>
    </button>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-1.5 transition-colors ${active ? "border-gold bg-gold text-cream" : "border-ink/15 text-ink-soft hover:border-ink/40"}`}
      style={{ fontSize: "0.78rem" }}
    >
      {label}
    </button>
  );
}
