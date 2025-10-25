
FROM node:24-slim AS builder
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files for caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

# Pre-fetch dependencies
RUN pnpm fetch --registry=https://registry.npmjs.org

# Install only frontend and shared dependencies
ENV CI=true
RUN pnpm install --offline --frozen-lockfile --filter frontend --filter shared

# Copy frontend source and shared code
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared

# Build Next.js app
RUN pnpm run build

# --- Runtime image ---
FROM builder AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs

# Copy built public and static assets
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

EXPOSE 3000
CMD ["node", "apps/frontend/server.js"]