import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, PackageX, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../../context/AdminContext";

type Filter = "all" | "low" | "out";
const LOW = 3;

export function AdminInventory() {
  const { products, updateProduct } = useAdmin();
  const [filter, setFilter] = useState<Filter>("all");

  const stats = useMemo(() => ({
    inStock: products.filter(p => p.stock > LOW).length,
    low: products.filter(p => p.stock > 0 && p.stock <= LOW).length,
    out: products.filter(p => p.stock === 0).length,
  }), [products]);

  const filtered = useMemo(() => {
    let res = [...products];
    if (filter === "low") res = res.filter(p => p.stock > 0 && p.stock <= LOW);
    if (filter === "out") res = res.filter(p => p.stock === 0);
    return res.sort((a,b) => a.stock - b.stock);
  }, [products, filter]);

  async function adjust(id: string, delta: number) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    const stock = Math.max(0, p.stock + delta);
    await updateProduct(id, { stock });
    toast.success(`Stock mis à jour : ${stock} unité${stock>1?"s":""}`);
  }

  async function restock(id: string) {
    await updateProduct(id, { stock: 10 });
    toast.success("Réapprovisionné à 10 unités");
  }

  const TABS: { label: string; value: Filter; count: number; color: string }[] = [
    { label: "Tous", value: "all", count: products.length, color: "#6B6055" },
    { label: "Stock faible", value: "low", count: stats.low, color: "#C9A46B" },
    { label: "Épuisés", value: "out", count: stats.out, color: "#c05050" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>GESTION</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:400, color:"#F0EAE0" }}>Inventaire</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"En stock", value:stats.inStock, icon:Package, color:"#7B9E87", bg:"rgba(123,158,135,0.1)" },
          { label:"Stock faible", value:stats.low, icon:AlertTriangle, color:"#C9A46B", bg:"rgba(201,164,107,0.1)" },
          { label:"Épuisés", value:stats.out, icon:PackageX, color:"#c05050", bg:"rgba(192,80,80,0.1)" },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08, duration:0.5 }}
            className="rounded-2xl border border-[#1E1A13] bg-[#0E0C08] p-5" style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <div className="mb-3 rounded-xl p-2.5 w-fit" style={{ background:s.bg }}>
              <s.icon size={15} style={{ color:s.color }} strokeWidth={1.5} />
            </div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:500, color:"#F0EAE0", lineHeight:1 }}>{s.value}</p>
            <p style={{ fontSize:"0.6rem", letterSpacing:"0.1em", color:"#4A4540", marginTop:"6px" }}>{s.label.toUpperCase()}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.value} onClick={() => setFilter(t.value)}
            className="rounded-xl px-4 py-1.5 transition-all"
            style={{
              fontSize:"0.7rem", letterSpacing:"0.06em",
              background: filter===t.value ? "#141210" : "transparent",
              color: filter===t.value ? t.color : "#3A3530",
              border: `1px solid ${filter===t.value ? "#2A2520" : "transparent"}`,
            }}>
            {t.label} <span className="ml-1 opacity-60">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1710]">
                {["Produit","Collection","Statut","Stock",""].map(h => (
                  <th key={h} className="px-5 py-4 text-left" style={{ fontSize:"0.58rem", letterSpacing:"0.14em", color:"#3A3530", fontWeight:500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111009]">
              {filtered.map(p => {
                const isOut = p.stock === 0;
                const isLow = !isOut && p.stock <= LOW;
                const statusColor = isOut ? "#c05050" : isLow ? "#C9A46B" : "#7B9E87";
                const statusBg = isOut ? "rgba(192,80,80,0.1)" : isLow ? "rgba(201,164,107,0.1)" : "rgba(123,158,135,0.1)";
                const statusLabel = isOut ? "Épuisé" : isLow ? "Faible" : "OK";
                return (
                  <tr key={p.id} className="group transition-colors hover:bg-[#121009]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                          : <div className="h-10 w-10 rounded-lg bg-[#1A1710] flex-shrink-0" />}
                        <div>
                          <p style={{ fontSize:"0.8rem", color:"#C0B09A", fontWeight:500 }}>{p.name}</p>
                          <p style={{ fontSize:"0.65rem", color:"#3A3530" }}>{p.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><p style={{ fontSize:"0.72rem", color:"#4A4540" }}>{p.collection}</p></td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full px-2.5 py-1 text-[0.62rem] font-medium" style={{ background:statusBg, color:statusColor }}>{statusLabel}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjust(p.id,-1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2A2520] text-[#4A4540] transition-all hover:border-[#B8925A]/40 hover:text-[#B8925A]" style={{ fontSize:"1rem", lineHeight:1 }}>−</button>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color: isOut?"#c05050":isLow?"#C9A46B":"#F0EAE0", minWidth:"1.5rem", textAlign:"center" }}>{p.stock}</span>
                        <button onClick={() => adjust(p.id,1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2A2520] text-[#4A4540] transition-all hover:border-[#B8925A]/40 hover:text-[#B8925A]" style={{ fontSize:"1rem", lineHeight:1 }}>+</button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => restock(p.id)}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#1A1710]"
                        style={{ fontSize:"0.65rem", color:"#4A4540" }}>
                        <RefreshCw size={11} /> Réappro.
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
