FROM node:24-slim AS base

WORKDIR /app

# Install openssl and clean up apt cache
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl \
	&& rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo config and minimal package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

# Pre-fetch dependencies for faster install
RUN pnpm fetch --registry=https://registry.npmjs.org

# Copy backend and shared packages
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared

# Install dependencies for backend and shared only
ENV CI=true
RUN pnpm install --offline --frozen-lockfile --filter backend --filter shared

# Generate Prisma client with dummy DB URL
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN (cd apps/backend && pnpx prisma generate)

# Build backend
RUN pnpm run build

# Set production environment
ENV NODE_ENV=production

# Create non-root user and group
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000

# Start backend
CMD ["node", "apps/backend/dist/src/main.js"]


