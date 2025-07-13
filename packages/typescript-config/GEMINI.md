# TypeScript Config - Gemini Documentation

## Overview

The `@eventer/typescript-config` package provides shared TypeScript configurations across the Eventer monorepo. It establishes consistent compilation settings, type checking rules, and development workflows for all TypeScript projects.

## Tech Stack

- **TypeScript**: Version 5.8.2 with latest features
- **JSON Schema**: VSCode IntelliSense support
- **Module System**: ESNext with NodeNext resolution
- **Target**: ES2022 for modern JavaScript features

## Configuration Files

### 1. Base Configuration (`base.json`)

**Purpose**: Foundation configuration for all TypeScript projects

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "declaration": true, // Generate .d.ts files
    "declarationMap": true, // Source maps for declarations
    "esModuleInterop": true, // CommonJS/ESM interoperability
    "incremental": false, // Disable incremental compilation
    "isolatedModules": true, // Ensure each file is a module
    "lib": ["es2022", "DOM", "DOM.Iterable"], // Available APIs
    "module": "NodeNext", // Latest Node.js module resolution
    "moduleDetection": "force", // Force module detection
    "moduleResolution": "NodeNext", // Node.js-style resolution
    "noUncheckedIndexedAccess": true, // Strict array/object access
    "resolveJsonModule": true, // Import JSON files
    "skipLibCheck": true, // Skip type checking of declaration files
    "strict": true, // Enable all strict type checking
    "target": "ES2022" // Modern JavaScript output
  }
}
```

**Key Features**:

- **Strict Mode**: Maximum type safety with all strict options enabled
- **Modern Target**: ES2022 for async/await, nullish coalescing, optional chaining
- **Module Safety**: `isolatedModules` ensures each file can be transpiled independently
- **Declaration Generation**: Automatic `.d.ts` file creation for libraries
- **Index Safety**: `noUncheckedIndexedAccess` prevents runtime errors

### 2. Next.js Configuration (`nextjs.json`)

**Purpose**: Specialized configuration for Next.js applications

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }], // Next.js TypeScript plugin
    "module": "ESNext", // ESM for modern bundling
    "moduleResolution": "Bundler", // Bundler-specific resolution
    "allowJs": true, // Support JavaScript files
    "jsx": "preserve", // Let Next.js handle JSX
    "noEmit": true // Next.js handles compilation
  }
}
```

**Next.js Optimizations**:

- **Plugin Integration**: Next.js TypeScript plugin for enhanced IDE support
- **Bundler Resolution**: Optimized for webpack and other bundlers
- **JSX Preservation**: Let Next.js handle JSX transformation
- **No Emit**: Compilation handled by Next.js build system
- **JavaScript Support**: Allow gradual TypeScript adoption

### 3. React Library Configuration (`react-library.json`)

**Purpose**: Configuration for React component libraries

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx" // Modern JSX transform
  }
}
```

**Library Features**:

- **React 17+ JSX**: Modern JSX transform without React imports
- **Component Libraries**: Optimized for reusable React components
- **Declaration Files**: Automatic type definitions for consumers

## Usage Patterns

### In Applications

**Next.js Web App**:

```json
// apps/web/tsconfig.json
{
  "extends": "@eventer/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Backend API**:

```json
// apps/backend/tsconfig.json
{
  "extends": "@eventer/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### In Packages

**UI Component Library**:

```json
// packages/ui/tsconfig.json
{
  "extends": "@eventer/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*"]
}
```

**Utility Package**:

```json
// packages/utils/tsconfig.json
{
  "extends": "@eventer/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  }
}
```

## Type Safety Features

### Strict Configuration Benefits

1. **No Implicit Any**: All types must be explicitly declared

```typescript
// ❌ Error: Parameter 'data' implicitly has an 'any' type
function process(data) {
  return data.name;
}

// ✅ Explicit typing required
function process(data: { name: string }) {
  return data.name;
}
```

2. **Strict Null Checks**: Null/undefined safety

```typescript
// ❌ Error: Object is possibly 'null'
const user = users.find((u) => u.id === id);
console.log(user.name);

// ✅ Null checking required
const user = users.find((u) => u.id === id);
if (user) {
  console.log(user.name);
}
```

3. **No Unchecked Indexed Access**: Array/object safety

```typescript
// ❌ Error: Element implicitly has an 'any' type
const firstItem = items[0];

// ✅ Safe access patterns
const firstItem = items[0] ?? defaultItem;
// or
const firstItem = items.at(0);
```

### Module Safety

**Isolated Modules**: Each file is independently compilable

```typescript
// ❌ Error: Cannot re-export a type when module detection is 'force'
export { User } from "./types";

// ✅ Explicit type export
export type { User } from "./types";
```

**ES Module Interop**: Seamless CommonJS/ESM integration

```typescript
// Works with both CommonJS and ESM modules
import express from "express"; // ESM style
import * as path from "path"; // CommonJS style
```

## Development Workflow

### IDE Integration

**VSCode Settings** (Recommended):

```json
// .vscode/settings.json
{
  "typescript.preferences.quoteStyle": "single",
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": true,
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### Build Scripts

**Package Development**:

```json
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "check-types": "tsc --noEmit",
    "dev": "tsc --watch --preserveWatchOutput"
  }
}
```

**Application Development**:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "build": "next build",
    "dev": "next dev"
  }
}
```

## Configuration Inheritance

### Layered Configuration Strategy

```
Base Config (base.json)
├── Next.js Config (nextjs.json)
│   ├── Web App (apps/web/tsconfig.json)
│   └── Docs App (apps/docs/tsconfig.json)
│
└── React Library Config (react-library.json)
    ├── UI Package (packages/ui/tsconfig.json)
    └── Component Libraries
```

### Override Patterns

**Path Mapping**:

```json
{
  "extends": "@eventer/typescript-config/base.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

**Environment-Specific Types**:

```json
{
  "extends": "@eventer/typescript-config/base.json",
  "compilerOptions": {
    "types": ["node", "jest"],
    "lib": ["ES2022", "DOM"]
  }
}
```

## Performance Optimization

### Compilation Speed

- **Skip Lib Check**: Faster compilation by skipping declaration file checking
- **No Incremental**: Simplified for CI/CD environments
- **Isolated Modules**: Parallel compilation support

### Memory Usage

```json
{
  "ts-node": {
    "transpileOnly": true,
    "files": true
  },
  "compilerOptions": {
    "skipLibCheck": true,
    "incremental": false
  }
}
```

## Migration Guide

### From Legacy Config

**Before** (Old tsconfig.json):

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["dom", "es6"],
    "strict": false
  }
}
```

**After** (Using shared config):

```json
{
  "extends": "@eventer/typescript-config/nextjs.json",
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Update Checklist

1. ✅ Install package: `bun add -D @eventer/typescript-config`
2. ✅ Choose appropriate config (base/nextjs/react-library)
3. ✅ Update extends field in tsconfig.json
4. ✅ Remove duplicate compiler options
5. ✅ Run type check: `bun run check-types`
6. ✅ Fix any new strict mode errors

This TypeScript configuration package ensures consistent, strict, and modern TypeScript setup across the entire Eventer monorepo, promoting code quality and developer productivity.
