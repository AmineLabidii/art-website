import { supabase } from "./supabase";
import type { AdminProduct, CompanySettings } from "../context/AdminContext";
import type { Order, OrderStatus } from "../data/orders";

// ── localStorage KV ───────────────────────────────────────────────────────────
function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`atelier:${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown): void {
  localStorage.setItem(`atelier:${key}`, JSON.stringify(value));
}

// ── API ───────────────────────────────────────────────────────────────────────
export const api = {
  // ── seed ──
  seed: async (payload: { products: AdminProduct[]; orders: Order[]; company: CompanySettings }) => {
    const existing = lsGet<AdminProduct[]>("products");
    if (existing && existing.length > 0) return { seeded: false };
    lsSet("products", payload.products);
    lsSet("orders", payload.orders);
    lsSet("company", payload.company);
    return { seeded: true };
  },

  // ── products ──
  getProducts: async () => {
    const products = lsGet<AdminProduct[]>("products") ?? [];
    return { products };
  },
  createProduct: async (product: AdminProduct) => {
    if (!product.id) product.id = crypto.randomUUID();
    const products = lsGet<AdminProduct[]>("products") ?? [];
    products.unshift(product);
    lsSet("products", products);
    return { product };
  },
  updateProduct: async (id: string, patch: Partial<AdminProduct>) => {
    const products = lsGet<AdminProduct[]>("products") ?? [];
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Not found");
    products[idx] = { ...products[idx], ...patch };
    lsSet("products", products);
    return { product: products[idx] };
  },
  deleteProduct: async (id: string) => {
    const products = (lsGet<AdminProduct[]>("products") ?? []).filter((p) => p.id !== id);
    lsSet("products", products);
    return { ok: true };
  },

  // ── orders ──
  getOrders: async () => {
    const orders = lsGet<Order[]>("orders") ?? [];
    return { orders };
  },
  getOrder: async (id: string) => {
    const orders = lsGet<Order[]>("orders") ?? [];
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error("Not found");
    return { order };
  },
  createOrder: async (order: Order) => {
    if (!order.id) (order as any).id = crypto.randomUUID();
    if (!order.createdAt) (order as any).createdAt = new Date().toISOString();
    const orders = lsGet<Order[]>("orders") ?? [];
    orders.unshift(order);
    lsSet("orders", orders);
    return { order };
  },
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const orders = lsGet<Order[]>("orders") ?? [];
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Not found");
    orders[idx] = { ...orders[idx], status };
    lsSet("orders", orders);
    return { order: orders[idx] };
  },
  generateInvoice: async (id: string) => {
    const orders = lsGet<Order[]>("orders") ?? [];
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Not found");
    if (!orders[idx].invoiceId) {
      const year = new Date().getFullYear();
      const count = orders.filter((o) => o.invoiceId).length;
      orders[idx] = { ...orders[idx], invoiceId: `FACT-${year}-${String(count + 1).padStart(4, "0")}` };
      lsSet("orders", orders);
    }
    return { order: orders[idx] };
  },

  // ── company ──
  getCompany: async () => {
    const company = lsGet<CompanySettings>("company");
    return { company };
  },
  updateCompany: async (patch: Partial<CompanySettings>) => {
    const existing = lsGet<CompanySettings>("company") ?? {} as CompanySettings;
    const company = { ...existing, ...patch };
    lsSet("company", company);
    return { company };
  },

  // ── auth ──
  signup: async (_email: string, _password: string, _name?: string) => ({ user: null }),

  // ── storage ──
  uploadArtwork: async (file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `artwork/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("artwork").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("artwork").getPublicUrl(path);
    return { url: data.publicUrl, path };
  },
};
