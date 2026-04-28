# MagnifiScent — Dev Setup

Clone the repo and start developing in 3 commands, on any machine or AI platform.

## Quick Start

```bash
git clone https://github.com/sarimnaeem2010/Magnifiscent.git
cd Magnifiscent
pnpm install
```

Then start the API server:

```bash
# Terminal 1 — API server (port 3000)
cd artifacts/api-server
pnpm run dev
```

The server will start on `http://localhost:3000` with automatic database seeding.

## Project Structure

```
Magnifiscent/
├── artifacts/              # Built applications
│   ├── api-server/        # Express API server (TypeScript)
│   └── magnifiscent/      # Additional artifact
├── lib/                    # Shared libraries
│   ├── db/                # Drizzle ORM database layer
│   ├── api-client-react/  # React API client
│   ├── api-zod/           # Zod validation schemas
│   └── integrations/      # Third-party integrations
├── scripts/               # Utility TypeScript scripts
├── pnpm-workspace.yaml    # Workspace configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Root package.json
```

## What's Already Wired In

| Component | Location |
|---|---|
| Neon PostgreSQL | `artifacts/api-server/.env` + `lib/db/.env` |
| Admin secret | `artifacts/api-server/.env` |
| SMTP config | `artifacts/api-server/data/email-config.json` |
| Logger | `artifacts/api-server/src/lib/logger.ts` |
| Database seeding | Auto-runs on server start |

No reconnecting databases. No re-entering secrets. Just pull and run.

## Requirements

- **Node.js**: v18 or higher
- **pnpm**: Latest version (`npm install -g pnpm`)

## Available Commands

### Root Level
```bash
pnpm install              # Install all dependencies
pnpm start                # Start Express server
pnpm build                # Uses pre-built dist files
pnpm db:push              # Push database migrations
pnpm typecheck:libs       # Type check library packages
pnpm typecheck            # Full type check across all workspaces
```

### API Server (artifacts/api-server)
```bash
pnpm run dev              # Development mode (builds + starts on port 3000)
pnpm run build            # Build with esbuild
pnpm run start            # Start the built server
pnpm run typecheck        # Type check API server
```

### Scripts (scripts)
```bash
pnpm run hello            # Example hello script
pnpm run typecheck        # Type check scripts
```

## Live Data

The database is hosted on **Neon** (cloud PostgreSQL) — it's the same DB used by the production site at `magnifiscent.com.pk`. Any orders, products, or settings you see in dev are live data.

## Database (Drizzle ORM)

### Push Schema Changes to Neon
```bash
cd lib/db && npx drizzle-kit push
```

### Open Drizzle Studio (DB Browser)
```bash
cd lib/db && npx drizzle-kit studio
```

### View Database Logs
Database seeding happens automatically on server start. Check console output for details.

## VS Code Setup (Recommended)

### Extensions
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **TypeScript Vue Plugin** (for TypeScript support)

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Troubleshooting

### `pnpm` command not found
```bash
npm install -g pnpm
```

### Port 3000 already in use
```bash
export PORT=3001
cd artifacts/api-server && pnpm run dev
```

### Type errors after changes
```bash
pnpm install
pnpm run build
pnpm run typecheck
```

### Module not found errors
```bash
pnpm install
pnpm run typecheck:libs
```

## Development Workflow

1. **Start the dev server**:
   ```bash
   cd artifacts/api-server
   pnpm run dev
   ```

2. **Make changes** to source files in `src/` directories

3. **TypeScript will auto-compile** via the dev server

4. **Check for type errors**:
   ```bash
   pnpm run typecheck
   ```

5. **Format code** (auto-saves with Prettier):
   ```bash
   pnpm exec prettier --write src/
   ```

## Production Build

```bash
cd artifacts/api-server
pnpm run build
pnpm run start
```

Built output will be in `dist/` directory. Upload to Hostinger as normal.

## Tech Stack

- **Runtime**: Node.js v18+
- **Package Manager**: pnpm
- **Language**: TypeScript ~5.9.2
- **API**: Express.js v5
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Validation**: Zod
- **Logging**: Pino
- **Email**: Nodemailer
- **Build**: esbuild v0.27.3
- **Formatting**: Prettier v3.8.1

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Zod Documentation](https://zod.dev/)
