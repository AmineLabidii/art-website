import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { PRODUCTS } from "../data/products";
import { Product } from "../data/types";
import { SEED_ORDERS, Order, OrderStatus } from "../data/orders";
import { formatTimestampTN } from "../lib/format";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";

export interface AdminProduct extends Product {
  discount?: number; // percentage 0-100
}

export interface CompanySettings {
  name: string;
  logoText: string;
  address: string;
  phone: string;
  email: string;
  tax: string; // matricule fiscal
  registration: string; // registre de commerce
  whatsapp: string; // Tunisia number, digits only e.g. 21612345678
}

export interface Invoice {
  id: string; // FACT-2026-0001
  orderId: string;
  issuedAt: string; // formatted TN timestamp
}

export interface PromoCode {
  code: string;
  discount: number; // percentage 1-100
  active: boolean;
}

const DEFAULT_PROMO_CODES: PromoCode[] = [
  { code: "BIENVENUE10", discount: 10, active: true },
  { code: "ATELIER20", discount: 20, active: true },
];

const DEFAULT_COMPANY: CompanySettings = {
  name: "Atelier — Galerie d'Art",
  logoText: "ATELIER",
  address: "Rue de la Kasbah, 1006 Tunis, Tunisie",
  phone: "+216 00 000 000",
  email: "contact@atelier.tn",
  tax: "1234567/A/M/000",
  registration: "RC B123452026",
  whatsapp: "21600000000",
};

interface AdminContextValue {
  products: AdminProduct[];
  orders: Order[];
  invoices: Invoice[];
  company: CompanySettings;
  promoCodes: PromoCode[];
  authed: boolean;
  ready: boolean; // initial public data loaded
  ordersLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  addProduct: (p: AdminProduct) => Promise<void>;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (o: Omit<Order, "id">) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  generateInvoice: (orderId: string) => Promise<string>;
  updateCompany: (patch: Partial<CompanySettings>) => Promise<void>;
  addPromoCode: (p: PromoCode) => void;
  removePromoCode: (code: string) => void;
  validatePromo: (code: string) => PromoCode | null;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [company, setCompany] = useState<CompanySettings>(DEFAULT_COMPANY);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const raw = localStorage.getItem("atelier:promos");
      return raw ? JSON.parse(raw) : DEFAULT_PROMO_CODES;
    } catch { return DEFAULT_PROMO_CODES; }
  });
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const { orders } = await api.getOrders();
      setOrders(orders);
    } catch (err) {
      console.error(`Failed to load orders: ${err}`);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Initial public load: products + company. Seed on first ever run.
  useEffect(() => {
    (async () => {
      try {
        let { products } = await api.getProducts();
        if (products.length === 0) {
          // First run — seed the backend with the bundled catalogue.
          await api.seed({
            products: PRODUCTS.map((p) => ({ ...p })),
            orders: SEED_ORDERS,
            company: DEFAULT_COMPANY,
          });
          products = (await api.getProducts()).products;
        }
        setProducts(products);
      } catch (err) {
        console.error(`Failed to load products, falling back to bundled data: ${err}`);
        setProducts(PRODUCTS.map((p) => ({ ...p })));
      }

      try {
        const { company } = await api.getCompany();
        if (company) setCompany(company);
      } catch (err) {
        console.error(`Failed to load company settings: ${err}`);
      }

      // Restore an existing admin session.
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setAuthed(true);
          await loadOrders();
        }
      } catch (err) {
        console.error(`Failed to restore session: ${err}`);
      }

      setReady(true);
    })();
  }, [loadOrders]);

  const invoices = useMemo<Invoice[]>(
    () =>
      orders
        .filter((o) => o.invoiceId)
        .map((o) => ({
          id: o.invoiceId as string,
          orderId: o.id,
          issuedAt: formatTimestampTN(new Date(o.createdAt)),
        }))
        .sort((a, b) => (a.id < b.id ? 1 : -1)),
    [orders],
  );

  const value: AdminContextValue = {
    products,
    orders,
    invoices,
    company,
    promoCodes,
    authed,
    ready,
    ordersLoading,

    login: async (email, password) => {
      // Built-in fallback account (works without Supabase auth).
      if (email === "admin@atelier.tn" && password === "Atelier2024!") {
        setAuthed(true);
        await loadOrders();
        return { ok: true };
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error(`Login error for ${email}: ${error.message}`);
        return { ok: false, error: error.message };
      }
      setAuthed(true);
      await loadOrders();
      return { ok: true };
    },

    signup: async (email, password, name) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: name ? { data: { full_name: name } } : undefined,
      });
      if (error) return { ok: false, error: error.message };
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) return { ok: false, error: loginErr.message };
      setAuthed(true);
      await loadOrders();
      return { ok: true };
    },

    logout: async () => {
      await supabase.auth.signOut();
      setAuthed(false);
      setOrders([]);
    },

    addProduct: async (p) => {
      const { product } = await api.createProduct(p);
      setProducts((s) => [product, ...s]);
    },
    updateProduct: async (id, patch) => {
      const { product } = await api.updateProduct(id, patch);
      setProducts((s) => s.map((p) => (p.id === id ? product : p)));
    },
    deleteProduct: async (id) => {
      await api.deleteProduct(id);
      setProducts((s) => s.filter((p) => p.id !== id));
    },

    addOrder: async (o) => {
      const { order } = await api.createOrder(o as Order);
      setOrders((s) => [order, ...s]);
      return order;
    },
    updateOrderStatus: async (id, status) => {
      const { order } = await api.updateOrderStatus(id, status);
      setOrders((s) => s.map((o) => (o.id === id ? order : o)));
    },
    generateInvoice: async (orderId) => {
      const { order } = await api.generateInvoice(orderId);
      setOrders((s) => s.map((o) => (o.id === orderId ? order : o)));
      return order.invoiceId as string;
    },

    updateCompany: async (patch) => {
      const { company } = await api.updateCompany(patch);
      setCompany(company);
    },

    addPromoCode: (p) => {
      setPromoCodes((prev) => {
        const updated = [...prev.filter((x) => x.code !== p.code), p];
        localStorage.setItem("atelier:promos", JSON.stringify(updated));
        return updated;
      });
    },
    removePromoCode: (code) => {
      setPromoCodes((prev) => {
        const updated = prev.filter((x) => x.code !== code);
        localStorage.setItem("atelier:promos", JSON.stringify(updated));
        return updated;
      });
    },
    validatePromo: (code) => {
      const found = promoCodes.find(
        (p) => p.code === code.toUpperCase().trim() && p.active
      );
      return found ?? null;
    },
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
