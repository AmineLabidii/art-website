import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, ShoppingBag, Package, Archive,
  Users, FileText, Settings, LogOut, ExternalLink, Menu, X, Tag
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { AdminLogin } from "./AdminLogin";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/inventaire", label: "Inventaire", icon: Archive },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/factures", label: "Factures", icon: FileText },
  { to: "/admin/promos", label: "Codes Promo", icon: Tag },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminLayout() {
  const { authed, ready, logout } = useAdmin();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0B09]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-[#B8925A]/30 border-t-[#B8925A] animate-spin" />
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#4A4540" }}>CHARGEMENT</p>
        </div>
      </div>
    );
  }
  if (!authed) return <AdminLogin />;

  async function handleLogout() {
    await logout();
    navigate("/admin");
  }

  return (
    <div className="flex min-h-screen bg-[#0E0C09]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-[#1E1A13] bg-[#0A0907] lg:flex"
        style={{ boxShadow: "4px 0 30px rgba(0,0,0,0.4)" }}>
        <SidebarContent onLogout={handleLogout} onNav={() => {}} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[#1E1A13] bg-[#0A0907] lg:hidden">
              <SidebarContent onLogout={handleLogout} onNav={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between border-b border-[#1E1A13] bg-[#0A0907] px-4 py-3 lg:hidden">
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", letterSpacing: "0.15em", color: "#F0EAE0" }}>ATELIER</span>
          <button onClick={() => setMobileOpen(true)} className="text-[#6B6055] hover:text-[#B8925A] transition-colors">
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onLogout, onNav }: { onLogout: () => void; onNav: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-[#1A1710] px-6 py-7">
        <div className="mb-1 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-[#B8925A]/40 to-transparent" />
          <span style={{ fontSize: "0.52rem", letterSpacing: "0.22em", color: "#B8925A" }}>GALERIE</span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#B8925A]/40 to-transparent" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 400, letterSpacing: "0.18em", color: "#F0EAE0" }}>
          ATELIER
        </h2>
        <p style={{ fontSize: "0.55rem", letterSpacing: "0.18em", color: "#3A3530", marginTop: "2px" }}>ADMINISTRATION</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNav}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all ${isActive
                ? "bg-[#1A1710] text-[#C9A46B]"
                : "text-[#5A5450] hover:bg-[#141210] hover:text-[#9A8470]"}`
            }>
            {({ isActive }) => (
              <>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${isActive ? "bg-[#B8925A]/15" : "group-hover:bg-[#1E1A14]"}`}>
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-[#C9A46B]" : ""} />
                </div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.04em", fontWeight: isActive ? 500 : 400 }}>{label}</span>
                {isActive && <div className="ml-auto h-4 w-0.5 rounded-full bg-[#B8925A]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-[#1A1710] p-3 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[#3A3530] transition-all hover:bg-[#141210] hover:text-[#6B6055]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <ExternalLink size={14} />
          </div>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.04em" }}>Voir la boutique</span>
        </a>
        <button onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[#3A3530] transition-all hover:bg-red-950/30 hover:text-red-400">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <LogOut size={14} />
          </div>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.04em" }}>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
