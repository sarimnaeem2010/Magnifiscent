# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/magnifiscent` (`@workspace/magnifiscent`)

MagnifiScent perfume e-commerce storefront (React + Vite + Tailwind) with full Shopify-style admin panel.

**Storefront** at `/`:
- Home, Products, Product Detail, Deals/Combos, About, Contact, Checkout
- Policy pages: Returns (`/returns`), Shipping (`/shipping`), Privacy (`/privacy`), Terms (`/terms`)
- Cart via `CartContext`, cart drawer, `Rs.` currency throughout
- Maintenance overlay: when admin enables maintenance mode, storefront shows a full-page "Coming back soon" page; /admin is always accessible
- SEO: page title/meta description/OG image set from admin settings on mount
- Analytics: GA4 and Facebook Pixel script tags injected when IDs are set in admin

**Admin Panel** at `/admin` (password: `admin123`):
- Dashboard, Products, Orders, Customers, Inventory, Deals, Media, Instagram, Pages, Email, Settings
- All data persisted via PostgreSQL-backed REST API (`artifacts/api-server`)
- `AdminContext.tsx` — products, orders, deals, settings state; syncs to API on every change
- `liveData.ts` — types and static default constants only; no localStorage usage

**Data Flow** (all pages use API as source of truth — no localStorage for store data):
- All storefront pages (`Home`, `Products`, `ProductDetail`, `Deals`) fetch from API on mount
- `Header.tsx` fetches ticker messages from API with static fallback
- `AdminContext.tsx` loads products/orders/deals/settings from API on login
- `AdminEmail.tsx` loads SMTP config from API; saves via `api.emailConfig.put()`
- `Checkout.tsx` creates orders via `api.orders.create()` and sends emails via `api.sendEmail.orderConfirmation()`

**API Server** (`artifacts/api-server`, port 8080):
- Auth: `POST /api/admin/login` → JWT-like token stored in `sessionStorage`
- Products: `GET /products`, `GET /products?all=true` (admin), `POST /products` (admin), `PATCH /products/:id` (admin), `DELETE /products/:id` (admin)
- Orders, Deals, Settings, Content endpoints all behind admin Bearer token auth
- Email config: `GET /api/email-config`, `PUT /api/email-config`

**Environment Variables** (`artifacts/magnifiscent/.env.example`):
- `VITE_API_BASE_URL` — base URL for API (default: `/api` via Vite proxy to port 8080)

**Admin Settings** (`/admin/settings`) sections:
- Store Information, Social Links, Admin Password, Payment Methods, Announcement Ticker
- SEO & Meta Tags, Shipping Settings (flat rate + free shipping threshold + carrier), Tax Settings (rate + show in cart)
- Discount Codes (code list with %-off or Rs.-off, expiry, active toggle)
- Analytics & Tracking (GA4 ID, Facebook Pixel ID)
- Maintenance Mode (toggle + custom message)
- Data Backup (full JSON export/import)

**Admin Email** (`/admin/email`) — 4-tab panel:
- SMTP Config: host/port/TLS, auth (username/password), sender identity, test email sender
- Notifications: toggles for each email type (customer + admin alerts)
- Templates: editable HTML templates for all 7 email types
- Email Log: in-memory send history with status (sent/failed/pending)

**Checkout** (`/checkout`):
- Dynamic shipping rate from API extended settings (default Rs. 200)
- Free shipping threshold from API store settings
- Tax line shown when `showTaxInCart` and `taxRate > 0`
- Discount code field — validates via `api.discountCodes.apply()`, shows green badge on success
- COD and Card payment methods (at least one always active)

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
