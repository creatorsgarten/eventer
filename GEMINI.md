# Eventer Monorepo - Gemini Documentation Index

## Project Overview

Eventer is a comprehensive event management platform built with modern web technologies. This monorepo contains all applications, packages, and shared configurations needed to run the platform.

## 🎯 Quick Navigation

### Applications

| App         | Purpose                         | Technology                | Documentation                               |
| ----------- | ------------------------------- | ------------------------- | ------------------------------------------- |
| **Web**     | Landing page and marketing site | Next.js 15 + React 19     | [📖 Web Docs](./apps/web/GEMINI.md)         |
| **Backend** | API server and business logic   | Elysia.js + Bun + Drizzle | [📖 Backend Docs](./apps/backend/GEMINI.md) |

### Packages

| Package               | Purpose                          | Documentation                                                |
| --------------------- | -------------------------------- | ------------------------------------------------------------ |
| **UI**                | Shared React components          | [📖 UI Docs](./packages/ui/GEMINI.md)                        |
| **TypeScript Config** | Shared TypeScript configurations | [📖 TypeScript Docs](./packages/typescript-config/GEMINI.md) |
| **ESLint Config**     | Shared linting configurations    | [📖 ESLint Docs](./packages/eslint-config/GEMINI.md)         |

## 🚀 Getting Started

### Prerequisites

- **Bun**: v1.2.8+ (JavaScript runtime and package manager)
- **Node.js**: v20+ (for compatibility)
- **Git**: For version control

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/your-org/eventer.git
cd eventer

# Install dependencies
bun install

# Start development servers
bun dev

# Run all applications
# - Web: http://localhost:3000
# - Backend: http://localhost:4000
```

## 🏗️ Architecture Overview

### Monorepo Structure

```
eventer/
├── apps/                    # Applications
│   ├── web/                 # Next.js landing page
│   └── backend/             # Elysia.js API server
│
├── packages/                # Shared packages
│   ├── ui/                  # React component library
│   ├── typescript-config/   # TypeScript configurations
│   └── eslint-config/       # ESLint configurations
│
├── assets/                  # Shared assets
├── turbo.json              # Turborepo configuration
├── biome.json              # Code formatting & linting
└── package.json            # Root dependencies
```

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Elysia.js, Bun, Drizzle ORM
- **Database**: PostgreSQL with Drizzle migrations
- **Styling**: CSS Modules, Custom Properties
- **Build System**: Turborepo for monorepo management
- **Package Manager**: Bun for fast dependencies
- **Code Quality**: Biome for linting and formatting

## 📱 Applications Deep Dive

### Web Application

The marketing and landing page for Eventer platform.

**Key Features**:

- 🎨 Modern Thai-focused design
- 📱 Fully responsive layout
- ⚡ Optimized performance with Next.js 15
- 🌟 Interactive animations and showcases
- 📧 Email signup and contact forms

**Tech Stack**: Next.js 15, React 19, CSS Modules, TypeScript

### Backend API

The core API server handling all business logic and data operations.

**Key Features**:

- 🚀 High-performance Elysia.js framework on Bun
- 🗄️ Type-safe database operations with Drizzle ORM
- 🔐 JWT-based authentication system
- 📊 Event management and analytics
- 🔄 Real-time agenda updates

**Tech Stack**: Elysia.js, Bun, Drizzle ORM, PostgreSQL, TypeScript

## 📦 Shared Packages

### UI Component Library

Reusable React components shared across all applications.

**Components**:

- `Button` - Interactive button with app tracking
- `Card` - Link cards with analytics
- `Code` - Code display component

**Features**:

- 🎯 TypeScript support
- 🌳 Tree-shakeable exports
- 📦 Optimized for monorepo usage

### TypeScript Configuration

Centralized TypeScript settings for consistent type safety.

**Configurations**:

- `base.json` - Foundation config for all projects
- `nextjs.json` - Next.js optimized settings
- `react-library.json` - React component library config

**Features**:

- 🔒 Strict mode enabled
- 🎯 ES2022 target for modern features
- 📝 Declaration file generation

### ESLint Configuration

Shared linting rules for code quality across the monorepo.

**Configurations**:

- `base.js` - Foundation ESLint rules
- `next.js` - Next.js specific rules
- `react-internal.js` - React component library rules

**Features**:

- 🔧 ESLint 9 flat config format
- ⚛️ React 19 and hooks support
- 🚀 Next.js optimization rules

## 🛠️ Development Workflow

### Common Commands

```bash
# Development
bun dev                     # Start all apps in development
bun dev --filter=web        # Start only web app
bun dev --filter=backend    # Start only backend

