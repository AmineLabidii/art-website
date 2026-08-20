import { Order } from "../data/orders";
import { CompanySettings } from "../context/AdminContext";
import { formatTND, formatTimestampTN } from "./format";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: "Paiement à la livraison",
  online: "Paiement en ligne",
};
const PAYMENT_STATUS_LABEL: Record<string, string> = {
  paid: "Payée",
  pending: "En attente",
  unpaid: "Impayée",
};

/** Build a self-contained, print-ready HTML invoice document (French). */
export function buildInvoiceHtml(order: Order, company: CompanySettings): string {
  const invoiceId = order.invoiceId ?? "PROFORMA";
  const issued = formatTimestampTN(new Date());

  const rows = order.lines
    .map(
      (l) => `
      <tr>
        <td>
          <div class="art">${escapeHtml(l.name)}</div>
          <div class="sub">${escapeHtml(l.artist)} · ${escapeHtml(l.sizeLabel)} · ${escapeHtml(l.frameName)}</div>
        </td>
        <td class="c">${l.quantity}</td>
        <td class="r">${formatTND(l.unitPrice)}</td>
        <td class="r">${formatTND(l.unitPrice * l.quantity)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>${invoiceId}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Manrope:wght@400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Manrope',sans-serif; color:#1a1714; padding:48px; font-size:13px; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #1a1714; padding-bottom:24px; }
  .logo { font-family:'Playfair Display',serif; font-size:28px; letter-spacing:4px; }
  .company { font-size:11px; color:#555; line-height:1.6; margin-top:8px; }
  .doc { text-align:right; }
  .doc h1 { font-family:'Playfair Display',serif; font-size:30px; color:#b8925a; font-weight:600; }
  .doc .num { font-size:14px; margin-top:4px; }
  .doc .date { font-size:11px; color:#555; margin-top:6px; }
  .parties { display:flex; justify-content:space-between; margin:32px 0; gap:40px; }
  .box { flex:1; }
  .box .label { text-transform:uppercase; letter-spacing:2px; font-size:9px; color:#b8925a; margin-bottom:8px; font-weight:600; }
  .box .line { font-size:12px; line-height:1.7; color:#333; }
  table { width:100%; border-collapse:collapse; margin-top:8px; }
  thead th { text-align:left; text-transform:uppercase; letter-spacing:1px; font-size:9px; color:#888; border-bottom:1px solid #ddd; padding:10px 8px; }
  th.c, td.c { text-align:center; } th.r, td.r { text-align:right; }
  tbody td { padding:14px 8px; border-bottom:1px solid #eee; vertical-align:top; }
  .art { font-family:'Playfair Display',serif; font-size:15px; }
  .sub { font-size:10px; color:#888; margin-top:3px; }
  .totals { margin-top:24px; margin-left:auto; width:280px; }
  .totals .row { display:flex; justify-content:space-between; padding:7px 0; font-size:13px; color:#444; }
  .totals .grand { border-top:2px solid #1a1714; margin-top:8px; padding-top:14px; font-family:'Playfair Display',serif; font-size:20px; color:#1a1714; }
  .pay { margin-top:32px; display:flex; gap:40px; font-size:12px; }
  .pay .k { color:#888; text-transform:uppercase; letter-spacing:1px; font-size:9px; }
  .pay .v { margin-top:4px; }
  .footer { margin-top:48px; border-top:1px solid #eee; padding-top:20px; text-align:center; font-size:10px; color:#999; line-height:1.6; }
  @media print { body { padding:24px; } .noprint { display:none; } }
  .btnbar { position:fixed; top:16px; right:16px; }
  .btnbar button { font-family:'Manrope'; background:#1a1714; color:#f7f4ef; border:none; padding:10px 20px; cursor:pointer; font-size:12px; letter-spacing:1px; }
</style>
</head>
<body>
  <div class="btnbar noprint"><button onclick="window.print()">Imprimer / Enregistrer en PDF</button></div>

  <div class="head">
    <div>
      <div class="logo">${escapeHtml(company.logoText)}</div>
      <div class="company">
        ${escapeHtml(company.name)}<br/>
        ${escapeHtml(company.address)}<br/>
        Tél : ${escapeHtml(company.phone)} · ${escapeHtml(company.email)}<br/>
        MF : ${escapeHtml(company.tax)} · RC : ${escapeHtml(company.registration)}
      </div>
    </div>
    <div class="doc">
      <h1>FACTURE</h1>
      <div class="num">N° ${escapeHtml(invoiceId)}</div>
      <div class="date">Émise le ${issued}<br/>(heure de Tunis)</div>
    </div>
  </div>

  <div class="parties">
    <div class="box">
      <div class="label">Facturé à</div>
      <div class="line">
        <strong>${escapeHtml(order.customer.name)}</strong><br/>
        ${escapeHtml(order.customer.address)}<br/>
        ${escapeHtml(order.customer.city)}, ${escapeHtml(order.customer.governorate)} ${escapeHtml(order.customer.postal || "")}<br/>
        Tél : ${escapeHtml(order.customer.phone)}<br/>
        ${order.customer.email ? "Email : " + escapeHtml(order.customer.email) : ""}
      </div>
    </div>
    <div class="box">
      <div class="label">Commande</div>
      <div class="line">
        Référence : <strong>${escapeHtml(order.id)}</strong><br/>
        Date : ${formatTimestampTN(new Date(order.createdAt))}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Désignation</th><th class="c">Qté</th><th class="r">Prix unit.</th><th class="r">Total</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Sous-total</span><span>${formatTND(order.subtotal)}</span></div>
    ${order.discount ? `<div class="row"><span>Remise</span><span>- ${formatTND(order.discount)}</span></div>` : ""}
    <div class="row"><span>Livraison</span><span>${order.delivery === 0 ? "Offerte" : formatTND(order.delivery)}</span></div>
    <div class="row grand"><span>Total TTC</span><span>${formatTND(order.total)}</span></div>
  </div>

  <div class="pay">
    <div><div class="k">Mode de paiement</div><div class="v">${PAYMENT_METHOD_LABEL[order.paymentMethod]}</div></div>
    <div><div class="k">Statut du paiement</div><div class="v">${PAYMENT_STATUS_LABEL[order.paymentStatus]}</div></div>
  </div>

  <div class="footer">
    Merci pour votre confiance. · ${escapeHtml(company.name)}<br/>
    Cette facture a été générée électroniquement et est valable sans signature.
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Open the invoice in a new tab, ready to print / save as PDF. */
export function openInvoice(order: Order, company: CompanySettings) {
  const html = buildInvoiceHtml(order, company);
  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}
