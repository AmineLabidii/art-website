import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, Download, FileText } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { buildInvoiceHtml } from "../../lib/invoice";
import { formatTND, formatTimestampTN } from "../../lib/format";

export function AdminInvoices() {
  const { invoices, orders, company } = useAdmin();
  const [q, setQ] = useState("");

  const enriched = useMemo(() =>
    invoices.map(inv => {
      const order = orders.find(o => o.id === inv.orderId);
      return { ...inv, order };
    }),
    [invoices, orders]
  );

  const filtered = useMemo(() => {
    if (!q.trim()) return enriched;
    const s = q.toLowerCase();
    return enriched.filter(inv =>
      inv.id.toLowerCase().includes(s) ||
      inv.orderId.toLowerCase().includes(s) ||
      inv.order?.customer.name.toLowerCase().includes(s)
    );
  }, [enriched, q]);

  const totalBilled = useMemo(() =>
    filtered.reduce((s, inv) => s + (inv.order?.total ?? 0), 0),
    [filtered]
  );

  function download(inv: typeof filtered[number]) {
    if (!inv.order) return;
    const html = buildInvoiceHtml(inv.order!, company);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  return (
    <div className="space-y-6">
      <div>
        <p style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>COMPTABILITÉ</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:400, color:"#F0EAE0" }}>Factures</h1>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A3530]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Facture, commande, client…"
            className="w-full rounded-xl border border-[#1E1A13] bg-[#0A0907] py-2.5 pl-9 pr-4 text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none transition-all"
            onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
            onBlur={e => e.currentTarget.style.borderColor="#1E1A13"} />
        </div>
        <div className="rounded-2xl border border-[#1E1A13] bg-[#0E0C08] px-5 py-3">
          <p style={{ fontSize:"0.58rem", letterSpacing:"0.12em", color:"#4A4540" }}>TOTAL FACTURÉ</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:"#C9A46B" }}>{formatTND(totalBilled)}</p>
        </div>
      </div>

      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1710]">
                {["Facture","Commande","Client","Date","Montant",""].map(h => (
                  <th key={h} className="px-5 py-4 text-left" style={{ fontSize:"0.58rem", letterSpacing:"0.14em", color:"#3A3530", fontWeight:500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111009]">
              {filtered.length === 0
                ? <tr><td colSpan={6} className="px-5 py-14 text-center">
                    <FileText size={28} className="mx-auto mb-3" style={{ color:"#2A2520" }} />
                    <p style={{ color:"#3A3530", fontSize:"0.8rem" }}>Aucune facture générée</p>
                  </td></tr>
                : filtered.map(inv => (
                  <tr key={inv.id} className="group transition-colors hover:bg-[#121009]">
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize:"0.78rem", color:"#C9A46B", fontFamily:"monospace", fontWeight:500 }}>{inv.id}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link to={`/admin/commandes/${inv.orderId}`} style={{ fontSize:"0.72rem", color:"#6B6055" }} className="hover:text-[#B8925A] transition-colors">
                        {inv.orderId}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize:"0.78rem", color:"#C0B09A" }}>{inv.order?.customer.name ?? "—"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize:"0.72rem", color:"#4A4540" }}>{inv.issuedAt.slice(0,10)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize:"0.82rem", color:"#F0EAE0", fontWeight:500 }}>{formatTND(inv.order?.total ?? 0)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => download(inv)}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#1A1710]"
                        style={{ fontSize:"0.65rem", color:"#B8925A" }}>
                        <Download size={12} /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="border-t border-[#111009] px-5 py-3">
            <p style={{ fontSize:"0.62rem", color:"#3A3530" }}>{filtered.length} facture{filtered.length>1?"s":""}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
