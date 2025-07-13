# TypeScript Config - Claude Technical Documentation

## Configuration Architecture

### Type System Engineering

```json
// packages/typescript-config/base.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "declaration": true, // Type definition generation
    "declarationMap": true, // Source map correlation
    "esModuleInterop": true, // CJS/ESM bridge
    "incremental": false, // CI/CD optimization
    "isolatedModules": true, // Parallel compilation
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext", // Latest Node.js resolution
    "moduleDetection": "force", // Aggressive module detection
    "moduleResolution": "NodeNext", // Node.js 16+ algorithm
    "noUncheckedIndexedAccess": true, // Runtime safety
    "resolveJsonModule": true, // JSON import support
    "skipLibCheck": true, // Performance optimization
    "strict": true, // Maximum type safety
    "target": "ES2022" // Modern feature support
  }
}
```

### Compilation Target Analysis

#### ES2022 Feature Support

```typescript
// Top-level await
const config = await import("./config.json");

// Private class fields
class EventManager {
  #apiKey: string;

  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }
}

// Logical assignment operators
let user: User | undefined;
user ??= await fetchDefaultUser();

// Array.prototype.at()
const lastEvent = events.at(-1);

// Object.hasOwn()
if (Object.hasOwn(event, "participants")) {
  // Type-safe property access
}
```

#### Module Resolution Strategy

```typescript
// NodeNext resolution algorithm
import type { Config } from "./config.js"; // Explicit extension
import { database } from "#database"; // Package imports
import * as utils from "@eventer/utils"; // Workspace packages
```

## Framework-Specific Configurations

### Next.js Configuration Deep Dive

```json
// packages/typescript-config/nextjs.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }], // IDE integration
    "module": "ESNext", // Bundler optimization
    "moduleResolution": "Bundler", // Webpack-compatible
    "allowJs": true, // Gradual migration
    "jsx": "preserve", // Next.js transform
    "noEmit": true // Build system delegation
  }
}
```

#### Next.js Plugin Integration

```typescript
// Enhanced IDE support through Next.js plugin
// Auto-completion for Next.js specific imports
import { NextRequest, NextResponse } from "next/server";
import type { Metadata } from "next";

// Type checking for App Router conventions
export const metadata: Metadata = {
  title: "Eventer",
  description: "Event management platform",
};

// Route handler typing
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: "ok" });
}
```

### React Library Configuration

```json
// packages/typescript-config/react-library.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx" // React 17+ transform
  }
}
```

#### JSX Transform Analysis

```typescript
// React 17+ automatic JSX transform
// No React import required
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

// Compiled output (automatic transform):
import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ children, onClick }) => {
  return _jsx("button", { onClick, children });
};
```

## Type Safety Engineering

### Strict Mode Configuration Impact

```typescript
// noUncheckedIndexedAccess: true
interface EventData {
  participants: string[];
  metadata: Record<string, unknown>;
}

// ❌ Compiler error: Element implicitly has 'any' type
const firstParticipant = event.participants[0];

// ✅ Safe access patterns
const firstParticipant = event.participants[0] ?? "Unknown";
const metadata = event.metadata.category ?? null;

// Type narrowing with optional chaining
const categoryName = event.metadata?.category as string | undefined;
```

### Advanced Type System Features

```typescript
// isolatedModules: true enforcement
// Each file must be independently compilable

// ❌ Error: Cannot re-export type when isolatedModules is true
export { UserType } from "./types";

// ✅ Explicit type-only export
export type { UserType } from "./types";
export { createUser } from "./types";

// ❌ Error: Enum used only as type
enum Status {
  Active,
  Inactive,
}
export type { Status };

// ✅ Const assertion for type-only usage
const Status = {
  Active: "active",
  Inactive: "inactive",
} as const;
export type Status = (typeof Status)[keyof typeof Status];
```

## Build System Integration

### Compilation Strategy

```typescript
// tsc compilation with declaration generation
interface CompilationConfig {
  input: string;
  output: string;
  declarations: boolean;
  sourceMaps: boolean;
}

const buildLibrary = async (config: CompilationConfig) => {
  // TypeScript API usage for programmatic compilation
  const program = ts.createProgram([config.input], {
    ...baseConfig.compilerOptions,
    outDir: config.output,
    declaration: config.declarations,
    declarationMap: config.sourceMaps,
  });

  const emitResult = program.emit();

  if (emitResult.diagnostics.length > 0) {
    throw new Error("TypeScript compilation failed");
  }
};
```

### Monorepo Integration Patterns

