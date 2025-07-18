# Backend Dockerfile
FROM oven/bun:1.2.8-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb* ./
COPY ../../bun.lockb* ./

# Install dependencies including dev dependencies for building
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy the built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle

# Install only production dependencies
RUN bun install --production --frozen-lockfile

USER backend

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Run the application
CMD ["bun", "run", "dist/index.js"]
