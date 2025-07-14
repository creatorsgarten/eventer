# Eventer Monorepo - Claude Technical Documentation Index

## System Architecture Overview

Eventer is a high-performance event management platform engineered as a TypeScript monorepo. The architecture emphasizes type safety, developer experience, and runtime performance through modern web technologies.

## 🏗️ Technical Navigation

### Applications

| Application | Architecture                     | Runtime      | Documentation                                         |
| ----------- | -------------------------------- | ------------ | ----------------------------------------------------- |
| **Web**     | Next.js 15 App Router + React 19 | Node.js/Edge | [🔧 Web Technical Docs](./apps/web/CLAUDE.md)         |
| **Backend** | Elysia.js + Drizzle ORM          | Bun Runtime  | [🔧 Backend Technical Docs](./apps/backend/CLAUDE.md) |

### Infrastructure Packages

| Package               | Purpose                        | Technology            | Documentation                                                          |
| --------------------- | ------------------------------ | --------------------- | ---------------------------------------------------------------------- |
| **UI**                | Component Library Architecture | React 19 + TypeScript | [🔧 UI Technical Docs](./packages/ui/CLAUDE.md)                        |
| **TypeScript Config** | Compilation & Type System      | TypeScript 5.8.2      | [🔧 TypeScript Technical Docs](./packages/typescript-config/CLAUDE.md) |
| **ESLint Config**     | Code Quality Pipeline          | ESLint 9 Flat Config  | [🔧 ESLint Technical Docs](./packages/eslint-config/CLAUDE.md)         |

## 🚀 Development Environment

### System Requirements

```bash
# Core runtime dependencies
bun >= 1.2.8              # JavaScript runtime & package manager
node >= 20.0.0             # Node.js compatibility layer
typescript >= 5.8.2        # Type system compiler
```

### Infrastructure Bootstrap

```bash
# Repository initialization
git clone <repository-url>
cd eventer

# Dependency resolution with workspace protocol
bun install

# Development server orchestration
bun dev                    # Parallel: web:3000, backend:4000

# Production build pipeline
bun build                  # Turborepo task execution
```

## 📋 Monorepo Architecture

### Directory Structure Analysis

```
eventer/
├── apps/                           # Application layer
│   ├── web/                        # Next.js SSR/SSG application
│   │   ├── src/app/               # App Router architecture
│   │   ├── next.config.js         # Webpack & deployment config
│   │   └── package.json           # App-specific dependencies
│   │
│   └── backend/                    # Elysia.js API server
│       ├── src/                   # TypeScript source
│       ├── drizzle/               # Database migrations
│       └── drizzle.config.ts      # ORM configuration
│
├── packages/                       # Shared library layer
│   ├── ui/                        # React component system
│   ├── typescript-config/         # Compilation configurations
│   └── eslint-config/             # Code quality rules
│
├── turbo.json                     # Build orchestration
├── biome.json                     # Code formatting pipeline
└── bun.lockb                      # Dependency resolution lock
```

### Technology Stack Deep Dive

#### Frontend Architecture

- **Next.js 15**: App Router with React Server Components
- **React 19**: Concurrent rendering, Suspense, Server Components
- **TypeScript**: Strict mode with `noUncheckedIndexedAccess`
- **CSS Modules**: Component-scoped styling with CSS custom properties
- **Bundle Optimization**: Tree-shaking, code splitting, image optimization

#### Backend Architecture

- **Elysia.js**: High-performance web framework for Bun
- **Bun Runtime**: JavaScript/TypeScript execution with native performance
- **Drizzle ORM**: Type-safe database toolkit with query builder
- **PostgreSQL**: Relational database with ACID compliance
- **JWT Authentication**: Stateless token-based security

#### Development Infrastructure

- **Turborepo**: Monorepo build system with caching
- **Biome**: Unified linting and formatting (ESLint + Prettier replacement)
- **Vitest**: Fast unit testing with native TypeScript support
- **Playwright**: End-to-end testing automation

## 🔧 Build System Engineering

### Turborepo Task Pipeline

```json
// turbo.json - Build orchestration
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "package.json"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "inputs": ["src/**", "*.config.*"],
      "outputs": []
    }
  }
}
```

### Package Dependency Graph

