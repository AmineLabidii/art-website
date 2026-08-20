import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Plus, Trash2, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

export function AdminPromos() {
  const { promoCodes, addPromoCode, removePromoCode } = useAdmin();
  const [form, setForm] = useState({ code: "", discount: "" });
  const [adding, setAdding] = useState(false);

  function submit() {
    const code = form.code.toUpperCase().trim();
    const discount = parseInt(form.discount, 10);
    if (!code || isNaN(discount) || discount < 1 || discount > 100) {
      toast.error("Code invalide ou remise hors-limites (1-100%).");
      return;
    }
    addPromoCode({ code, discount, active: true });
    setForm({ code: "", discount: "" });
    setAdding(false);
    toast.success(`Code ${code} créé.`);
  }

  function toggle(code: string, currentActive: boolean) {
    const promo = promoCodes.find((p) => p.code === code);
    if (!promo) return;
    addPromoCode({ ...promo, active: !currentActive });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: "#4A4540", marginBottom: "4px" }}>MARKETING</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 400, color: "#F0EAE0" }}>Codes Promo</h1>
      </div>

      {/* add form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center justify-between border-b border-[#1A1710] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(184,146,90,0.12)" }}>
              <Tag size={15} style={{ color: "#B8925A" }} />
            </div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", color: "#C0B09A" }}>Nouveau code</p>
          </div>
          <button
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all"
            style={{ fontSize: "0.68rem", letterSpacing: "0.08em", background: "linear-gradient(135deg,#C9A46B,#B8925A)", color: "#0C0B09" }}
          >
            <Plus size={12} /> Créer
          </button>
        </div>

        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
            <div className="flex gap-3 p-6">
              <div className="flex-1 space-y-1.5">
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.14em", color: "#4A4540" }}>CODE</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="BIENVENUE10"
                  className="w-full rounded-xl border border-[#2A2520] bg-[#0A0907] px-4 py-2.5 font-mono text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B8925A40")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2520")}
                />
              </div>
              <div className="w-28 space-y-1.5">
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.14em", color: "#4A4540" }}>REMISE %</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.discount}
                  onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                  placeholder="10"
                  className="w-full rounded-xl border border-[#2A2520] bg-[#0A0907] px-4 py-2.5 text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B8925A40")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2520")}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={submit}
                  className="rounded-xl px-5 py-2.5 font-medium transition-all"
                  style={{ fontSize: "0.72rem", background: "linear-gradient(135deg,#C9A46B,#B8925A)", color: "#0C0B09" }}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
      >
        <div className="border-b border-[#1A1710] px-6 py-4">
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.16em", color: "#4A4540" }}>CODES ACTIFS</p>
        </div>
        <div className="divide-y divide-[#111009]">
          {promoCodes.length === 0 ? (
            <div className="py-12 text-center">
              <Tag size={24} className="mx-auto mb-3" style={{ color: "#2A2520" }} />
              <p style={{ color: "#3A3530", fontSize: "0.8rem" }}>Aucun code promo créé</p>
            </div>
          ) : (
            promoCodes.map((p) => (
              <div key={p.code} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#121009]">
                <div className="flex-1">
                  <p style={{ fontFamily: "monospace", fontSize: "0.88rem", color: p.active ? "#C9A46B" : "#4A4540", fontWeight: 600 }}>
                    {p.code}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "#4A4540", marginTop: "2px" }}>
                    {p.discount}% de remise · {p.active ? "Actif" : "Désactivé"}
                  </p>
                </div>
                <div
                  className="rounded-full px-3 py-1"
                  style={{
                    fontSize: "0.65rem",
                    background: p.active ? "rgba(123,158,135,0.12)" : "rgba(74,69,64,0.2)",
                    color: p.active ? "#7B9E87" : "#4A4540",
                  }}
                >
                  -{p.discount}%
                </div>
                <button onClick={() => toggle(p.code, p.active)} className="transition-opacity hover:opacity-70">
                  {p.active
                    ? <ToggleRight size={22} style={{ color: "#7B9E87" }} />
                    : <ToggleLeft size={22} style={{ color: "#3A3530" }} />}
                </button>
                <button
                  onClick={() => { removePromoCode(p.code); toast.success(`Code ${p.code} supprimé.`); }}
                  className="transition-opacity hover:opacity-70"
                >
                  <Trash2 size={15} style={{ color: "#4A4540" }} />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <div className="rounded-xl border border-[#1E1A13] bg-[#0A0907] px-5 py-4">
        <p style={{ fontSize: "0.65rem", color: "#4A4540", lineHeight: 1.6 }}>
          Les codes promo sont saisis par le client lors du paiement. Exemples disponibles : <span style={{ color: "#C9A46B", fontFamily: "monospace" }}>BIENVENUE10</span> (-10%) · <span style={{ color: "#C9A46B", fontFamily: "monospace" }}>ATELIER20</span> (-20%).
        </p>
      </div>
    </div>
  );
}
