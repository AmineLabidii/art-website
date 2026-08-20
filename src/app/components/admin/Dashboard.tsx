import { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, ArrowRight } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { ORDER_STATUS_META } from "../../data/orders";
import { formatTND, formatTimestampTN } from "../../lib/format";

const ease = [0.22,1,0.36,1] as const;

export function Dashboard() {
  const { orders, products } = useAdmin();

  const stats = useMemo(() => {
    const delivered = orders.filter(o => o.status === "delivered");
    const revenue = delivered.reduce((s, o) => s + o.total, 0);
    const customers = new Set(orders.map(o => o.customer.phone)).size;
    const lowStock = products.filter(p => p.stock <= 3 && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    return { revenue, orderCount: orders.length, customers, productCount: products.length, lowStock, outOfStock };
  }, [orders, products]);

  const revenueData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      days[d.toLocaleDateString("fr-FR", { weekday: "short" })] = 0;
    }
    orders.filter(o => o.status === "delivered").forEach(o => {
      const d = new Date(o.createdAt).toLocaleDateString("fr-FR", { weekday: "short" });
      if (d in days) days[d] += o.total;
    });
    return Object.entries(days).map(([jour, ca]) => ({ jour, ca }));
  }, [orders]);

  const collectionData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => o.lines.forEach(line => {
      const p = products.find(p => p.id === line.productId);
      const col = p?.collection ?? "Autre";
      map[col] = (map[col] ?? 0) + line.quantity;
    }));
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,5).map(([col, unites]) => ({ col, unites }));
  }, [orders, products]);

  const recent = useMemo(() =>
    [...orders].sort((a,b) => new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,5),
    [orders]);

  const KPIS = [
    { label: "Chiffre d'affaires", value: formatTND(stats.revenue), sub: "commandes livrées", icon: TrendingUp, color: "#C9A46B", glow: "rgba(184,146,90,0.12)" },
    { label: "Commandes", value: String(stats.orderCount), sub: "total reçues", icon: ShoppingBag, color: "#7B9E87", glow: "rgba(123,158,135,0.12)" },
    { label: "Clients uniques", value: String(stats.customers), sub: "par téléphone", icon: Users, color: "#8B9DC3", glow: "rgba(139,157,195,0.12)" },
    { label: "Produits", value: String(stats.productCount), sub: `${stats.outOfStock} épuisé · ${stats.lowStock} faible`, icon: Package, color: "#C9A46B", glow: "rgba(201,164,107,0.12)" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p style={{ fontSize:"0.58rem", letterSpacing:"0.22em", color:"#4A4540", marginBottom:"4px" }}>VUE D'ENSEMBLE</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.9rem", fontWeight:400, color:"#F0EAE0", letterSpacing:"0.04em" }}>Tableau de bord</h1>
        </div>
        {(stats.lowStock > 0 || stats.outOfStock > 0) && (
          <Link to="/admin/inventaire"
            className="flex items-center gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-2 transition-all hover:border-amber-700/60"
            style={{ fontSize:"0.68rem", color:"#D4A56A" }}>
            <AlertTriangle size={13} className="text-amber-500" />
            {stats.outOfStock + stats.lowStock} alerte{stats.outOfStock+stats.lowStock>1?"s":""} stock
          </Link>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.08, duration:0.55, ease }}
            className="relative overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08] p-5"
            style={{ boxShadow:`0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4)` }}>
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl opacity-40"
              style={{ background: k.glow, transform:"translate(30%,-30%)" }} />
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-xl p-2.5" style={{ background: k.glow }}>
                <k.icon size={15} style={{ color:k.color }} strokeWidth={1.5} />
              </div>
            </div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:500, color:"#F0EAE0", lineHeight:1 }}>{k.value}</p>
            <p style={{ fontSize:"0.6rem", letterSpacing:"0.1em", color:"#4A4540", marginTop:"8px" }}>{k.label.toUpperCase()}</p>
            <p style={{ fontSize:"0.6rem", color:"#2E2A24", marginTop:"3px" }}>{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-5">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.36, duration:0.6, ease }}
          className="lg:col-span-3 rounded-2xl border border-[#1E1A13] bg-[#0E0C08] p-6"
          style={{ boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A4540" }}>REVENUS</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:"#9A8470", marginTop:"2px" }}>7 derniers jours</p>
            </div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", color:"#C9A46B" }}>
              {formatTND(revenueData.reduce((s,d)=>s+d.ca,0))}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={revenueData} margin={{ top:4, right:0, left:-24, bottom:0 }}>
              <defs>
                <linearGradient id="auGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8925A" stopOpacity={0.35}/>
                  <stop offset="100%" stopColor="#B8925A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="jour" tick={{ fill:"#3A3530", fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#3A3530", fontSize:9 }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background:"#14120E", border:"1px solid #2A2520", borderRadius:"10px", fontSize:"11px", color:"#C9A46B" }}
                formatter={(v:any) => [formatTND(v),"CA"]} />
              <Area type="monotone" dataKey="ca" stroke="#B8925A" strokeWidth={2} fill="url(#auGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44, duration:0.6, ease }}
          className="lg:col-span-2 rounded-2xl border border-[#1E1A13] bg-[#0E0C08] p-6"
          style={{ boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A4540" }}>TOP COLLECTIONS</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:"#9A8470", marginTop:"2px", marginBottom:"20px" }}>Par unités vendues</p>
          {collectionData.length === 0
            ? <p style={{ color:"#3A3530", fontSize:"0.78rem" }}>Aucune vente enregistrée</p>
            : <ResponsiveContainer width="100%" height={175}>
                <BarChart data={collectionData} layout="vertical" margin={{ top:0, right:8, left:0, bottom:0 }}>
                  <XAxis type="number" tick={{ fill:"#3A3530", fontSize:9 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="col" tick={{ fill:"#6B6055", fontSize:9 }} axisLine={false} tickLine={false} width={72} />
                  <Tooltip contentStyle={{ background:"#14120E", border:"1px solid #2A2520", borderRadius:"10px", fontSize:"11px", color:"#C9A46B" }} />
                  <Bar dataKey="unites" fill="#B8925A" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
          }
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.52, duration:0.6, ease }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between border-b border-[#1A1710] px-6 py-4">
          <div>
            <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A4540" }}>ACTIVITÉ RÉCENTE</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:"#9A8470" }}>Dernières commandes</p>
          </div>
          <Link to="/admin/commandes"
            className="flex items-center gap-1.5 rounded-xl border border-[#1E1A13] px-3.5 py-1.5 transition-all hover:border-[#B8925A]/40 hover:text-[#B8925A]"
            style={{ fontSize:"0.65rem", letterSpacing:"0.08em", color:"#4A4540" }}>
            Voir tout <ArrowRight size={11} />
          </Link>
        </div>
        <div className="divide-y divide-[#0E0C08]">
          {recent.length === 0
            ? <p className="px-6 py-10 text-center" style={{ color:"#3A3530", fontSize:"0.8rem" }}>Aucune commande</p>
            : recent.map(o => {
              const meta = ORDER_STATUS_META[o.status];
              return (
                <Link key={o.id} to={`/admin/commandes/${o.id}`}
                  className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[#141210]">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#1A1710]">
                    <ShoppingBag size={14} className="text-[#4A4540]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize:"0.8rem", color:"#C0B09A", fontWeight:500 }}>{o.customer.name}</p>
                    <p style={{ fontSize:"0.63rem", color:"#3A3530", marginTop:"1px" }}>{o.id} · {o.customer.governorate}</p>
                  </div>
                  <p style={{ fontSize:"0.8rem", color:"#C9A46B", fontWeight:500, flexShrink:0 }}>{formatTND(o.total)}</p>
                  <span className="rounded-full px-2.5 py-1 text-[0.6rem] font-medium flex-shrink-0"
                    style={{ background:meta.bg, color:meta.color }}>{meta.label}</span>
                </Link>
              );
            })
          }
        </div>
      </motion.div>
    </div>
  );
}
