import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { toast } from "sonner";
import { useAdmin, AdminProduct } from "../../context/AdminContext";
import { formatTND } from "../../lib/format";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../ui/alert-dialog";

const EMPTY: Partial<AdminProduct> = {
  name:"", artist:"", collection:"", price:0, discount:0, stock:1,
  orientation:"portrait", style:"", images:[], description:"", materials:"", dimensions:"",
};

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<AdminProduct> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!q.trim()) return products;
    const s = q.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(s) || p.artist.toLowerCase().includes(s));
  }, [products, q]);

  function openNew() { setEditing({ ...EMPTY, id: undefined }); }
  function openEdit(p: AdminProduct) { setEditing({ ...p }); }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateProduct(editing.id, editing);
        toast.success("Produit mis à jour");
      } else {
        await addProduct({ ...editing, id: crypto.randomUUID(), rating: 0, reviews: 0, popularity: 0 } as AdminProduct);
        toast.success("Produit ajouté");
      }
      setEditing(null);
    } catch { toast.error("Erreur lors de la sauvegarde"); }
    setSaving(false);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    await deleteProduct(deletingId);
    toast.success("Produit supprimé");
    setDeletingId(null);
  }

  const field = (label: string, key: keyof AdminProduct, type: string = "text") => (
    <div className="space-y-1.5">
      <label style={{ display:"block", fontSize:"0.6rem", letterSpacing:"0.12em", color:"#4A4540" }}>{label.toUpperCase()}</label>
      <input type={type} value={(editing as any)?.[key] ?? ""} onChange={e => setEditing(prev => ({ ...prev, [key]: type==="number" ? Number(e.target.value) : e.target.value }))}
        className="w-full rounded-xl border border-[#2A2520] bg-[#0A0907] px-3.5 py-2.5 text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none transition-all"
        onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
        onBlur={e => e.currentTarget.style.borderColor="#2A2520"} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"#4A4540", marginBottom:"4px" }}>CATALOGUE</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:400, color:"#F0EAE0" }}>Produits</h1>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all"
          style={{ fontSize:"0.72rem", letterSpacing:"0.08em", background:"linear-gradient(135deg,#C9A46B,#B8925A)", color:"#0C0B09" }}>
          <Plus size={14} /> Nouveau produit
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A3530]" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nom, artiste…"
          className="w-full rounded-xl border border-[#1E1A13] bg-[#0A0907] py-2.5 pl-9 pr-4 text-sm text-[#C0B09A] placeholder-[#2A2520] outline-none transition-all"
          onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
          onBlur={e => e.currentTarget.style.borderColor="#1E1A13"} />
      </div>

      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className="overflow-hidden rounded-2xl border border-[#1E1A13] bg-[#0E0C08]"
        style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1710]">
                {["Œuvre","Artiste","Collection","Prix","Stock","Statut",""].map(h => (
                  <th key={h} className="px-5 py-4 text-left"
                    style={{ fontSize:"0.58rem", letterSpacing:"0.14em", color:"#3A3530", fontWeight:500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111009]">
              {filtered.length === 0
                ? <tr><td colSpan={7} className="px-5 py-14 text-center">
                    <Package size={28} className="mx-auto mb-3" style={{ color:"#2A2520" }} />
                    <p style={{ color:"#3A3530", fontSize:"0.8rem" }}>Aucun produit</p>
                  </td></tr>
                : filtered.map(p => (
                  <tr key={p.id} className="group transition-colors hover:bg-[#121009]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={p.name} className="h-11 w-11 rounded-lg object-cover flex-shrink-0" />
                          : <div className="h-11 w-11 rounded-lg bg-[#1A1710] flex-shrink-0" />}
                        <div>
                          <p style={{ fontSize:"0.8rem", color:"#C0B09A", fontWeight:500 }}>{p.name}</p>
                          {p.discount ? <span className="rounded-full bg-[#B8925A]/20 px-1.5 py-0.5 text-[0.58rem] text-[#C9A46B]">-{p.discount}%</span> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><p style={{ fontSize:"0.75rem", color:"#6B6055" }}>{p.artist}</p></td>
                    <td className="px-5 py-3.5"><p style={{ fontSize:"0.75rem", color:"#4A4540" }}>{p.collection}</p></td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p style={{ fontSize:"0.82rem", color:"#F0EAE0", fontWeight:500 }}>{formatTND(p.discount ? p.price*(1-p.discount/100) : p.price)}</p>
                        {p.discount ? <p style={{ fontSize:"0.62rem", color:"#3A3530", textDecoration:"line-through" }}>{formatTND(p.price)}</p> : null}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize:"0.8rem", color: p.stock===0 ? "#a02f2f" : p.stock<=3 ? "#8a6d1a" : "#C0B09A", fontWeight:500 }}>{p.stock}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full px-2.5 py-1 text-[0.62rem] font-medium"
                        style={{ background: p.stock===0 ? "#3a1010" : p.stock<=3 ? "#3a2e10" : "#10241a", color: p.stock===0 ? "#c05050" : p.stock<=3 ? "#c09030" : "#50a070" }}>
                        {p.stock===0 ? "Épuisé" : p.stock<=3 ? "Stock faible" : "En stock"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 transition-colors hover:bg-[#1A1710]" style={{ color:"#4A4540" }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeletingId(p.id)} className="rounded-lg p-1.5 transition-colors hover:bg-red-950/40" style={{ color:"#4A4540" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="border-t border-[#111009] px-5 py-3">
            <p style={{ fontSize:"0.62rem", color:"#3A3530" }}>{filtered.length} produit{filtered.length>1?"s":""}</p>
          </div>
        )}
      </motion.div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border border-[#2A2520] bg-[#0E0C08] text-[#C0B09A]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", fontWeight:400, color:"#F0EAE0" }}>
              {editing?.id ? "Modifier le produit" : "Nouveau produit"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2">{field("Nom de l'œuvre","name")}</div>
            {field("Artiste","artist")}
            {field("Collection","collection")}
            {field("Prix (DT)","price","number")}
            {field("Remise (%)","discount","number")}
            {field("Stock","stock","number")}
            {field("Format","orientation")}
            {field("Style","style")}
            <div className="col-span-2">{field("Dimensions","dimensions")}</div>
            <div className="col-span-2">{field("Matériaux","materials")}</div>
            <div className="col-span-2 space-y-1.5">
              <label style={{ display:"block", fontSize:"0.6rem", letterSpacing:"0.12em", color:"#4A4540" }}>DESCRIPTION</label>
              <textarea rows={3} value={(editing as any)?.description ?? ""} onChange={e => setEditing(prev => ({ ...prev, description: e.target.value }))}
                className="w-full resize-none rounded-xl border border-[#2A2520] bg-[#0A0907] px-3.5 py-2.5 text-sm text-[#C0B09A] outline-none transition-all"
                onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
                onBlur={e => e.currentTarget.style.borderColor="#2A2520"} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label style={{ display:"block", fontSize:"0.6rem", letterSpacing:"0.12em", color:"#4A4540" }}>URL IMAGE PRINCIPALE</label>
              <input value={editing?.images?.[0] ?? ""} onChange={e => setEditing(prev => ({ ...prev, images: [e.target.value, ...(prev?.images?.slice(1) ?? [])] }))}
                placeholder="https://…"
                className="w-full rounded-xl border border-[#2A2520] bg-[#0A0907] px-3.5 py-2.5 text-sm text-[#C0B09A] outline-none transition-all"
                onFocus={e => e.currentTarget.style.borderColor="#B8925A40"}
                onBlur={e => e.currentTarget.style.borderColor="#2A2520"} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setEditing(null)} className="rounded-xl border border-[#2A2520] px-4 py-2 text-sm text-[#4A4540] transition-all hover:border-[#3A3530]">
              Annuler
            </button>
            <button onClick={save} disabled={saving}
              className="rounded-xl px-5 py-2 text-sm font-medium transition-all disabled:opacity-50"
              style={{ background:"linear-gradient(135deg,#C9A46B,#B8925A)", color:"#0C0B09" }}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent className="border border-[#2A2520] bg-[#0E0C08]">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#F0EAE0" }}>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#4A4540" }}>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2A2520] bg-transparent text-[#4A4540] hover:bg-[#141210]">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-900/80 text-red-100 hover:bg-red-900">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