# Building
bun build                   # Build all apps and packages
bun build --filter=web      # Build only web app

# Testing & Quality
bun test                    # Run all tests
bun lint                    # Lint all code
bun format                  # Format all code
bun check-types             # TypeScript type checking
```

### Project Scripts

```bash
# Workspace management
bun clean                   # Clean all build artifacts
bun reset                   # Reset all node_modules

# Database (Backend)
bun db:push                 # Push schema changes
bun db:studio              # Open Drizzle Studio
bun db:migrate             # Run migrations

# Code generation
bun generate:component      # Generate new UI component
```

## 🔧 Configuration Files

### Root Configuration

- **turbo.json**: Turborepo build pipeline configuration
- **biome.json**: Code formatting and linting rules
- **package.json**: Workspace dependencies and scripts
- **bun.lockb**: Bun lockfile for reproducible installs

### Development Tools

- **.vscode/**: VSCode workspace settings and extensions
- **.github/**: GitHub Actions CI/CD workflows
- **assets/**: Shared images and design assets

## 🚀 Deployment

### Production Build

```bash
# Build all applications for production
bun build

# Applications are built to:
# - apps/web/.next/ (Next.js build)
# - apps/backend/dist/ (TypeScript compilation)
```

### Environment Variables

Each application has its own environment configuration:

- `apps/web/.env.local` - Web app environment
- `apps/backend/.env` - Backend API environment

### Hosting Recommendations

- **Web App**: Vercel (optimized for Next.js)
- **Backend**: Railway, Fly.io, or Docker containers
- **Database**: Supabase, PlanetScale, or managed PostgreSQL

## 📚 Learning Resources

### Documentation by Audience

**For Developers**:

- [Backend API Documentation](./apps/backend/GEMINI.md) - Server development
- [UI Component Guide](./packages/ui/GEMINI.md) - Component usage
- [TypeScript Setup](./packages/typescript-config/GEMINI.md) - Type safety

**For Designers**:

- [Web Application Design](./apps/web/GEMINI.md) - Design system and components
- [Asset Management](./assets/) - Images and brand assets

**For DevOps**:

- [Monorepo Configuration](./turbo.json) - Build pipeline
- [Code Quality Setup](./packages/eslint-config/GEMINI.md) - Linting rules

### External Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js 15 Guide](https://nextjs.org/docs)
- [Elysia.js Documentation](https://elysiajs.com/)
- [Drizzle ORM Guide](https://orm.drizzle.team/)
- [Bun Documentation](https://bun.sh/docs)

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/eventer.git`
3. Install dependencies: `bun install`
4. Create feature branch: `git checkout -b feature/amazing-feature`
5. Make changes and test: `bun dev`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Create Pull Request

### Code Standards

- 📝 Follow TypeScript strict mode
- 🧹 Use Biome for formatting
- ✅ Write tests for new features
- 📚 Update documentation
- 🔍 Ensure all checks pass

## 📞 Support

### Getting Help

- 📖 Check relevant documentation first
- 🐛 Search existing issues on GitHub
- 💬 Create new issue with detailed description
- 📧 Contact maintainers for urgent matters

### Project Maintainers

- Backend & Infrastructure: Core development team
- Frontend & Design: UI/UX development team
- DevOps & Tooling: Platform engineering team

---

This documentation provides a comprehensive overview of the Eventer monorepo structure. For detailed information about specific components, please refer to the individual documentation files linked above.

- **Coverage**: Configured for comprehensive test coverage

## Project Status

### Completed

- ✅ Database setup with Drizzle ORM
- ✅ Biome configuration for code quality
- ✅ Monorepo structure with Turborepo
- ✅ Backend API with Elysia.js
- ✅ Web landing page with Next.js
- ✅ CI/CD pipeline
- ✅ Testing setup with Vitest

### In Progress

- 🔄 Landing page development (Thai content)
- 🔄 UI component library expansion

### Planned

- ⏳ Playwright E2E test setup
- ⏳ Production deployment
- ⏳ Authentication system
- ⏳ Dashboard application

## Working with This Project

### Adding New Features

1. Create feature branches from `main`
2. Follow the existing code structure in respective apps
3. Add tests for new functionality
4. Ensure all linting passes before committing

### Database Changes

1. Update schema in `apps/backend/src/infrastructure/db/`
2. Generate migration: `bun run db:generate`
3. Apply migration: `bun run db:migrate`

### Adding UI Components

1. Create components in `packages/ui/src/`
2. Export from `packages/ui/src/index.ts`
3. Use in apps by importing from `@eventer/ui`

This project emphasizes developer experience with fast tooling (Bun), comprehensive type safety (TypeScript), and automated code quality (Biome + Husky).
