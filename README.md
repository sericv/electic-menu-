# القائمة الرقمية — Digital Menu

A premium, Arabic-first electronic menu system for cafes and restaurants, built with React, TypeScript, Tailwind CSS, Framer Motion, and Firebase. Fully RTL.

## Pages

- **Customer Menu** (`/`) — A bright, single-scroll product feed with category filters, featured items, smooth Framer Motion animations, and gentle auto-scroll that pauses on interaction. Store name, description, and logo are pulled live from Firestore.
- **Admin / Cashier Dashboard** (`/admin`) — A minimal CRUD interface with three sections: إعدادات المتجر (store settings), الفئات (categories), and المنتجات (products).

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (CSS-first `@theme` config in `src/index.css`)
- Framer Motion
- React Router
- Firebase (Auth + Firestore)

## Getting Started

```bash
npm install
npm run dev
```

Firebase credentials are configured directly in `src/lib/firebase/config.ts` (project `coffee-loyalty-11dfc`). The system starts completely empty — use `/admin` to create the store profile, categories, and products.

### Firestore Collections

- `settings/store` — `{ name: string, description: string, logoUrl: string }`
- `categories` — `{ name: string, order: number }`
- `products` — `{ name, description, price, categoryId, imageUrl, featured, order }`

### Images

There is no Firebase Storage dependency. Product photos and the store logo are processed client-side by `src/lib/imageProcessing.ts`, which resizes large images, converts them to WebP, and compresses them to fit comfortably inside a Firestore document. The result is stored directly as a Base64 data URL in the `imageUrl` / `logoUrl` fields.

### Admin Access

`/admin` requires Firebase Authentication (Email/Password). Create a staff user in the Firebase console to sign in.

## Project Structure

```
src/
├── components/
│   ├── menu/        # Customer menu UI (header, filters, cards, feed)
│   └── admin/        # Dashboard UI (managers, modals, forms, settings)
├── context/          # MenuDataContext, StoreSettingsContext
├── hooks/            # useAutoScroll, useAuth, useMenuData, useStoreSettings
├── lib/
│   ├── firebase/     # Firebase config + service layer
│   └── imageProcessing.ts  # Base64 image resize/compress utility
├── pages/            # CustomerMenu, AdminDashboard
└── types/            # Shared TypeScript types
```
