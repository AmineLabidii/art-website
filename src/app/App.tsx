import { createBrowserRouter, RouterProvider } from "react-router";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Layout } from "./components/layout/Layout";
import { Home } from "./components/pages/Home";
import { Shop } from "./components/pages/Shop";
import { Product } from "./components/pages/Product";
import { Collections } from "./components/pages/Collections";
import { About } from "./components/pages/About";
import { Checkout } from "./components/pages/Checkout";
import { MyOrders } from "./components/pages/MyOrders";
import { Wishlist } from "./components/pages/Wishlist";
import { NotFound } from "./components/pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { AdminOrders } from "./components/admin/AdminOrders";
import { AdminOrderDetail } from "./components/admin/AdminOrderDetail";
import { AdminProducts } from "./components/admin/AdminProducts";
import { AdminInventory } from "./components/admin/AdminInventory";
import { AdminCustomers } from "./components/admin/AdminCustomers";
import { AdminInvoices } from "./components/admin/AdminInvoices";
import { AdminSettings } from "./components/admin/AdminSettings";
import { AdminPromos } from "./components/admin/AdminPromos";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/boutique", element: <Shop /> },
      { path: "/produit/:slug", element: <Product /> },
      { path: "/collections", element: <Collections /> },
      { path: "/histoire", element: <About /> },
      { path: "/commande", element: <Checkout /> },
      { path: "/mes-commandes", element: <MyOrders /> },
      { path: "/favoris", element: <Wishlist /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "commandes", element: <AdminOrders /> },
      { path: "commandes/:id", element: <AdminOrderDetail /> },
      { path: "produits", element: <AdminProducts /> },
      { path: "inventaire", element: <AdminInventory /> },
      { path: "clients", element: <AdminCustomers /> },
      { path: "factures", element: <AdminInvoices /> },
      { path: "promos", element: <AdminPromos /> },
      { path: "parametres", element: <AdminSettings /> },
    ],
  },
]);

export default function App() {
  return (
    <AdminProvider>
      <WishlistProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </WishlistProvider>
    </AdminProvider>
  );
}
