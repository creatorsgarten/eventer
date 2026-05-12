FROM oven/bun:1 AS deps
WORKDIR /app

# Copy workspace manifests for dependency caching
COPY package.json bun.lockb turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN bun install --frozen-lockfile --production=false

FROM oven/bun:1 AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

COPY apps/backend/src ./apps/backend/src
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/drizzle.config.ts ./apps/backend/
COPY apps/backend/drizzle ./apps/backend/drizzle
COPY packages/typescript-config ./packages/typescript-config

USER appuser

ENV NODE_ENV=production
WORKDIR /app/apps/backend

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["bun", "src/index.ts"]
