# Babytuna Systems — Inventory Dashboard

Web dashboard for managing restaurant inventory, suppliers, and ordering workflows.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS v4, Shadcn/Radix UI
- **State:** React Query, React Hook Form, Zod
- **Data:** TanStack Table, Recharts
- **Backend:** Supabase (Auth, Postgres + RLS, Edge Functions)
- **Auth:** Supabase Auth with organization memberships (multi-tenancy)

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm 10+
- Supabase CLI (for local Edge Functions and migrations)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd InventoryDashboard
npm install

# Configure environment
cp .env.example .env.local
# Fill in your Supabase and Square credentials

# Start development server
npm run dev
```

### Scripts

| Script                  | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | Start Next.js dev server                           |
| `npm run build`         | Production build                                   |
| `npm run lint`          | Run ESLint                                         |
| `npm run typecheck`     | TypeScript type checking                           |
| `npm run test`          | Run Vitest tests                                   |
| `npm run test:watch`    | Watch mode tests                                   |
| `npm run test:coverage` | Tests with coverage                                |
| `npm run format`        | Check formatting                                   |
| `npm run format:write`  | Fix formatting                                     |
| `npm run ci`            | Full CI pipeline (typecheck + lint + test + build) |
| `npm run clean`         | Remove build artifacts                             |

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login/signup routes
│   ├── (dashboard)/        # Auth-gated dashboard routes
│   ├── (marketing)/        # Public landing page
│   ├── api/                # API routes (Square OAuth callback)
│   └── onboarding/         # New user onboarding flow
├── components/
│   ├── dashboard/          # Feature components (inventory, suppliers, overview)
│   ├── layout/             # Shell, sidebar, breadcrumbs, nav
│   ├── marketing/          # Landing page components
│   ├── onboarding/         # Onboarding wizard
│   ├── providers/          # React context providers
│   └── ui/                 # Shadcn/Radix primitives
├── config/                 # Navigation, external links, constants
├── hooks/                  # Shared React hooks
├── lib/                    # Shared utilities, API client, Supabase helpers
│   ├── security/           # OAuth state, redirect validation
│   └── supabase/           # Supabase client/server/middleware helpers
└── types/                  # Generated database types
```

## Data Model

- **Organizations** — multi-tenant isolation
- **org_memberships** — user-to-org role bindings
- **inventory_items** — ingredient catalog
- **suppliers** — vendor directory
- **square_connections** — Square POS integration tokens
- **oauth_states** — Secure OAuth CSRF/replay protection

All dashboard data is org-scoped via RLS policies.

## Source of Truth Direction

> **Current state:**
>
> - Google Sheets can still sync catalog data into Supabase via Apps Script.
> - Supabase is the future source of truth.
> - The web dashboard is being prepared to replace Sheets as the manager editing layer.
> - Sheets should remain as an import/export fallback during the transition.

## Security

- **Auth:** Supabase Auth with cookie-based sessions
- **Authorization:** Organization memberships + RLS policies
- **OAuth:** Square OAuth state is cryptographically bound to user sessions
- **Headers:** HSTS, CSP, X-Frame-Options, Referrer-Policy configured
- **Secrets:** Service-role key is never exposed to client code

## Contributing

1. Create a feature branch from `main`
2. Pre-commit hooks run lint-staged automatically
3. Run `npm run ci` before pushing
4. Submit a PR — CI will verify typecheck, lint, test, and build
