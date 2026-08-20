import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, Phone, Mail, MapPin, Users } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { formatTND } from "../../lib/format";

export function AdminCustomers() {
  const { orders } = useAdmin();
  const [q, setQ] = useState("");

  const customers = useMemo(() => {
    const map = new Map<string, { name:string; phone:string; email?:string; governorate:string; orderCount:number; total:number; lastOrderId:string }>();
    [...orders].sort((a,b) => new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).forEach(o => {
      const key = o.customer.phone;
      if (map.has(key)) {
        const c = map.get(key)!;
        c.orderCount++;
        c.total += o.total;
      } else {
        map.set(key, { name:o.customer.name, phone:o.customer.phone, email:o.customer.email, governorate:o.customer.governorate, orderCount:1, total:o.total, lastOrderId:o.id });
      }
    });
    return [...map.values()].sort((a,b) => b.total-a.total);
  }, [orders]);

  const filtered = useMemo(() => {
    if (!q.trim()) return customers;
    const s = q.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(s) || c.phone.includes(s) || c.email?.toLowerCase().includes(s));
  }, [customers, q]);

  return (
    <div className="space-y-6">
      <div>
        <p style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>GESTION</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:400, color:"#F0EAE0" }}>Clients</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A3530]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nom, téléphone, email…"
            className="w-full rounded-xl border border-[#1E1A13] bg-[#0A0907] py-2.5 pl-9 pr-4 text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none transition-all"
            onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
            onBlur={e => e.currentTarget.style.borderColor="#1E1A13"} />
        </div>
        <p style={{ fontSize:"0.68rem", color:"#3A3530" }}>{filtered.length} client{filtered.length>1?"s":""}</p>
      </div>

      {filtered.length === 0
        ? <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={32} style={{ color:"#2A2520" }} />
            <p style={{ color:"#3A3530", fontSize:"0.8rem" }}>Aucun client trouvé</p>
          </div>
        : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <motion.div key={c.phone}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04, duration:0.45 }}
                className="rounded-2xl border border-[#1E1A13] bg-[#0E0C08] p-5 transition-all hover:border-[#2A2520]"
                style={{ boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background:"linear-gradient(135deg,#1E1B15,#2A2520)" }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.9rem", color:"#B8925A" }}>
                      {c.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize:"0.85rem", color:"#C0B09A", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</p>
                    <p style={{ fontSize:"0.65rem", color:"#4A4540", marginTop:"1px" }}>{c.governorate}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-[#3A3530] flex-shrink-0" />
                    <p style={{ fontSize:"0.7rem", color:"#6B6055" }}>{c.phone}</p>
                  </div>
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={11} className="text-[#3A3530] flex-shrink-0" />
                      <p style={{ fontSize:"0.7rem", color:"#6B6055", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.email}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#1A1710] pt-3">
                  <div>
                    <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", color:"#C9A46B" }}>{formatTND(c.total)}</p>
                    <p style={{ fontSize:"0.6rem", color:"#3A3530", marginTop:"1px" }}>{c.orderCount} commande{c.orderCount>1?"s":""}</p>
                  </div>
                  <Link to={`/admin/commandes/${c.lastOrderId}`}
                    className="rounded-xl border border-[#2A2520] px-3 py-1.5 transition-all hover:border-[#B8925A]/40 hover:text-[#B8925A]"
                    style={{ fontSize:"0.62rem", color:"#4A4540", letterSpacing:"0.06em" }}>
                    Dernière cmd →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
      }
    </div>
  );
}
