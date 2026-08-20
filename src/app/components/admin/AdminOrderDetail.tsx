import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Download, MapPin, Phone, Mail, StickyNote, CheckCircle2, Circle, MessageCircle } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { ORDER_STATUS_FLOW, ORDER_STATUS_META, OrderStatus } from "../../data/orders";
import { buildInvoiceHtml } from "../../lib/invoice";
import { formatTND, formatTimestampTN } from "../../lib/format";
import { buildAdminStatusLink, buildAdminCustomerLink } from "../../lib/whatsapp";
import { WhatsappIcon } from "../shared/WhatsappIcon";

export function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, products, company, updateOrderStatus, generateInvoice } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);
  if (!order) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p style={{ color:"#4A4540", fontSize:"0.85rem" }}>Commande introuvable.</p>
      <Link to="/admin/commandes" style={{ color:"#B8925A", fontSize:"0.78rem" }}>← Retour aux commandes</Link>
    </div>
  );

  const statusIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const canAdvance = order.status !== "cancelled" && statusIdx < ORDER_STATUS_FLOW.length - 1;

  async function advance() {
    if (!canAdvance) return;
    setLoading(true);
    await updateOrderStatus(order!.id, ORDER_STATUS_FLOW[statusIdx + 1]);
    setLoading(false);
  }

  async function cancel() {
    setLoading(true);
    await updateOrderStatus(order!.id, "cancelled");
    setLoading(false);
  }

  async function handleInvoice() {
    setLoading(true);
    const invId = await generateInvoice(order!.id);
    const html = buildInvoiceHtml(order!, company);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    setLoading(false);
  }

  const meta = ORDER_STATUS_META[order.status];

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button onClick={() => navigate("/admin/commandes")}
            className="mb-3 flex items-center gap-1.5 transition-colors hover:text-[#B8925A]"
            style={{ fontSize:"0.68rem", letterSpacing:"0.08em", color:"#4A4540" }}>
            <ArrowLeft size={13} /> RETOUR
          </button>
          <p style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>COMMANDE</p>
          <div className="flex items-center gap-3">
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.7rem", fontWeight:400, color:"#F0EAE0" }}>{order.id}</h1>
            <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background:meta.bg, color:meta.color }}>{meta.label}</span>
          </div>
          <p style={{ fontSize:"0.65rem", color:"#3A3530", marginTop:"4px" }}>
            {formatTimestampTN(new Date(order.createdAt))}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={buildAdminCustomerLink(order)} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all"
            style={{ fontSize:"0.7rem", color:"#25D366", borderColor:"rgba(37,211,102,0.25)", background:"rgba(37,211,102,0.06)", letterSpacing:"0.06em" }}>
            <WhatsappIcon size={14} className="text-[#25D366]" /> Contacter
          </a>
          <button onClick={handleInvoice} disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[#2A2520] bg-[#0E0C08] px-4 py-2.5 transition-all hover:border-[#B8925A]/40 hover:text-[#B8925A] disabled:opacity-50"
            style={{ fontSize:"0.7rem", color:"#6B6055", letterSpacing:"0.06em" }}>
            <FileText size={14} />
            {order.invoiceId ? `${order.invoiceId} — Télécharger` : "Générer la facture"}
            <Download size={12} />
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left col */}
        <div className="space-y-4 lg:col-span-2">
          {/* Items */}
          <div className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]" style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <div className="border-b border-[#1A1710] px-5 py-4">
              <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A4540" }}>ARTICLES COMMANDÉS</p>
            </div>
            <div className="divide-y divide-[#111009]">
              {order.lines.map((line, i) => (
                <div key={i} className="flex gap-4 p-5">
                  <img src={line.image} alt={line.name} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p style={{ fontSize:"0.85rem", color:"#C0B09A", fontWeight:500 }}>{line.name}</p>
                    <p style={{ fontSize:"0.7rem", color:"#4A4540", marginTop:"2px" }}>{line.artist}</p>
                    <p style={{ fontSize:"0.65rem", color:"#3A3530", marginTop:"4px" }}>{line.sizeLabel} · {line.frameName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p style={{ fontSize:"0.82rem", color:"#F0EAE0", fontWeight:500 }}>{formatTND(line.unitPrice * line.quantity)}</p>
                    <p style={{ fontSize:"0.65rem", color:"#3A3530", marginTop:"2px" }}>×{line.quantity} · {formatTND(line.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#1A1710] px-5 py-4 space-y-2">
              {[
                { label:"Sous-total", value:order.subtotal },
                ...(order.discount > 0 ? [{ label:"Remise", value:-order.discount }] : []),
                { label:"Livraison", value:order.delivery },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span style={{ fontSize:"0.72rem", color:"#4A4540" }}>{r.label}</span>
                  <span style={{ fontSize:"0.72rem", color: r.value < 0 ? "#7B9E87" : "#C0B09A" }}>{r.value < 0 ? `-${formatTND(Math.abs(r.value))}` : formatTND(r.value)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-[#1E1A13] pt-3">
                <span style={{ fontSize:"0.82rem", color:"#F0EAE0", fontWeight:500 }}>Total</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", color:"#C9A46B" }}>{formatTND(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="rounded-2xl border border-[#1E1A13] bg-[#0E0C08] p-5" style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A4540", marginBottom:"14px" }}>CLIENT</p>
            <p style={{ fontSize:"0.9rem", color:"#C0B09A", fontWeight:500, marginBottom:"12px" }}>{order.customer.name}</p>
            {[
              { icon: Phone, text: order.customer.phone },
              ...(order.customer.email ? [{ icon: Mail, text: order.customer.email }] : []),
              { icon: MapPin, text: `${order.customer.address}, ${order.customer.city}, ${order.customer.governorate}` },
              ...(order.customer.notes ? [{ icon: StickyNote, text: order.customer.notes }] : []),
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-2.5 mt-2.5">
                <Icon size={13} className="mt-0.5 flex-shrink-0 text-[#3A3530]" />
                <p style={{ fontSize:"0.72rem", color:"#6B6055" }}>{text}</p>
              </div>
            ))}
            <div className="mt-4 rounded-xl border border-[#1A1710] px-3 py-2 flex justify-between">
              <span style={{ fontSize:"0.65rem", color:"#4A4540" }}>Paiement</span>
              <span style={{ fontSize:"0.65rem", color: order.paymentStatus==="paid" ? "#7B9E87" : "#C9A46B" }}>
                {order.paymentMethod === "cod" ? "À la livraison" : "En ligne"} · {order.paymentStatus === "paid" ? "Payé" : "En attente"}
              </span>
            </div>
          </div>

          {/* Status workflow */}
          <div className="rounded-2xl border border-[#1E1A13] bg-[#0E0C08] p-5" style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A4540", marginBottom:"16px" }}>SUIVI COMMANDE</p>
            <div className="space-y-2 mb-6">
              {ORDER_STATUS_FLOW.map((s, i) => {
                const m = ORDER_STATUS_META[s];
                const done = ORDER_STATUS_FLOW.indexOf(order.status as OrderStatus) >= i && order.status !== "cancelled";
                const current = order.status === s;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {done
                        ? <CheckCircle2 size={16} style={{ color: current ? "#B8925A" : "#3A3530" }} />
                        : <Circle size={16} style={{ color:"#2A2520" }} />}
                    </div>
                    <span style={{ fontSize:"0.72rem", color: current ? "#C9A46B" : done ? "#6B6055" : "#2E2A24", fontWeight: current ? 500 : 400 }}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {canAdvance && (
              <button onClick={advance} disabled={loading}
                className="w-full rounded-xl py-2.5 font-medium transition-all disabled:opacity-50"
                style={{ fontSize:"0.72rem", letterSpacing:"0.08em", background:"linear-gradient(135deg,#C9A46B,#B8925A)", color:"#0C0B09" }}>
                {loading ? "…" : `→ ${ORDER_STATUS_META[ORDER_STATUS_FLOW[statusIdx + 1]].label}`}
              </button>
            )}
            {/* WhatsApp notification */}
            <a href={buildAdminStatusLink(order, order.status, company.whatsapp ?? "")}
              target="_blank" rel="noopener noreferrer"
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 transition-all"
              style={{ fontSize:"0.68rem", letterSpacing:"0.06em", color:"#25D366", border:"1px solid rgba(37,211,102,0.2)", background:"rgba(37,211,102,0.05)" }}>
              <WhatsappIcon size={13} className="text-[#25D366]" />
              Notifier le client ({ORDER_STATUS_META[order.status].label})
            </a>
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button onClick={cancel} disabled={loading}
                className="mt-1 w-full rounded-xl py-2 transition-all hover:bg-red-950/30 hover:text-red-400 disabled:opacity-50"
                style={{ fontSize:"0.68rem", letterSpacing:"0.08em", color:"#3A3530", border:"1px solid #1A1710" }}>
                Annuler la commande
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
