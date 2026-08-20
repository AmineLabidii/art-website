import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Package, Download, Search, Loader2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { Order, ORDER_STATUS_META } from "../../data/orders";
import { formatTND, formatTimestampTN } from "../../lib/format";
import { openInvoice } from "../../lib/invoice";
import { api } from "../../lib/api";
import { getMyOrderRefs } from "../../lib/my-orders";

export function MyOrders() {
  const { company } = useAdmin();
  const [mine, setMine] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [lookup, setLookup] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<Order | null | undefined>(null); // null=idle, undefined=not found

  // Load the visitor's own orders (by locally stored references).
  useEffect(() => {
    (async () => {
      const refs = getMyOrderRefs();
      const results = await Promise.all(
        refs.map((ref) =>
          api
            .getOrder(ref)
            .then((r) => r.order)
            .catch(() => null),
        ),
      );
      setMine(results.filter((o): o is Order => !!o).sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    })();
  }, []);

  const runLookup = async () => {
    const ref = lookup.trim().toUpperCase();
    if (!ref) {
      setFound(null);
      return;
    }
    setSearching(true);
    try {
      const { order } = await api.getOrder(ref);
      setFound(order);
    } catch {
      setFound(undefined);
    } finally {
      setSearching(false);
    }
  };

  const shown = found ? [found] : mine;

  const empty = useMemo(() => found === null && !loading && mine.length === 0, [found, loading, mine]);

  return (
    <div className="bg-cream pt-[72px]">
      <div className="mx-auto max-w-[1000px] px-6 py-14 md:px-10">
        <div className="eyebrow mb-3 text-gold">Espace client</div>
        <h1 className="font-display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500 }}>
          Mes <span className="italic text-gold">commandes.</span>
        </h1>

        <div className="mt-8 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <input
              value={lookup}
              onChange={(e) => { setLookup(e.target.value); if (!e.target.value.trim()) setFound(null); }}
              onKeyDown={(e) => e.key === "Enter" && runLookup()}
              placeholder="Suivre par référence (CMD-2026-…)"
              className="w-full border border-ink/15 bg-cream py-3 pl-10 pr-4 text-ink outline-none focus:border-gold"
              style={{ fontSize: "0.88rem" }}
            />
          </div>
          <button
            onClick={runLookup}
            disabled={searching}
            className="inline-flex items-center gap-2 bg-ink px-5 text-cream transition-colors hover:bg-ink-soft disabled:opacity-60"
            style={{ fontSize: "0.85rem" }}
          >
            {searching ? <Loader2 size={15} className="animate-spin" /> : "Suivre"}
          </button>
        </div>

        {found === undefined && (
          <p className="mt-6 text-stone" style={{ fontSize: "0.9rem" }}>Aucune commande trouvée pour cette référence.</p>
        )}

        {loading && found === null ? (
          <div className="mt-12 flex items-center gap-3 text-stone" style={{ fontSize: "0.9rem" }}>
            <Loader2 size={18} className="animate-spin" /> Chargement de vos commandes…
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {shown.map((o) => {
              const meta = ORDER_STATUS_META[o.status];
              return (
                <div key={o.id} className="border border-ink/10 bg-cream p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-ink" style={{ fontSize: "1.15rem", fontWeight: 500 }}>{o.id}</div>
                      <div className="text-stone" style={{ fontSize: "0.78rem" }}>{formatTimestampTN(new Date(o.createdAt))}</div>
                    </div>
                    <span className="inline-flex items-center rounded-full px-3 py-1" style={{ fontSize: "0.72rem", color: meta.color, background: meta.bg }}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                    {o.lines.map((l, i) => (
                      <div key={`${l.productId}-${i}`} className="flex items-center gap-3">
                        <img src={l.image} alt={l.name} className="h-12 w-12 object-cover" style={{ borderRadius: 2 }} />
                        <div className="flex-1">
                          <div className="text-ink" style={{ fontSize: "0.88rem" }}>{l.name}</div>
                          <div className="text-stone" style={{ fontSize: "0.74rem" }}>{l.sizeLabel} · {l.frameName} · ×{l.quantity}</div>
                        </div>
                        <div className="text-ink-soft" style={{ fontSize: "0.85rem" }}>{formatTND(l.unitPrice * l.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                    <div className="text-stone" style={{ fontSize: "0.8rem" }}>
                      Livraison à {o.customer.governorate} · {o.paymentMethod === "cod" ? "Paiement à la livraison" : "Payé en ligne"}
                    </div>
                    <div className="font-display text-ink" style={{ fontSize: "1.15rem", fontWeight: 500 }}>{formatTND(o.total)}</div>
                  </div>

                  {o.invoiceId && (
                    <button
                      onClick={() => openInvoice(o, company)}
                      className="mt-4 inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-ink-soft transition-colors hover:border-ink hover:text-ink"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Download size={15} /> Télécharger la facture {o.invoiceId}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {empty && (
          <div className="mt-12 flex flex-col items-center gap-5 py-16 text-center">
            <Package size={48} strokeWidth={1} className="text-stone" />
            <p className="text-ink-soft" style={{ fontSize: "1rem" }}>Vous n'avez pas encore passé de commande.</p>
            <Link to="/boutique" className="border-b border-gold pb-1 text-gold-deep" style={{ fontSize: "0.9rem" }}>
              Explorer la collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
