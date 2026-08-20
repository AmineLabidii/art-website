import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAdmin } from "../../context/AdminContext";
import { Save, RotateCcw, MessageCircle, ExternalLink } from "lucide-react";
import { WhatsappIcon } from "../shared/WhatsappIcon";

export function AdminSettings() {
  const { company, updateCompany } = useAdmin();
  const [form, setForm] = useState({ ...company });
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(company);

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  async function save() {
    setSaving(true);
    try {
      await updateCompany(form);
      toast.success("Paramètres enregistrés");
    } catch { toast.error("Erreur lors de l'enregistrement"); }
    setSaving(false);
  }

  const COMPANY_FIELDS: { label: string; key: keyof typeof form; placeholder: string }[] = [
    { label: "Texte du logo", key: "logoText", placeholder: "ATELIER" },
    { label: "Nom de l'entreprise", key: "name", placeholder: "Atelier — Galerie d'Art" },
    { label: "Adresse", key: "address", placeholder: "Rue de la Kasbah, 1006 Tunis" },
    { label: "Téléphone", key: "phone", placeholder: "+216 00 000 000" },
    { label: "Email", key: "email", placeholder: "contact@atelier.tn" },
    { label: "Matricule fiscal", key: "tax", placeholder: "1234567/A/M/000" },
    { label: "Registre de commerce", key: "registration", placeholder: "RC B123452026" },
  ];

  const waClean = (form.whatsapp ?? "").replace(/\D/g, "");
  const waPreview = waClean ? `https://wa.me/${waClean}` : null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>CONFIGURATION</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:400, color:"#F0EAE0" }}>Paramètres</h1>
      </div>

      {/* WhatsApp section */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
        className="overflow-hidden rounded-2xl border border-[#1E2E1A] bg-[#0A0E08]"
        style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="flex items-center gap-3 border-b border-[#152010] px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background:"rgba(37,211,102,0.1)" }}>
            <WhatsappIcon size={15} className="text-[#25D366]" />
          </div>
          <div>
            <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A6040" }}>WHATSAPP BUSINESS</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:"#7A9E7A", marginTop:"1px" }}>Numéro de contact boutique</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label style={{ display:"block", fontSize:"0.6rem", letterSpacing:"0.14em", color:"#4A6040" }}>NUMÉRO WHATSAPP</label>
            <p style={{ fontSize:"0.65rem", color:"#3A4A3A", marginBottom:"8px" }}>
              Format international sans espaces ni symboles — ex : <span style={{ color:"#7A9E7A", fontFamily:"monospace" }}>21612345678</span>
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                <WhatsappIcon size={14} className="text-[#25D366]" />
              </div>
              <input value={form.whatsapp ?? ""} onChange={set("whatsapp")} placeholder="21600000000"
                className="w-full rounded-xl border border-[#1E2E1A] bg-[#060A06] py-3 pl-9 pr-4 text-sm text-[#A0C0A0] placeholder-[#2A3A2A] outline-none transition-all font-mono"
                onFocus={e => e.currentTarget.style.borderColor="rgba(37,211,102,0.3)"}
                onBlur={e => e.currentTarget.style.borderColor="#1E2E1A"} />
            </div>
          </div>
          {waPreview && (
            <div className="flex items-center justify-between rounded-xl border border-[#1E2E1A] bg-[#060A06] px-4 py-3">
              <div>
                <p style={{ fontSize:"0.6rem", color:"#4A6040", letterSpacing:"0.1em" }}>APERÇU DU LIEN</p>
                <p style={{ fontSize:"0.72rem", color:"#7A9E7A", marginTop:"2px", fontFamily:"monospace" }}>{waPreview}</p>
              </div>
              <a href={waPreview} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                style={{ fontSize:"0.65rem", color:"#25D366", background:"rgba(37,211,102,0.08)" }}>
                Tester <ExternalLink size={11} />
              </a>
            </div>
          )}
        </div>
      </motion.div>

      {/* Company info section */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.06 }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="border-b border-[#1A1710] px-6 py-4">
          <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", color:"#4A4540" }}>INFORMATIONS DE L'ENTREPRISE</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:"#9A8470", marginTop:"2px" }}>Utilisées dans les factures générées</p>
        </div>
        <div className="p-6 space-y-4">
          {COMPANY_FIELDS.map(f => (
            <div key={f.key} className="space-y-1.5">
              <label style={{ display:"block", fontSize:"0.6rem", letterSpacing:"0.14em", color:"#4A4540" }}>{f.label.toUpperCase()}</label>
              <input value={(form as any)[f.key] ?? ""} onChange={set(f.key)} placeholder={f.placeholder}
                className="w-full rounded-xl border border-[#2A2520] bg-[#0A0907] px-4 py-3 text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none transition-all"
                onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
                onBlur={e => e.currentTarget.style.borderColor="#2A2520"} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-[#1A1710] px-6 py-4">
          {dirty && (
            <button onClick={() => setForm({ ...company })}
              className="flex items-center gap-1.5 rounded-xl border border-[#2A2520] px-4 py-2 transition-all hover:border-[#3A3530]"
              style={{ fontSize:"0.7rem", color:"#4A4540", letterSpacing:"0.06em" }}>
              <RotateCcw size={12} /> Annuler
            </button>
          )}
          <button onClick={save} disabled={!dirty || saving}
            className="flex items-center gap-1.5 rounded-xl px-5 py-2 font-medium transition-all disabled:opacity-40"
            style={{ fontSize:"0.72rem", letterSpacing:"0.08em", background: dirty ? "linear-gradient(135deg,#C9A46B,#B8925A)" : "#1A1710", color: dirty ? "#0C0B09" : "#3A3530" }}>
            <Save size={13} />
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
