# Backend Dockerfile
FROM oven/bun:1.2.8-alpine AS base

# Prune workspace to only include @eventer/backend and its dependencies
FROM base AS pruner
WORKDIR /app

# Install turbo
RUN bun install -g turbo

# Copy the entire monorepo for pruning
COPY . .

# Prune the workspace for the backend app
RUN turbo prune @eventer/backend --docker

# Install dependencies for the pruned workspace
FROM base AS installer
WORKDIR /app

# Install turbo for building
RUN bun install -g turbo

# Copy pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock* ./

# Install dependencies including dev dependencies for building
RUN bun install

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Build the application using turbo
RUN turbo build --filter=@eventer/backend

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy the built application from installer stage
COPY --from=installer /app/apps/backend/dist ./dist
COPY --from=installer /app/apps/backend/drizzle ./drizzle

# Copy package.json and remove workspace dependencies
COPY apps/backend/package.json ./package.json
RUN sed -i '/"@eventer\/typescript-config":/d' package.json

# Install only production dependencies
RUN bun install --production

USER backend

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Run the application
CMD ["bun", "run", "dist/index.js"]
