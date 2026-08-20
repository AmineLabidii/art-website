import { ReactNode } from "react";
import { OrderStatus, ORDER_STATUS_META } from "../../data/orders";

export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {subtitle && <p style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>{subtitle.toUpperCase()}</p>}
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:400, color:"#F0EAE0", letterSpacing:"0.04em" }}>{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-medium"
      style={{ background: meta.bg, color: meta.color }}>
      {meta.label}
    </span>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#1E1A13] bg-[#0E0C08] ${className}`}
      style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
      {children}
    </div>
  );
}
