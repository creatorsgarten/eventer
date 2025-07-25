# Web Dockerfile
FROM oven/bun:1.2.8-alpine AS base

# Prune stage - extract only the files needed for this app
FROM base AS pruner
WORKDIR /app
RUN bun install -g turbo
COPY . .
RUN turbo prune web --docker

# Install dependencies based on the pruned package.json files
FROM base AS installer
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
RUN bun install -g turbo
WORKDIR /app

# Copy lockfile and package.json files from pruner
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock* ./

# Remove problematic root dev dependencies that cause lockfile issues
RUN sed -i '/"@biomejs\/biome":/d' package.json || true

# Install dependencies (allow scripts but ignore lockfile to avoid corruption issues)
RUN rm -f bun.lock && bun install

# Copy the source code from pruner and build
COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=web

# Production image, copy all the files and run Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=installer /app/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

# Copy and clean package.json for production dependencies
COPY apps/web/package.json ./package.json
RUN sed -i '/"@eventer\/.*":/d' package.json
RUN bun install --production

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
