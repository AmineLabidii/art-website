# Plan — "Atelier" · Premium Tunisian Art Gallery Storefront

## Context
The brief (`src/imports/pasted_text/ecommerce-platform-plan.md`) asks for a production-ready luxury ecommerce platform selling decorative paintings & wall art in Tunisia. It specifies Next.js/Supabase/Three.js, but this environment is a **React + Vite + Tailwind v4 SPA** with `react-router` already installed. We adapt accordingly.

**Decisions (from user):**
- **Frontend first**, realistic mock data. Supabase deferred to a later pass.
- **Cinematic motion & parallax** using the installed `motion` library — no heavy Three.js.
- Build the **full customer-facing storefront** now; admin dashboard + Supabase later.

**Goal:** A memorable, elegant, fast storefront that feels like a digital luxury art gallery — French default, TND currency, WhatsApp ordering, Cash-on-Delivery + Tunisia-specific checkout. Handcrafted look, strong editorial typography, no generic "AI template" feel.

## Design System
- Fonts: **Cormorant Garamond** / **Playfair Display** (display headings) + **Manrope**/**Inter** (body) — imported only in `src/styles/fonts.css`.
- Palette (warm gallery): warm white `#F7F4EF`, soft black `#1A1714`, beige `#E8DFD3`, gold accent `#B8925A`, muted stone. Define once as CSS tokens in `src/styles/theme.css` (add gallery tokens; do not break existing shadcn tokens).
- Reuse existing shadcn UI primitives in `src/app/components/ui/*` (button, sheet/drawer for cart, dialog, select, slider, tabs, badge, accordion, sonner). No new UI kit.
- Images via `src/app/components/figma/ImageWithFallback.tsx`; source real artwork/interior photos with the Unsplash tool, imported as ES modules where static.

## Architecture
- Routing with `react-router` (`createBrowserRouter` / `RouterProvider`) in `src/app/App.tsx`.
- Global state via React Context: **CartContext** (persisted to `localStorage`), and light **LanguageContext** scaffold (French default, structure ready for AR/EN).
- Mock data module `src/app/data/` — products, collections, governorates, delivery fees, reviews. Typed with TypeScript interfaces.

### Files to create
- `src/app/App.tsx` (rewrite) — router + providers + layout shell.
- `src/app/data/products.ts`, `collections.ts`, `tunisia.ts` (governorates + delivery fees), `reviews.ts`, `types.ts`.
- `src/app/context/CartContext.tsx`, `src/app/context/LanguageContext.tsx`.
- `src/app/lib/format.ts` (TND formatting, French labels), `src/app/lib/whatsapp.ts` (order → wa.me message).
- Layout: `components/layout/Header.tsx` (transparent→solid on scroll, cart badge, nav), `Footer.tsx`, `CartDrawer.tsx` (sheet-based, animated).
- Pages under `components/pages/`:
  - `Home.tsx` — cinematic hero (parallax + motion entrance), Collections (immersive asymmetric layout), Featured Products, Interior Inspiration (artwork in rooms), Reviews, Masonry gallery, brand story.
  - `Shop.tsx` — search w/ live suggestions, filters (category, price slider, size, orientation, style, availability), sorting; responsive grid with hover quick-view.
  - `Product.tsx` — large gallery + image zoom, thumbnails, faux "room preview" toggle, description/dimensions/materials/frame options, stock, reviews, Add to cart / Buy now / **Order via WhatsApp**, related products.
  - `Checkout.tsx` — Tunisia form (name, phone, email optional, governorate select, city, address, postal code, notes), COD vs online (sandbox mock), delivery fee by governorate, order summary, confirmation screen.
  - `Collections.tsx`, `About.tsx`, `NotFound.tsx`.
- Reusable: `components/product/ProductCard.tsx`, `QuickView.tsx`, `SectionHeading.tsx`, motion helpers `components/motion/Reveal.tsx`.

## Motion & Craft
- `motion/react` for scroll reveals, parallax hero layers, staggered grids, cart drawer, page transitions. Respect `prefers-reduced-motion`.
- Editorial spacing, oversized serif headings, thin gold rules, generous whitespace — deliberately avoid uniform rounded cards / random gradients / glassmorphism.

## Tunisian features (this pass)
- TND formatting, 24 governorates with per-governorate delivery fees, Cash on Delivery, WhatsApp order message generation, French copy throughout.

## Deferred (future passes, noted for handover)
- Supabase (auth, products, orders, invoices, storage), admin dashboard, invoice PDF generation, real payment gateways (Paymee/Konnect), SEO meta/sitemap, multi-language AR/EN.

## Verification
- Dev server is already running — use the preview surface (not localhost).
- Manually walk: Home scroll/animations → Shop filter+search+sort → open Product → zoom, select frame/size → Add to cart → Cart drawer edit qty → Checkout (select governorate, see delivery fee, place COD order → confirmation) → WhatsApp order opens prefilled `wa.me` link.
- Check responsive at mobile width (touch-friendly nav, drawer) and reduced-motion.
- No console errors; cart persists across reload.