```
┌─────────────┐    ┌─────────────┐
│    web      │    │   backend   │
└─────┬───────┘    └─────┬───────┘
      │                  │
      └─────┬────────────┘
            │
    ┌───────▼───────┐
    │      ui       │
    └───────┬───────┘
            │
    ┌───────▼───────┐    ┌─────────────────┐
    │ typescript-   │    │ eslint-config   │
    │    config     │    │                 │
    └───────────────┘    └─────────────────┘
```

## 🛠️ Development Workflow

### Local Development Commands

```bash
# Workspace operations
bun dev                              # Start all applications
bun dev --filter=web                # Isolated web development
bun dev --filter=backend             # Isolated backend development

# Code quality pipeline
bun lint                             # ESLint across workspace
bun format                           # Biome formatting
bun check-types                      # TypeScript compilation check

# Testing pipeline
bun test                             # Unit tests with Vitest
bun test:e2e                         # End-to-end with Playwright

# Build operations
bun build                            # Production build all apps
bun build --filter=web               # Isolated web build
```

### Database Development

```bash
# Schema management
bun db:generate                      # Generate migrations from schema
bun db:migrate                       # Apply pending migrations
bun db:push                          # Push schema changes (development)
bun db:studio                        # Open Drizzle Studio GUI

# Data operations
bun db:seed                          # Populate with test data
bun db:reset                         # Reset database state
```

## 📊 Performance Engineering

### Build Performance Metrics

```typescript
// Turborepo caching effectiveness
interface BuildMetrics {
  cacheHitRate: number; // Target: >80%
  buildTime: number; // Target: <30s clean build
  incrementalBuild: number; // Target: <5s cached build
  bundleSize: {
    web: number; // Target: <500KB gzipped
    backend: number; // Target: <50MB binary
  };
}
```

### Runtime Performance Targets

```typescript
// Web Vitals optimization targets
interface PerformanceTargets {
  LCP: number; // <2.5s (Largest Contentful Paint)
  FID: number; // <100ms (First Input Delay)
  CLS: number; // <0.1 (Cumulative Layout Shift)
  TTFB: number; // <800ms (Time to First Byte)
}

// Backend performance targets
interface BackendMetrics {
  responseTime: number; // <200ms p95
  throughput: number; // >1000 req/s
  errorRate: number; // <0.1%
  uptime: number; // >99.9%
}
```

## 🔒 Type Safety Architecture

### TypeScript Configuration Hierarchy

```typescript
// Strict type system configuration
interface TypeSystemConfig {
  strict: true; // All strict checks enabled
  noUncheckedIndexedAccess: true; // Runtime safety for arrays/objects
  exactOptionalPropertyTypes: true; // Precise optional type handling
  noImplicitReturns: true; // Explicit return statements
  noFallthroughCasesInSwitch: true; // Switch statement safety
}
```

### Inter-Package Type Safety

```typescript
// Workspace package type resolution
import type { EventData } from "@eventer/backend/types";
import type { ButtonProps } from "@eventer/ui/button";
import type { Config } from "@eventer/typescript-config/base";

// Type-safe workspace protocol ensures compile-time validation
// across package boundaries with zero runtime overhead
```

## 🚀 Deployment Architecture

### Build Artifacts

```bash
# Production build outputs
apps/web/.next/                      # Next.js optimized build
apps/backend/dist/                   # TypeScript compiled output
packages/ui/dist/                    # Component library build
```

### Container Strategy

```dockerfile
# Multi-stage build for optimal container size
FROM oven/bun:1 AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production stage
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
CMD ["bun", "start"]
```

### Hosting Recommendations

#### Web Application

- **Vercel**: Native Next.js optimization with Edge Runtime
- **Netlify**: JAMstack deployment with Edge Functions
- **Cloudflare Pages**: Global CDN with Worker integration

#### Backend API

- **Railway**: Container deployment with auto-scaling
- **Fly.io**: Edge deployment with geographic distribution
- **AWS ECS**: Enterprise container orchestration
- **Docker**: Self-hosted containerized deployment

#### Database

- **Supabase**: Managed PostgreSQL with real-time features
- **PlanetScale**: Serverless MySQL with branching
- **Neon**: Serverless PostgreSQL with auto-scaling

## 📋 Code Quality Engineering

### Static Analysis Pipeline

```typescript
// Multi-layer code quality enforcement
interface QualityPipeline {
  typescript: {
    strictness: "maximum";
    target: "ES2022";
    moduleResolution: "NodeNext";
  };

  biome: {
    linting: "recommended";
    formatting: "consistent";
    sorting: "imports";
  };

  testing: {
    coverage: ">90%";
    unitTests: "vitest";
    e2eTests: "playwright";
  };
}
```

