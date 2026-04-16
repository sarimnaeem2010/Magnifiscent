# MagnifiScent — Dev Setup

Clone the repo and start developing in 3 commands, on any machine or AI platform.

## Quick Start

```bash
git clone https://github.com/sarimnaeem2010/Magnifiscent.git
cd Magnifiscent
pnpm install
```

Then start both servers:

```bash
# Terminal 1 — API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 5173)
pnpm --filter @workspace/magnifiscent run dev
```

Open `http://localhost:5173` in your browser.
Admin panel: `http://localhost:5173/admin` — password: `admin123`

## What's Already Wired In

| Credential | Where |
|---|---|
| Neon PostgreSQL | `artifacts/api-server/.env` + `lib/db/.env` |
| Admin secret | `artifacts/api-server/.env` |
| SMTP config | `artifacts/api-server/data/email-config.json` |

No reconnecting databases. No re-entering secrets. Just pull and run.

## Live Data

The database is hosted on **Neon** (cloud PostgreSQL) — it's the same DB used by the production site at `magnifiscent.com.pk`. Any orders, products, or settings you see in dev are live data.

## Drizzle (DB Migrations)

```bash
# Push schema changes to Neon
cd lib/db && npx drizzle-kit push

# Open Drizzle Studio (DB browser)
cd lib/db && npx drizzle-kit studio
```

## Production Build

```bash
pnpm --filter @workspace/magnifiscent run build
pnpm --filter @workspace/api-server run build
```

Upload the built files to Hostinger as normal.
