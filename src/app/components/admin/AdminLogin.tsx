import { useState } from "react";
import { motion } from "motion/react";
import { useAdmin } from "../../context/AdminContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function AdminLogin() {
  const { login, signup } = useAdmin();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Veuillez saisir votre email et mot de passe."); return; }
    setLoading(true); setError("");
    const result = mode === "login"
      ? await login(email.trim(), password)
      : await signup(email.trim(), password, name.trim());
    if (!result.ok) setError(result.error ?? "Une erreur est survenue.");
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0C0B09]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8925A]/6 blur-[140px]" />
        <div className="absolute left-[15%] top-[20%] h-[250px] w-[250px] rounded-full bg-[#B8925A]/4 blur-[80px]" />
        <div className="absolute right-[15%] bottom-[20%] h-[200px] w-[200px] rounded-full bg-[#C9A46B]/4 blur-[60px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(#B8925A 1px,transparent 1px),linear-gradient(90deg,#B8925A 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
        className="relative w-full max-w-md px-6">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#B8925A]/60" />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#B8925A" }}>GALERIE D'ART · TUNISIE</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#B8925A]/60" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 400, color: "#F0EAE0", letterSpacing: "0.15em" }}>ATELIER</h1>
          <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: "#4A4540", marginTop: "0.4rem" }}>ESPACE ADMINISTRATION</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#252118] bg-[#121008]/90 shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-[#1E1A14] bg-[#0E0C08] p-1.5 flex gap-1">
            {(["login","signup"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className="relative flex-1 rounded-xl py-2.5 transition-colors"
                style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: mode===m ? "#F0EAE0" : "#4A4540" }}>
                {mode===m && <motion.div layoutId="adminTab" className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg,#1E1B15,#171410)" }} />}
                <span className="relative">{m==="login" ? "CONNEXION" : "CRÉER UN COMPTE"}</span>
              </button>
            ))}
          </div>

          <div className="p-8">
            <form onSubmit={submit} className="space-y-5">
              {mode==="signup" && <InputField label="Nom complet" value={name} onChange={setName} placeholder="Ahmed Ben Salem" />}
              <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="admin@atelier.tn" />
              <div className="space-y-2">
                <label style={{ display: "block", fontSize: "0.62rem", letterSpacing: "0.14em", color: "#4A4540" }}>MOT DE PASSE</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full rounded-xl border border-[#252118] bg-[#0A0907] px-4 py-3 pr-11 text-sm text-[#F0EAE0] placeholder-[#302C26] outline-none transition-all"
                    style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
                    onFocus={e => { e.currentTarget.style.borderColor="#B8925A50"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(184,146,90,0.08),inset 0 1px 3px rgba(0,0,0,0.4)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor="#252118"; e.currentTarget.style.boxShadow="inset 0 1px 3px rgba(0,0,0,0.4)"; }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#4A4540" }}
                    onMouseEnter={e => e.currentTarget.style.color="#B8925A"}
                    onMouseLeave={e => e.currentTarget.style.color="#4A4540"}>
                    {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-900/30 bg-red-950/20 px-4 py-3">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="relative mt-2 w-full overflow-hidden rounded-xl py-3.5 font-medium transition-all disabled:opacity-50"
                style={{ fontSize: "0.72rem", letterSpacing: "0.12em", background: "linear-gradient(135deg,#C9A46B 0%,#B8925A 50%,#9E7840 100%)", color: "#0C0B09" }}>
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 size={13} className="animate-spin"/>}
                  {mode==="login" ? "SE CONNECTER" : "CRÉER LE COMPTE"}
                </span>
              </button>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center" style={{ fontSize: "0.58rem", letterSpacing: "0.16em", color: "#2A2520" }}>
          ATELIER © {new Date().getFullYear()} · TOUS DROITS RÉSERVÉS
        </p>
      </motion.div>
    </div>
  );
}

function InputField({ label, type="text", value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label style={{ display: "block", fontSize: "0.62rem", letterSpacing: "0.14em", color: "#4A4540" }}>{label.toUpperCase()}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-[#252118] bg-[#0A0907] px-4 py-3 text-sm text-[#F0EAE0] placeholder-[#302C26] outline-none transition-all"
        style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
        onFocus={e => { e.currentTarget.style.borderColor="#B8925A50"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(184,146,90,0.08),inset 0 1px 3px rgba(0,0,0,0.4)"; }}
        onBlur={e => { e.currentTarget.style.borderColor="#252118"; e.currentTarget.style.boxShadow="inset 0 1px 3px rgba(0,0,0,0.4)"; }} />
    </div>
  );
}
