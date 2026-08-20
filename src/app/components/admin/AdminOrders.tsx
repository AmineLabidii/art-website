import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, ChevronRight, ShoppingBag } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { ORDER_STATUS_META, OrderStatus } from "../../data/orders";
import { formatTND, formatTimestampTN } from "../../lib/format";

const FILTERS: { label: string; value: "all" | OrderStatus }[] = [
  { label: "Toutes", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "Confirmées", value: "confirmed" },
  { label: "Préparation", value: "preparing" },
  { label: "Expédiées", value: "shipped" },
  { label: "Livrées", value: "delivered" },
  { label: "Annulées", value: "cancelled" },
];

export function AdminOrders() {
  const { orders } = useAdmin();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const filtered = useMemo(() => {
    let res = [...orders].sort((a,b) => new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
    if (filter !== "all") res = res.filter(o => o.status === filter);
    if (q.trim()) {
      const s = q.toLowerCase();
      res = res.filter(o => o.reference.toLowerCase().includes(s) || o.customer.name.toLowerCase().includes(s));
    }
    return res;
  }, [orders, filter, q]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: orders.length };
    orders.forEach(o => { m[o.status] = (m[o.status] ?? 0) + 1; });
    return m;
  }, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <p style={{ fontSize:"0.6rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>GESTION</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:400, color:"#F0EAE0", letterSpacing:"0.05em" }}>Commandes</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="rounded-xl px-3.5 py-1.5 text-xs transition-all"
            style={{
              background: filter===f.value ? "linear-gradient(135deg,#C9A46B,#B8925A)" : "#0E0C08",
              color: filter===f.value ? "#0C0B09" : "#4A4540",
              border: `1px solid ${filter===f.value ? "transparent" : "#1E1A13"}`,
              fontWeight: filter===f.value ? 600 : 400,
              letterSpacing: "0.06em",
            }}>
            {f.label}
            {counts[f.value] ? <span className="ml-1.5 opacity-70">{counts[f.value]}</span> : null}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A3530]" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Référence, client…"
          className="w-full rounded-xl border border-[#1E1A13] bg-[#0A0907] py-2.5 pl-9 pr-4 text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none transition-all"
          onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
          onBlur={e => e.currentTarget.style.borderColor="#1E1A13"} />
      </div>

      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1710]">
                {["Référence","Client","Gouvernorat","Total","Paiement","Statut",""].map(h => (
                  <th key={h} className="px-5 py-4 text-left"
                    style={{ fontSize:"0.58rem", letterSpacing:"0.14em", color:"#3A3530", fontWeight:500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111009]">
              {filtered.length === 0
                ? <tr><td colSpan={7} className="px-5 py-14 text-center">
                    <ShoppingBag size={28} className="mx-auto mb-3" style={{ color:"#2A2520" }} />
                    <p style={{ color:"#3A3530", fontSize:"0.8rem" }}>Aucune commande trouvée</p>
                  </td></tr>
                : filtered.map(o => {
                  const meta = ORDER_STATUS_META[o.status];
                  return (
                    <tr key={o.id} className="group transition-colors hover:bg-[#121009]">
                      <td className="px-5 py-3.5">
                        <p style={{ fontSize:"0.75rem", color:"#C9A46B", fontFamily:"monospace", fontWeight:500 }}>{o.reference}</p>
                        <p style={{ fontSize:"0.6rem", color:"#3A3530", marginTop:"2px" }}>{formatTimestampTN(new Date(o.createdAt)).slice(0,10)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p style={{ fontSize:"0.8rem", color:"#C0B09A" }}>{o.customer.name}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p style={{ fontSize:"0.75rem", color:"#6B6055" }}>{o.customer.governorate}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p style={{ fontSize:"0.82rem", color:"#F0EAE0", fontWeight:500 }}>{formatTND(o.total)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p style={{ fontSize:"0.7rem", color:"#4A4540" }}>{o.paymentMethod === "cod" ? "Livraison" : "WhatsApp"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full px-2.5 py-1 text-[0.62rem] font-medium" style={{ background:meta.bg, color:meta.color }}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link to={`/admin/commandes/${o.id}`}
                          className="flex items-center gap-1 text-[#B8925A] opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ fontSize:"0.68rem" }}>
                          Détail <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="border-t border-[#111009] px-5 py-3">
            <p style={{ fontSize:"0.62rem", color:"#3A3530" }}>{filtered.length} commande{filtered.length>1?"s":""}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
