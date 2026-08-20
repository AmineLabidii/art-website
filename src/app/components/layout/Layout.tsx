import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { Toaster } from "../ui/sonner";
import { WhatsappIcon } from "../shared/WhatsappIcon";
import { useAdmin } from "../../context/AdminContext";
import { WHATSAPP_NUMBER } from "../../lib/whatsapp";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function FloatingWhatsApp() {
  const { company } = useAdmin();
  const number = (company.whatsapp ?? WHATSAPP_NUMBER).replace(/\D/g, "");
  const text = encodeURIComponent("Bonjour Atelier ✨\nJe souhaite en savoir plus sur vos œuvres. Pouvez-vous m'aider ?");
  const href = `https://wa.me/${number}?text=${text}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Atelier sur WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ background: "#25D366" }} />
      <WhatsappIcon size={26} className="relative text-white" />
    </motion.a>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Toaster position="bottom-right" />
    </div>
  );
}
