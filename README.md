# TableFlow

Real-time floor, order and kitchen management for restaurants. A server opens a table, sends the order to the kitchen, the kitchen marks items ready as they come off the line, and every screen in the building updates the instant it happens — no polling, no refresh.

[Leia em português](./README.pt-BR.md)

## Why this exists

Most restaurant-management portfolio pieces stop at a CRUD menu editor. TableFlow instead models the actual operational loop a restaurant runs on: a table moves through `available → occupied → cleaning`, an order moves through `pending → preparing → ready → served → paid`, and those two state machines are coupled (paying an order frees the table, cancelling one does too). That coupling, plus the real-time fan-out to three different roles watching three different screens, is the part worth reading the code for.

## Architecture

```
apps/
  web/   Next.js 16 (App Router, TypeScript, Tailwind) — floor view, kitchen display, manager dashboard
  api/   Node/Express (TypeScript) — REST API + Socket.IO, Prisma ORM, PostgreSQL
```

The API is organized by feature module (`auth`, `tables`, `menu`, `orders`, `analytics`), each with its own schema (Zod), service (business rules) and route layer. Domain rules that don't belong to any single module — the order status state machine, typed domain errors — live under `src/domain`. Nothing in `domain` or a `service` imports Express; only route handlers know they're running inside an HTTP server.

```
src/
  domain/          state machine + typed errors, framework-free
  modules/<name>/  <name>.schema.ts   Zod input validation
                   <name>.service.ts  business logic, talks to Prisma
                   <name>.repository.ts (where a module needs one)
                   <name>.routes.ts   Express router, thin controllers
  middlewares/     auth, role guards, rate limiting, centralized error handling
  realtime/        Socket.IO broadcast, decoupled from any single route
```

## Real-time model

The API is the only source of truth. Every mutation (create order, change status, mark an item ready) goes through the same path: validate → apply the state-machine rule → write to Postgres → broadcast a Socket.IO event. The frontend never mutates local state optimistically for shared data — it listens for `table:updated` / `order:updated` and invalidates its React Query cache, so a payment rung in on one tablet is reflected on the kitchen screen and the manager's dashboard within the same round trip.

## Security

- Passwords hashed with bcrypt (cost factor 12), sessions are JWTs in `httpOnly`, `sameSite=lax` cookies — never exposed to client-side JavaScript.
- Every route is authenticated by default; role checks (`SERVER` / `KITCHEN` / `MANAGER`) are enforced server-side per endpoint, not just hidden in the UI.
- All input is validated with Zod at the boundary; Prisma parameterizes every query, so there is no hand-built SQL to inject.
- Rate limiting on `/auth/login` (brute-force protection) and on the API as a whole.
- `helmet` for security headers, strict CORS locked to the configured web origin.
- No secret ever lives in source control — see [Configuration](#configuration).

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL 14+ instance (local or hosted)

### 1. Configure the API

```bash
cd apps/api
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random string, 32+ characters (`openssl rand -hex 32`) |
| `WEB_ORIGIN` | URL of the frontend, for CORS (`http://localhost:3000` in dev) |

```bash
npm install
npm run prisma:migrate   # creates the schema
npm run prisma:seed      # demo staff, tables and menu
npm run dev              # http://localhost:4000
```

Demo accounts created by the seed (password `Passw0rd!123` for all):

| Role | Email |
| --- | --- |
| Manager | `manager@tableflow.dev` |
| Server | `server@tableflow.dev` |
| Kitchen | `kitchen@tableflow.dev` |

### 2. Configure the web app

```bash
cd apps/web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev                        # http://localhost:3000
```

## Testing

```bash
cd apps/api
npm test        # order state machine unit tests (Vitest)
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · TanStack Query · Node.js · Express · Socket.IO · Prisma · PostgreSQL · Zod · Vitest
