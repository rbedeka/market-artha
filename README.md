# Market-Artha Monorepo

Market-Artha is a modern trading journal and algorithmic research platform. This monorepo contains all services and packages for local development, including frontend, backend, and shared libraries.

## Project Structure

- `apps/frontend` — Next.js frontend app
- `apps/backend` — NestJS backend API (uses Prisma, connects to TimescaleDB/Postgres)
- `packages/shared` — Shared types and runtime schemas (used by both frontend and backend)

## Development Quickstart

### Prerequisites

- Node.js >= 24
- pnpm (see `packageManager` in `package.json`)
- Docker (for database and full-stack dev)

### Install dependencies

```bash
pnpm install
```

### Start all services in dev mode

```bash
pnpm dev
```

Or use Docker Compose for full-stack dev (hot reload for frontend/backend, TimescaleDB for database):

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5433 (TimescaleDB/Postgres)

### Database Management

- Prisma schema: `apps/backend/prisma/schema.prisma`
- Run migrations:
  ```bash
  pnpm --filter backend prisma migrate dev
  ```
- Open Prisma Studio:
  ```bash
  pnpm --filter backend prisma studio
  ```

### Environment Variables

- See `.env.example` or Docker Compose files for required variables.
- Backend uses `DATABASE_URL`, `JWT_ACCESS_SECRET`, `PORT`.
- Frontend uses `NEXT_PUBLIC_API_URL`.

## Project Conventions

- Use `@market-artha/shared` for shared types and schemas.
- Prefer pnpm workspace commands for cross-package development.
- See `.github/copilot-instructions.md` for AI/automation guidelines.

## Useful Commands

- `pnpm dev` — Run all apps in dev mode
- `pnpm --filter backend test` — Run backend tests
- `pnpm --filter frontend dev` — Run frontend only
- `pnpm run docker:up` — Start all services with Docker Compose

## License

MIT
