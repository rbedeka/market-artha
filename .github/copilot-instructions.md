# Copilot / AI Agent Instructions — market-artha

Follow these short, concrete rules to be productive in this repository.

## High-level architecture (what touches what)

- Monorepo managed by pnpm workspaces. See workspace packages under `apps/` (backend, frontend) and `packages/shared`.
- Frontend (`apps/frontend`) is a Next.js app that calls the backend API. It reads `NEXT_PUBLIC_API_URL` (example: `http://localhost:3001`).
- Backend (`apps/backend`) is a NestJS REST API. It uses Prisma (schema in `apps/backend/prisma/schema.prisma`) to talk to Postgres/TimescaleDB.
- Database is provided in `docker-compose.yml` as a TimescaleDB/Postgres container. The backend uses `DATABASE_URL` env to connect.

## Quick developer workflows (commands you can run)

- Install: run `pnpm install` at repo root. The repo requires Node >=24 and pnpm (see `package.json.engine` and `packageManager`).
- Dev (all): `pnpm dev` (runs all packages in parallel using workspace scripts).
- Backend only: `pnpm --filter backend start:dev` (watch mode). Backend tests: `pnpm --filter backend test` or `test:e2e` for e2e.
- Frontend only: `pnpm --filter frontend dev` (Next dev server; watches files).
- Prisma: database migrations and studio are run in the backend package: `pnpm --filter backend prisma migrate dev` and `pnpm --filter backend prisma studio`.
- Docker compose: `pnpm run docker:up` (root script) will bring up `postgres`, `backend`, and `frontend` as defined in `docker-compose.yml`.

## Important environment variables

- POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB — used by docker-compose/postgres.
- DATABASE_URL — required by backend/Prisma (point at your Postgres). When using docker-compose the service envs are linked.
- JWT_ACCESS_SECRET — used by `apps/backend` JwtModule (see `apps/backend/src/auth/*`).
- PORT — backend listens on `process.env.PORT ?? 3000` in `apps/backend/src/main.ts` (docker maps 3001).

## Project-specific conventions and patterns

- Monorepo workspace dependencies use `workspace:*` (see `apps/backend/package.json` and `apps/frontend/package.json`) — import shared code from `@market-artha/shared`.
- Global Prisma: `apps/backend/src/prisma/prisma.module.ts` marks Prisma as a `@Global()` module and provides `PrismaService`. Use that rather than instantiating new PrismaClients.
- Auth: JWT strategy is implemented at `apps/backend/src/auth/strategies/jwt.strategy.ts` and `AuthModule` registers JwtModule asynchronously using `ConfigService`. Look up `JWT_ACCESS_SECRET` there.
- Data models: schema is authoritative at `apps/backend/prisma/schema.prisma`. Key models: `User`, `Journal`, `Algorithm`, `MarketData` (note `MarketData.timestamp` uses timestamptz and `Decimal`/`BigInt` types).
- Shared types and runtime schemas live in `packages/shared/index.ts` and use `effect`'s `Schema` — prefer these types for DTOs and responses to keep consistency across frontend/backend.

## Code layout and where to implement changes

- API controllers: `apps/backend/src/*controller.ts` and business logic in corresponding `*service.ts`.
- Add new DB fields: edit `apps/backend/prisma/schema.prisma`, then run prisma migrate in the backend package and update generated client (the repo already has migrations in `apps/backend/prisma/migrations/`).
- Frontend pages/components: `apps/frontend/src/app/*` and UI components under `apps/frontend/src/components/ui`.

## Tests and CI notes

- Backend tests use Jest configured in `apps/backend/package.json` and `apps/backend/test/jest-e2e.json` for e2e. Root `pnpm dev` doesn't run tests automatically.

## Docker and deployment notes

- Dockerfiles: `apps/backend/Dockerfile` and `apps/frontend/Dockerfile`. `docker-compose.yml` at the repo root wires the three services and exposes ports: frontend:3000, backend:3001, postgres:5432.
- When changing the database schema, prefer running migrations locally via `pnpm --filter backend prisma migrate dev` before trying Docker-based startup.

## Practical examples for AI completions

- When adding a new protected endpoint in the backend, update or reuse `AuthService` and `JwtStrategy`, then decorate the controller method with `@UseGuards(AuthGuard('jwt'))`. Look at `apps/backend/src/auth/auth.controller.ts` for patterns.
- When adding a new column to `User`, add it to `schema.prisma`, run `prisma migrate dev`, and update shared schemas if it's part of the public API (`packages/shared/index.ts`).
- When consuming `MarketData` decimals on the frontend, expect Prisma Decimal values — serialize to string or convert with `toNumber()`/`toString()` depending on the UI requirement.

## Files you should look at first (examples)

- `package.json` (repo root) — workspace scripts and engine requirements
- `docker-compose.yml` — local dev orchestration and expected env vars
- `apps/backend/prisma/schema.prisma` — canonical DB model
- `apps/backend/src/prisma/prisma.module.ts` — prisma usage pattern (Global provider)
- `apps/backend/src/auth/*` — auth patterns and JWT secret usage
- `packages/shared/index.ts` — shared runtime schemas and types

If anything here is unclear or you'd like more details (example pull request templates for generated code, how to run migrations in CI, or serializer helpers for Prisma Decimal/BigInt), tell me which area to expand and I will iterate.