```typescript
// Project references for incremental compilation
// packages/ui/tsconfig.json
{
  "extends": "@eventer/typescript-config/react-library.json",
  "compilerOptions": {
    "composite": true,              // Enable project references
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../utils" }          // Dependency graph
  ]
}

// Root tsconfig.json for workspace compilation
{
  "files": [],
  "references": [
    { "path": "./apps/web" },
    { "path": "./apps/backend" },
    { "path": "./packages/ui" },
    { "path": "./packages/utils" }
  ]
}
```

## Performance Optimization

### Compilation Performance Analysis

```typescript
// Compiler options impact on build time
interface PerformanceMetrics {
  skipLibCheck: boolean; // 60% faster compilation
  incremental: boolean; // 40% faster rebuilds
  isolatedModules: boolean; // Parallel compilation
  composite: boolean; // Project references
}

// tsc --extendedDiagnostics for performance monitoring
const performanceConfig = {
  extendedDiagnostics: true,
  generateCpuProfile: "profile.json",
  generateTrace: "trace.json",
};
```

### Memory Usage Optimization

```json
{
  "ts-node": {
    "transpileOnly": true, // Skip type checking in development
    "compilerOptions": {
      "skipLibCheck": true, // Reduce memory footprint
      "incremental": false // Disable for CI environments
    }
  }
}
```

## Development Environment Integration

### IDE Configuration Sync

```typescript
// .vscode/settings.json synchronization
interface IDESettings {
  "typescript.preferences.quoteStyle": "single";
  "typescript.format.semicolons": "insert";
  "typescript.preferences.includePackageJsonAutoImports": "auto";
  "typescript.suggest.autoImports": true;
  "typescript.updateImportsOnFileMove.enabled": "always";
  "typescript.inlayHints.parameterNames.enabled": "all";
  "typescript.inlayHints.variableTypes.enabled": true;
}
```

### Path Mapping Strategy

```json
// Enhanced path resolution for development
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"],
      "@eventer/*": ["../../packages/*/src"]
    }
  }
}
```

## Testing Configuration

```typescript
// Jest integration with TypeScript
// jest.config.ts
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "@eventer/typescript-config/base.json",
    },
  },
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@eventer/(.*)$": "<rootDir>/../../packages/$1/src",
  },
};

// Vitest configuration
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": "./src",
      "@eventer/ui": "../../packages/ui/src",
    },
  },
});
```

## Error Handling & Diagnostics

### Compiler Diagnostics Analysis

```typescript
// Custom diagnostic reporting
interface TypeScriptDiagnostic {
  code: number;
  category: ts.DiagnosticCategory;
  messageText: string;
  file?: ts.SourceFile;
  start?: number;
  length?: number;
}

const analyzeDiagnostics = (diagnostics: ts.Diagnostic[]) => {
  const errors = diagnostics.filter(
    (d) => d.category === ts.DiagnosticCategory.Error
  );
  const warnings = diagnostics.filter(
    (d) => d.category === ts.DiagnosticCategory.Warning
  );

  return {
    errorCount: errors.length,
    warningCount: warnings.length,
    mostCommonErrors: groupBy(errors, "code"),
    buildStatus: errors.length === 0 ? "success" : "failed",
  };
};
```

### Migration Diagnostics

```typescript
// Automated migration from legacy configurations
interface MigrationCheck {
  hasLegacyTarget: boolean; // target < ES2020
  hasLooseMode: boolean; // strict: false
  hasImplicitAny: boolean; // noImplicitAny: false
  hasUncheckedIndexAccess: boolean;
}

const validateMigration = (config: ts.CompilerOptions): MigrationCheck => {
  return {
    hasLegacyTarget: (config.target ?? 0) < ts.ScriptTarget.ES2020,
    hasLooseMode: !config.strict,
    hasImplicitAny: !config.noImplicitAny,
    hasUncheckedIndexAccess: !config.noUncheckedIndexedAccess,
  };
};
```

## CI/CD Integration

### Automated Type Checking

```yaml
# .github/workflows/type-check.yml
- name: TypeScript Check
  run: |
    # Parallel type checking across packages
    bun run --filter="./packages/*" check-types &
    bun run --filter="./apps/*" check-types &
    wait

- name: Declaration Generation
  run: |
    bun run build:types
    git diff --exit-code "*.d.ts" || exit 1
```

### Build Cache Optimization

```typescript
// Turbo configuration for TypeScript builds
{
  "tasks": {
    "check-types": {
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "tsconfig.json",
        "../../packages/typescript-config/**"
      ],
      "outputs": []
    },
    "build": {
      "dependsOn": ["check-types"],
      "inputs": ["src/**", "tsconfig.json"],
      "outputs": ["dist/**"]
    }
  }
}
```

This TypeScript configuration system provides a robust, performant, and maintainable foundation for type safety across the entire Eventer monorepo, with optimizations for both development experience and production builds.
