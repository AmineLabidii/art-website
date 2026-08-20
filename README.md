# Art Website

An art gallery e-commerce platform for a Tunisian art house â€” curated collections, secure checkout, and a full admin suite. Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase**.

## Features

### Storefront
- Curated collections: Art Abstrait, Art Moderne, Collection Luxe, Collection Nature
- Shop with product filtering and quick view
- Product pages with reviews and ratings
- Wishlist and cart drawer
- Checkout with cash-on-delivery and order tracking (My Orders)
- Order confirmation and invoice generation
- WhatsApp ordering and personalized advice
- Home sections: Hero, Brand Story, Featured Products, Collections Showcase, Gallery, Testimonials, Interior Inspiration

### Admin Panel
- Dashboard with sales analytics
- Product, inventory, order, invoice, and customer management
- Promotions management
- Admin settings
- Protected admin routes with login

### Delivery
- Secure packaging and tracking across all 24 Tunisian governorates
- Cash-on-delivery payment

## Tech Stack

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite 6](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + Radix UI
- [MUI](https://mui.com) and [Motion](https://motion.dev) for animations
- [Supabase](https://supabase.com) for backend and server functions
- [Recharts](https://recharts.org) for admin charts

## Getting Started

```bash
# Install dependencies (pnpm workspace)
pnpm install

# Start the dev server
pnpm dev

# Build for production
pnpm build
```

> Note: The project uses a pnpm workspace (see `pnpm-workspace.yaml`).

## Project Structure

```
src/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ admin/        # Admin dashboard, orders, products, invoices...
â”‚   â”‚   â”œâ”€â”€ home/         # Hero, BrandStory, FeaturedProducts, Testimonials...
â”‚   â”‚   â”œâ”€â”€ layout/       # Header, Footer, CartDrawer, Layout
â”‚   â”‚   â”œâ”€â”€ pages/        # Home, Shop, Collections, Checkout, MyOrders...
â”‚   â”‚   â”œâ”€â”€ product/      # ProductCard, QuickView
â”‚   â”‚   â”œâ”€â”€ shared/       # SectionHeading, StarRating, WhatsAppIcon
â”‚   â”‚   â””â”€â”€ ui/           # shadcn/ui components
â”‚   â”œâ”€â”€ context/          # Admin, Cart, Wishlist contexts
â”‚   â”œâ”€â”€ data/             # Products, collections, orders, reviews
â”‚   â””â”€â”€ lib/              # API, Supabase, invoice, WhatsApp helpers
â”œâ”€â”€ styles/               # Tailwind, theme, and global styles
â””â”€â”€ main.tsx              # Entry point
```

## Environment

Backend services require Supabase. See `src/app/lib/supabase.ts` and the `supabase/functions/` directory for configuration details.

## Related

- `guidelines/` â€” AI project guidelines
- `plans/` â€” project plans and specs
- `ATTRIBUTIONS.md` â€” asset attributions
