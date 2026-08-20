import PptxGenJS from "pptxgenjs";

const prs = new PptxGenJS();

// ─── Theme ───────────────────────────────────────────────────────────────────
const C = {
  ink:      "0C0B09",
  gold:     "B8925A",
  goldLight:"C9A46B",
  cream:    "F0EAE0",
  creamMid: "E8DDD0",
  stone:    "8A7E72",
  white:    "FFFFFF",
};

prs.layout = "LAYOUT_WIDE";   // 33.87 × 19.05 cm  (16:9)

// ─── Helper: dark slide bg ───────────────────────────────────────────────────
function darkBg(slide) {
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.ink } });
}

// ─── Helper: gold accent bar (left edge) ─────────────────────────────────────
function accentBar(slide, { h = "100%", y = 0 } = {}) {
  slide.addShape(prs.ShapeType.rect, { x: 0, y, w: 0.09, h, fill: { color: C.gold } });
}

// ─── Helper: eyebrow label ───────────────────────────────────────────────────
function eyebrow(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.65, y: opts.y ?? 0.5,
    w: opts.w ?? 8, h: 0.28,
    fontSize: 8, bold: true, color: C.gold,
    charSpacing: 3, fontFace: "Calibri",
    ...opts,
  });
}

// ─── Helper: display heading ─────────────────────────────────────────────────
function heading(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.65, y: opts.y ?? 0.85,
    w: opts.w ?? 11, h: opts.h ?? 1.1,
    fontSize: opts.fontSize ?? 36, bold: false, color: C.cream,
    fontFace: "Georgia", ...opts,
  });
}

// ─── Helper: body text ───────────────────────────────────────────────────────
function body(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.65, y: opts.y ?? 2.1,
    w: opts.w ?? 11, h: opts.h ?? 3,
    fontSize: opts.fontSize ?? 13, color: C.stone,
    fontFace: "Calibri", lineSpacingMultiple: 1.4,
    ...opts,
  });
}

// ─── Helper: gold divider ─────────────────────────────────────────────────────
function divider(slide, opts = {}) {
  slide.addShape(prs.ShapeType.rect, {
    x: opts.x ?? 0.65, y: opts.y ?? 1.95,
    w: opts.w ?? 1.5, h: 0.025,
    fill: { color: C.gold }, ...opts,
  });
}