### Pre-commit Validation

```bash
# Husky + lint-staged pipeline
.husky/pre-commit:
  bun lint-staged

lint-staged.config.js:
  "*.{ts,tsx}": ["bun biome check --apply", "bun check-types"]
  "*.{js,jsx,ts,tsx}": ["bun test --related"]
```

## 🤖 AI Assistant Integration

### Development Context

This documentation structure enables AI assistants to:

1. **Understand Architecture**: Clear separation of concerns and responsibilities
2. **Navigate Codebase**: Direct links to component-specific documentation
3. **Suggest Improvements**: Performance metrics and optimization targets
4. **Debug Issues**: Comprehensive error handling and logging strategies
5. **Implement Features**: Type-safe patterns and established conventions

### Usage Patterns

- **Gemini**: Comprehensive overview and feature development guidance
- **Claude**: Technical implementation details and architectural decisions
- **Development**: Quick reference for daily development tasks

---

This technical documentation provides deep architectural insights into the Eventer monorepo. For implementation-specific details, refer to the individual component documentation linked above.
bun run format # Code formatting
bun run test # Run all tests
bun run build # Build for production

```

## Core Features

The platform addresses common pain points in Thai event management:

1. **Real-time Schedule Management**: Live updates synchronized across all staff
2. **Sponsor Template Generation**: Streamlined documentation for supporters
3. **Instant Staff Coordination**: One-click access to complete event information
4. **Resource Management**: Comprehensive tracking of venues, catering, parking, staff roles
5. **Thai Language First**: UI and content designed for Thai organizers

## Development Approach

### Code Quality Standards

- **Biome**: Single tool for linting, formatting, and import organization
- **TypeScript**: Strict mode with comprehensive type checking
- **Pre-commit Hooks**: Automated quality checks via Husky + lint-staged
- **Test Coverage**: Unit tests (Vitest) + E2E tests (Playwright)

### Database Strategy

- **Drizzle ORM**: Type-safe database operations with migration support
- **Multi-database Support**: SQLite (dev), PostgreSQL/MySQL (production)
- **Schema Management**: Version-controlled migrations
- **Development Tools**: Drizzle Studio for visual database management

### Monorepo Benefits

- **Shared Code**: UI components, TypeScript configs, utilities
- **Coordinated Builds**: Turborepo handles complex dependency graphs
- **Consistent Tooling**: Same dev experience across all packages
- **Type Safety**: End-to-end TypeScript from frontend to backend

## Current Status

**Active Branch**: `landing-page`

- Focus: Marketing website with Thai content
- Goal: Showcase platform capabilities and gather early user feedback

**Completed Infrastructure**:

- ✅ Monorepo setup with proper tooling
- ✅ Backend API with modular architecture
- ✅ Database layer with migrations
- ✅ Frontend foundation with modern React
- ✅ Comprehensive linting and formatting
- ✅ CI/CD pipeline

**In Development**:

- 🔄 Landing page with Thai localization
- 🔄 UI component library expansion
- 🔄 Authentication system integration

## App-Specific Documentation

For detailed technical information:

- **Backend API Server**: [apps/backend/CLAUDE.md](apps/backend/CLAUDE.md)
- **Web Application**: [apps/web/CLAUDE.md](apps/web/CLAUDE.md)
- **UI Components**: [packages/ui/CLAUDE.md](packages/ui/CLAUDE.md)

## Working Effectively

### Making Changes

1. **Feature Development**: Create branches from `main`, follow established patterns
2. **Database Updates**: Schema changes → generate migration → test locally
3. **UI Components**: Add to shared package, maintain design consistency
4. **Testing**: Write tests alongside features, ensure coverage

### Code Organization

- **Backend**: Modular architecture with clear separation of concerns
- **Frontend**: Component-based with shared UI library
- **Types**: Shared across frontend/backend for consistency
- **Configuration**: Centralized in packages for reusability

### Quality Assurance

- **Automated**: Pre-commit hooks catch issues early
- **Manual**: Code review process ensures maintainability
- **Testing**: Comprehensive test suites for reliability
- **Performance**: Bun and optimized tooling for fast development

This project prioritizes developer experience while building a robust platform for Thai event management needs.
```