// ─── Helper: card ─────────────────────────────────────────────────────────────
function card(slide, { x, y, w, h, title, subtitle, body: bodyText, icon }) {
  // card bg
  slide.addShape(prs.ShapeType.rect, {
    x, y, w, h,
    fill: { color: "161410" },
    line: { color: "2A2520", width: 0.5 },
  });
  // gold top edge
  slide.addShape(prs.ShapeType.rect, { x, y, w, h: 0.045, fill: { color: C.gold } });
  // icon
  if (icon) {
    slide.addText(icon, { x: x + 0.2, y: y + 0.22, w: 0.5, h: 0.45, fontSize: 18, fontFace: "Segoe UI Emoji" });
  }
  // title
  slide.addText(title, {
    x: x + 0.2, y: icon ? y + 0.7 : y + 0.22,
    w: w - 0.4, h: 0.38,
    fontSize: 12, bold: true, color: C.cream, fontFace: "Calibri",
  });
  // subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: x + 0.2, y: icon ? y + 1.08 : y + 0.58,
      w: w - 0.4, h: 0.28,
      fontSize: 9, color: C.gold, fontFace: "Calibri", charSpacing: 1,
    });
  }
  // body
  if (bodyText) {
    slide.addText(bodyText, {
      x: x + 0.2, y: icon ? y + 1.35 : y + 0.88,
      w: w - 0.4, h: h - (icon ? 1.55 : 1),
      fontSize: 9.5, color: C.stone, fontFace: "Calibri", lineSpacingMultiple: 1.35,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 1 — Cover
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  // Gold decorative rectangle (right side)
  s.addShape(prs.ShapeType.rect, {
    x: 9, y: 0, w: 4.87, h: "100%",
    fill: { color: "100E0B" },
  });
  s.addShape(prs.ShapeType.rect, {
    x: 9, y: 0, w: 0.04, h: "100%",
    fill: { color: C.gold },
  });

  // Monogram / watermark
  s.addText("A", {
    x: 9.4, y: 0.3, w: 4, h: 6.5,
    fontSize: 280, bold: false, color: "1A1710",
    fontFace: "Georgia", align: "center",
  });

  // Eyebrow
  eyebrow(s, "PRÉSENTATION CLIENT", { x: 0.65, y: 1.6 });

  // Main title
  s.addText("Atelier", {
    x: 0.65, y: 2.0, w: 8.1, h: 1.6,
    fontSize: 72, bold: false, color: C.cream,
    fontFace: "Georgia",
  });

  // Subtitle — italic gold
  s.addText("Galerie d'Art", {
    x: 0.65, y: 3.55, w: 8, h: 0.75,
    fontSize: 28, color: C.gold, fontFace: "Georgia", italic: true,
  });

  divider(s, { y: 4.45, w: 2.5 });

  body(s,
    "Plateforme e-commerce de luxe dédiée à l'art décoratif en Tunisie.\n" +
    "Tableaux, œuvres sur toile et peintures d'artistes locaux — livrés partout en Tunisie.",
    { y: 4.6, fontSize: 12, color: C.stone, h: 1.0 }
  );

  // Meta bottom right
  s.addText("Confidentiel · 2026", {
    x: 0, y: 6.7, w: 13.33, h: 0.3,
    fontSize: 7, color: "2A2520", align: "right",
    fontFace: "Calibri", charSpacing: 2,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 2 — Vision & Concept
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  eyebrow(s, "VISION & CONCEPT");
  heading(s, "Une galerie d'art\ndans votre salon.", { h: 1.6 });
  divider(s, { y: 2.55 });

  body(s,
    "Atelier est une plateforme e-commerce de luxe qui connecte les amateurs d'art tunisien avec des œuvres " +
    "d'exception : peintures abstraites, art islamique, aquarelles, art doré à la feuille.\n\n" +
    "L'expérience d'achat est pensée comme une visite de galerie — immersive, élégante, personnalisée.",
    { y: 2.7, fontSize: 12.5, color: C.creamMid, h: 1.8 }
  );

  // Three pillars
  const pillars = [
    { icon: "🎨", title: "Art authentique", desc: "Œuvres d'artistes tunisiens sélectionnées avec soin" },
    { icon: "🚀", title: "Livraison nationale", desc: "24 gouvernorats · tarifs dégressifs · livraison offerte dès 800 TND" },
    { icon: "💬", title: "WhatsApp intégré", desc: "Commande, suivi et conseil via WhatsApp Business" },
  ];
  pillars.forEach((p, i) => {
    card(s, {
      x: 0.65 + i * 4.22, y: 4.7,
      w: 3.9, h: 2.0,
      icon: p.icon,
      title: p.title,
      body: p.desc,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 3 — Features Storefront
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  eyebrow(s, "INTERFACE CLIENT");
  heading(s, "Boutique & Parcours\nd'achat.", { h: 1.6 });
  divider(s, { y: 2.55 });

  const features = [
    { icon: "🏛️", title: "Page d'accueil", desc: "Hero parallaxe cinématique · Collections visuelles · Best-sellers · Témoignages clients · Galerie inspiration intérieure" },
    { icon: "🛒", title: "Boutique avancée", desc: "Filtres multi-critères (collection, prix, orientation, format, style) · Recherche live avec suggestions · Tri dynamique" },
    { icon: "🖼️", title: "Page produit", desc: "Zoom interactif · Vue en situation (room preview) · Personnalisation format & cadre · Calcul de prix en temps réel" },
    { icon: "💳", title: "Paiement", desc: "Checkout optimisé pour la Tunisie · 24 gouvernorats · Paiement à la livraison · Paymee (banque locale) · Code promo" },
    { icon: "❤️", title: "Favoris", desc: "Liste de souhaits persistante · Cœur sur chaque produit · Page /favoris dédiée avec compteur dans le header" },
    { icon: "⭐", title: "Avis clients", desc: "Système de reviews par produit · Note en étoiles · Stocké localement · Formulaire de dépôt d'avis en page produit" },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    card(s, {
      x: 0.65 + col * 4.22, y: 2.9 + row * 2.0,
      w: 3.9, h: 1.85,
      icon: f.icon,
      title: f.title,
      body: f.desc,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 4 — WhatsApp Integration
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);

  // WhatsApp green accent bar
  s.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.09, h: "100%", fill: { color: "25D366" } });

  // Right panel
  s.addShape(prs.ShapeType.rect, { x: 8.8, y: 0, w: 4.53, h: "100%", fill: { color: "060E06" } });
  s.addShape(prs.ShapeType.rect, { x: 8.8, y: 0, w: 0.04, h: "100%", fill: { color: "25D366" } });

  // Big WA icon on right
  s.addText("💬", { x: 9.2, y: 1.5, w: 3.5, h: 3, fontSize: 90, fontFace: "Segoe UI Emoji", align: "center" });
  s.addText("WhatsApp Business", {
    x: 9.2, y: 4.4, w: 3.5, h: 0.4,
    fontSize: 12, color: "25D366", fontFace: "Calibri", align: "center", charSpacing: 1,
  });

  eyebrow(s, "INTÉGRATION WHATSAPP", { x: 0.65, y: 0.5 });
  heading(s, "Vendre & communiquer\nvia WhatsApp.", { x: 0.65, y: 0.85, h: 1.5, fontSize: 30 });
  divider(s, { x: 0.65, y: 2.45, w: 2 });

  const waFeatures = [
    ["Bulle flottante", "Apparaît 2s après l'arrivée sur le site · Lien pré-rempli · Numéro configurable depuis l'admin"],
    ["Commander via WA", "Bouton sur la page checkout · Message structuré avec détail du panier, adresse et total"],
    ["Enquête produit", "Bouton 'Commander via WhatsApp' sur chaque fiche produit · Message avec nom, artiste et prix"],
    ["Notifications admin", "À chaque nouvelle commande → message automatique envoyé au gérant avec résumé complet"],
    ["Suivi de statut", "L'admin notifie le client (confirmé / expédié / livré / annulé) depuis le panneau commande"],
  ];

  waFeatures.forEach(([title, desc], i) => {
    s.addShape(prs.ShapeType.rect, {
      x: 0.65, y: 2.65 + i * 0.88,
      w: 7.9, h: 0.78,
      fill: { color: i % 2 === 0 ? "0D100D" : "0A0D0A" },
      line: { color: "152010", width: 0.5 },
    });
    s.addShape(prs.ShapeType.rect, {
      x: 0.65, y: 2.65 + i * 0.88,
      w: 0.06, h: 0.78,
      fill: { color: "25D366" },
    });
    s.addText(title, {
      x: 0.85, y: 2.72 + i * 0.88, w: 2.2, h: 0.32,
      fontSize: 10, bold: true, color: "A0C0A0", fontFace: "Calibri",
    });
    s.addText(desc, {
      x: 3.1, y: 2.7 + i * 0.88, w: 5.4, h: 0.55,
      fontSize: 9, color: C.stone, fontFace: "Calibri", lineSpacingMultiple: 1.3,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 5 — Admin Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  eyebrow(s, "ESPACE ADMINISTRATION");
  heading(s, "Tableau de bord\ncomplet.", { h: 1.6 });
  divider(s, { y: 2.55 });

  const adminModules = [
    { icon: "📊", title: "Analytique", desc: "KPIs : CA, commandes, clients · Graphique CA 7 jours · Top collections · Commandes récentes" },
    { icon: "📦", title: "Produits", desc: "CRUD complet · Upload photo (Supabase Storage) · Prix, format, stock · Badges best-seller / nouveau" },
    { icon: "🗂️", title: "Commandes", desc: "Workflow de statut · Détail client · Filtres · Recherche · Lien vers WhatsApp client" },
    { icon: "🏷️", title: "Codes Promo", desc: "Création de codes · Remise en % · Activation / désactivation · Suppression · Codes prédéfinis" },
    { icon: "📋", title: "Factures", desc: "Numérotation FACT-YYYY-NNNN · Génération HTML · Téléchargement · Données entreprise sur facture" },
    { icon: "⚙️", title: "Paramètres", desc: "Infos entreprise · Numéro WhatsApp Business · Matricule fiscal · Registre de commerce" },
  ];

  adminModules.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    card(s, {
      x: 0.65 + col * 4.22, y: 2.9 + row * 2.0,
      w: 3.9, h: 1.85,
      icon: m.icon,
      title: m.title,
      body: m.desc,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 6 — Technical Stack
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  eyebrow(s, "ARCHITECTURE TECHNIQUE");
  heading(s, "Stack moderne &\nperformant.", { h: 1.6 });
  divider(s, { y: 2.55 });

  const stack = [
    { cat: "Frontend",   items: ["React 18 · Vite", "Tailwind CSS v4", "react-router (Data mode)", "Motion (Framer Motion v11)"] },
    { cat: "État & Data", items: ["localStorage (persistance)", "React Context API", "Supabase Storage (images)", "Supabase Auth (admin)"] },
    { cat: "UI & Design", items: ["Playfair Display + Lato", "shadcn/ui + Radix UI", "Recharts (graphiques)", "Sonner (toasts)"] },
    { cat: "Intégrations", items: ["WhatsApp Business (wa.me)", "Paymee (carte bancaire TN)", "Resend (emails, prêt)", "24 gouvernorats tunisiens"] },
  ];

  stack.forEach((col, i) => {
    const x = 0.65 + i * 3.17;
    s.addShape(prs.ShapeType.rect, {
      x, y: 2.9, w: 2.9, h: 3.65,
      fill: { color: "0D0B09" },
      line: { color: "2A2520", width: 0.5 },
    });
    s.addShape(prs.ShapeType.rect, { x, y: 2.9, w: 2.9, h: 0.045, fill: { color: C.gold } });

    s.addText(col.cat.toUpperCase(), {
      x: x + 0.18, y: 3.02, w: 2.55, h: 0.28,
      fontSize: 7, bold: true, color: C.gold, fontFace: "Calibri", charSpacing: 2,
    });

    col.items.forEach((item, j) => {
      s.addShape(prs.ShapeType.rect, {
        x: x + 0.18, y: 3.42 + j * 0.68,
        w: 0.05, h: 0.24,
        fill: { color: C.goldLight },
      });
      s.addText(item, {
        x: x + 0.3, y: 3.4 + j * 0.68, w: 2.4, h: 0.3,
        fontSize: 9.5, color: C.creamMid, fontFace: "Calibri",
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 7 — Tunisia Specifics
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  eyebrow(s, "ADAPTATION LOCALE");
  heading(s, "Optimisé pour\nle marché tunisien.", { h: 1.6 });
  divider(s, { y: 2.55 });

  const items = [
    ["🗺️", "24 gouvernorats", "Couverture nationale complète avec frais de livraison individualisés et délais estimés par région"],
    ["💰", "Devise TND", "Tous les prix affichés en dinars tunisiens · Format local (ex : 450,000 TND)"],
    ["📞", "Numéro local", "Intégration WhatsApp avec numéro tunisien configurable depuis l'interface admin"],
    ["🕐", "Heure de Tunis", "Timestamps commandes en heure tunisienne (UTC+1) · Format Jour/Mois/Année"],
    ["🚚", "Livraison offerte", "Seuil de livraison gratuite configurable (par défaut 800 TND)"],
    ["🧾", "Fiscalité locale", "Factures avec matricule fiscal et registre de commerce · Format FACT-YYYY-NNNN"],
  ];

  items.forEach(([icon, title, desc], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.65 + col * 6.35;
    const y = 2.9 + row * 1.42;

    s.addShape(prs.ShapeType.rect, {
      x, y, w: 6.05, h: 1.28,
      fill: { color: "0D0B09" },
      line: { color: "2A2520", width: 0.5 },
    });
    s.addText(icon, { x: x + 0.18, y: y + 0.22, w: 0.55, h: 0.55, fontSize: 18, fontFace: "Segoe UI Emoji" });
    s.addText(title, {
      x: x + 0.75, y: y + 0.2, w: 5, h: 0.32,
      fontSize: 11, bold: true, color: C.cream, fontFace: "Calibri",
    });
    s.addText(desc, {
      x: x + 0.75, y: y + 0.52, w: 5.1, h: 0.65,
      fontSize: 9, color: C.stone, fontFace: "Calibri", lineSpacingMultiple: 1.3,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 8 — Product Catalogue Features
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  eyebrow(s, "CATALOGUE PRODUITS");
  heading(s, "Gestion d'œuvres\nd'art avancée.", { h: 1.6 });
  divider(s, { y: 2.55 });

  body(s,
    "Chaque œuvre est une entité riche : titre, artiste, collection, description, style, orientation, " +
    "dimensions, cadres disponibles, niveau de stock, badges et note client.",
    { y: 2.65, fontSize: 11.5, color: C.creamMid, h: 0.8 }
  );

  const attrs = [
    ["Format", "4 tailles (30×40 · 50×70 · 60×80 · 80×100 cm)"],
    ["Cadres", "3 finitions (naturel, blanc, noir) avec majoration de prix"],
    ["Orientation", "Portrait · Paysage · Carré"],
    ["Collections", "Art islamique · Abstrait · Doré · Aquarelle · Nature"],
    ["Filtres shop", "Prix · Style · Format · Orientation · En stock"],
    ["Vue chambre", "Room preview pour visualiser l'œuvre en situation"],
    ["Zoom produit", "Zoom interactif sur survol de la photo principale"],
    ["Favoris", "Cœur persistant · Page liste personnelle"],
  ];

  attrs.forEach(([label, val], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.65 + col * 6.35;
    const y = 3.6 + row * 0.75;

    s.addShape(prs.ShapeType.rect, { x, y, w: 6.05, h: 0.65, fill: { color: i % 2 === 0 ? "0D0B09" : "0A0907" } });
    s.addShape(prs.ShapeType.rect, { x, y, w: 0.05, h: 0.65, fill: { color: C.gold } });
    s.addText(label, {
      x: x + 0.2, y: y + 0.16, w: 1.8, h: 0.32,
      fontSize: 9, bold: true, color: C.gold, fontFace: "Calibri",
    });
    s.addText(val, {
      x: x + 2.1, y: y + 0.16, w: 3.8, h: 0.32,
      fontSize: 9, color: C.stone, fontFace: "Calibri",
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 9 — Security & Auth
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  eyebrow(s, "SÉCURITÉ & ACCÈS");
  heading(s, "Administration\nsécurisée.", { h: 1.6 });
  divider(s, { y: 2.55 });

  const secItems = [
    { icon: "🔐", title: "Authentification double", desc: "Compte admin par défaut intégré (email + mot de passe) · Supabase Auth en option pour comptes supplémentaires" },
    { icon: "🛡️", title: "Protection des routes", desc: "Toutes les routes /admin/* sont protégées · Redirection automatique vers la page de connexion si non authentifié" },
    { icon: "💾", title: "Persistance locale", desc: "Données stockées en localStorage avec clé préfixée atelier: · Aucune dépendance réseau pour le fonctionnement de base" },
    { icon: "☁️", title: "Storage sécurisé", desc: "Photos produits hébergées sur Supabase Storage · URLs publiques signées · Aucune donnée client sur le cloud" },
  ];

  secItems.forEach((item, i) => {
    const y = 2.9 + i * 1.05;
    s.addShape(prs.ShapeType.rect, {
      x: 0.65, y, w: 12.03, h: 0.9,
      fill: { color: i % 2 === 0 ? "0D0B09" : "0A0907" },
      line: { color: "1E1A13", width: 0.5 },
    });
    s.addShape(prs.ShapeType.rect, { x: 0.65, y, w: 0.06, h: 0.9, fill: { color: C.gold } });
    s.addText(item.icon, { x: 0.85, y: y + 0.2, w: 0.55, h: 0.55, fontSize: 16, fontFace: "Segoe UI Emoji" });
    s.addText(item.title, {
      x: 1.55, y: y + 0.15, w: 3.5, h: 0.3,
      fontSize: 11, bold: true, color: C.cream, fontFace: "Calibri",
    });
    s.addText(item.desc, {
      x: 5.1, y: y + 0.13, w: 7.3, h: 0.65,
      fontSize: 9.5, color: C.stone, fontFace: "Calibri", lineSpacingMultiple: 1.3,
    });
  });

  // Credentials box
  s.addShape(prs.ShapeType.rect, {
    x: 0.65, y: 7.05, w: 12.03, h: 0.5,
    fill: { color: "1A150E" },
    line: { color: "2A1E10", width: 0.5 },
  });
  s.addText("Accès admin par défaut : admin@atelier.tn · Atelier2024!", {
    x: 0.9, y: 7.12, w: 11.5, h: 0.3,
    fontSize: 9.5, color: C.gold, fontFace: "Courier New", bold: true,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SLIDE 10 — Thank You / Contact
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  darkBg(s);
  accentBar(s);

  // Right gold panel
  s.addShape(prs.ShapeType.rect, { x: 9.5, y: 0, w: 3.83, h: "100%", fill: { color: "100D09" } });
  s.addShape(prs.ShapeType.rect, { x: 9.5, y: 0, w: 0.04, h: "100%", fill: { color: C.gold } });
  s.addText("A", {
    x: 9.8, y: 0.5, w: 3.3, h: 6.2,
    fontSize: 240, color: "1A1610", fontFace: "Georgia", align: "center",
  });

  eyebrow(s, "MERCI");

  s.addText("Atelier", {
    x: 0.65, y: 1.1, w: 8, h: 1.4,
    fontSize: 64, color: C.cream, fontFace: "Georgia",
  });
  s.addText("Galerie d'Art · Tunisie", {
    x: 0.65, y: 2.45, w: 8, h: 0.55,
    fontSize: 18, color: C.gold, fontFace: "Georgia", italic: true,
  });

  divider(s, { y: 3.15, w: 3 });

  const contacts = [
    ["🌐", "atelier.tn"],
    ["📧", "contact@atelier.tn"],
    ["📱", "+216 00 000 000"],
    ["📍", "Rue de la Kasbah, 1006 Tunis"],
  ];

  contacts.forEach(([icon, text], i) => {
    s.addText(icon + "  " + text, {
      x: 0.65, y: 3.45 + i * 0.62, w: 8, h: 0.48,
      fontSize: 11, color: C.stone, fontFace: "Calibri",
    });
  });

  s.addText("Confidentiel — Usage interne uniquement", {
    x: 0, y: 6.75, w: 9.3, h: 0.25,
    fontSize: 6.5, color: "2A2520", fontFace: "Calibri", charSpacing: 1.5,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Write file
// ═══════════════════════════════════════════════════════════════════════════════
const outPath = "/workspaces/default/code/Atelier-Presentation.pptx";
await prs.writeFile({ fileName: outPath });
console.log(`✓ Presentation saved: ${outPath}`);
