# ESLint Config - Gemini Documentation

## Overview

The `@eventer/eslint-config` package provides shared ESLint configurations for the Eventer monorepo. It ensures consistent code quality, style, and best practices across all JavaScript and TypeScript projects using the latest ESLint v9 flat config format.

## Tech Stack

- **ESLint**: Version 9.28.0 with flat config system
- **TypeScript ESLint**: Full TypeScript support with type-aware rules
- **React Support**: React 18+ with hooks validation
- **Next.js Integration**: Next.js specific linting rules
- **Prettier Integration**: Conflict-free Prettier compatibility

## Configuration Files

### 1. Base Configuration (`base.js`)

**Purpose**: Foundation ESLint configuration for all TypeScript projects

```javascript
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

export const config = [
  js.configs.recommended, // JavaScript best practices
  eslintConfigPrettier, // Prettier compatibility
  ...tseslint.configs.recommended, // TypeScript rules
  {
    plugins: {
      turbo: turboPlugin, // Turborepo-specific rules
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn", // Environment variable safety
    },
  },
  {
    plugins: {
      onlyWarn, // Convert errors to warnings
    },
  },
  {
    ignores: ["dist/**"], // Ignore build output
  },
];

export default config;
```

**Key Features**:

- **Foundation Rules**: JavaScript and TypeScript best practices
- **Turbo Integration**: Monorepo-specific linting rules
- **Warning Strategy**: Non-blocking development with `only-warn`
- **Build Ignores**: Exclude compiled output from linting
- **Prettier Compatibility**: No conflicts with code formatting

### 2. Next.js Configuration (`next.js`)

**Purpose**: Enhanced configuration for Next.js applications

```javascript
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

import { config as baseConfig } from "./base.js";

export const config = [
  ...baseConfig,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,

      // React specific rules
      "react/react-in-jsx-scope": "off", // React 17+ JSX transform
      "react/prop-types": "off", // TypeScript provides typing

      // Next.js optimizations
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];

export default config;
```

**Next.js Features**:

- **App Router Support**: Rules for Next.js 13+ App Router
- **Image Optimization**: Enforce Next.js Image component usage
- **Performance Rules**: Prevent common Next.js performance issues
- **SEO Rules**: Enforce SEO best practices
- **React 18 Support**: Modern React patterns and hooks

### 3. React Internal Configuration (`react-internal.js`)

**Purpose**: Configuration for internal React component libraries

```javascript
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

import { config as baseConfig } from "./base.js";

export const config = [
  ...baseConfig,
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // Library-specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "warn", // Component naming
      "react-hooks/exhaustive-deps": "warn", // Hook dependencies
    },
    settings: {
      react: {
        version: "detect", // Auto-detect React version
      },
    },
  },
];

export default config;
```

**Component Library Features**:

- **Hook Validation**: Comprehensive React hooks linting
- **Component Patterns**: Enforce consistent component structure
- **TypeScript Integration**: No prop-types needed with TypeScript
- **Display Names**: Better debugging with component names

## Package Configuration

### Dependencies Analysis

```json
{
  "devDependencies": {
    "@eslint/js": "^9.28.0", // Core ESLint rules
    "@next/eslint-plugin-next": "^15.3.0", // Next.js specific rules
    "eslint": "^9.28.0", // ESLint engine
    "eslint-config-prettier": "^10.1.1", // Prettier integration
    "eslint-plugin-only-warn": "^1.1.0", // Warning conversion
    "eslint-plugin-react": "^7.37.4", // React rules
    "eslint-plugin-react-hooks": "^5.2.0", // React hooks rules
    "eslint-plugin-turbo": "^2.5.0", // Turborepo rules
    "globals": "^16.2.0", // Global variables
    "typescript": "^5.8.2", // TypeScript support
    "typescript-eslint": "^8.33.0" // TypeScript ESLint
  }
}
```

### Export Strategy

```json
{
  "exports": {
    "./base": "./base.js", // Base configuration
    "./next-js": "./next.js", // Next.js configuration
    "./react-internal": "./react-internal.js" // React library config
  }
}
```

## Usage Patterns

### In Applications

**Next.js Web Application**:

```javascript
// apps/web/eslint.config.js
import baseConfig from "@eventer/eslint-config/base.js";
import nextConfig from "@eventer/eslint-config/next-js.js";

export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...nextConfig,
];
```

**Backend API**:

```javascript
// apps/backend/eslint.config.js
import baseConfig from "@eventer/eslint-config/base.js";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  ...baseConfig,
  {
    rules: {
      // Backend-specific rules
      "no-console": "off", // Allow console.log in backend
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
```

### In Packages

**UI Component Library**:

```javascript
// packages/ui/eslint.config.mjs
import baseConfig from "@eventer/eslint-config/base.js";
import reactConfig from "@eventer/eslint-config/react-internal.js";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      // Component library specific rules
      "react/display-name": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
];
```

## Rule Categories

### JavaScript/TypeScript Rules

**Code Quality**:

```javascript
{
  "no-unused-vars": "off",                    // Handled by TypeScript
  "@typescript-eslint/no-unused-vars": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/prefer-const": "error",
  "@typescript-eslint/no-var-requires": "error",
}
```

**Modern JavaScript**:

```javascript
{
  "prefer-const": "error",                    // Use const for non-reassigned
  "prefer-arrow-callback": "warn",            // Arrow functions preference
  "object-shorthand": "warn",                 // Object method shorthand
  "prefer-destructuring": "warn",             // Destructuring assignment
}
```

### React-Specific Rules

**Component Patterns**:

```javascript
{
  "react/function-component-definition": [
    "warn",
    {
      "namedComponents": "arrow-function",     // Consistent component style
      "unnamedComponents": "arrow-function"
    }
  ],
  "react/jsx-pascal-case": "error",           // Component naming
  "react/jsx-fragments": ["warn", "syntax"],  // Fragment syntax
}
```

**Hooks Rules**:

```javascript
{
  "react-hooks/rules-of-hooks": "error",      // Hook usage rules
  "react-hooks/exhaustive-deps": "warn",      // Dependency arrays
}
```

### Next.js Rules

**Performance**:

```javascript
{
  "@next/next/no-img-element": "warn",        // Use Next.js Image
  "@next/next/no-sync-scripts": "error",      // Async script loading
  "@next/next/no-css-tags": "error",          // Use CSS imports
}
```

**SEO & Accessibility**:

```javascript
{
  "@next/next/no-html-link-for-pages": "error", // Use Link component
  "@next/next/no-title-in-document-head": "error", // Proper head usage
}
```

## Development Workflow

### Local Development

**Running ESLint**:

```bash
# Lint all files
bun run lint

# Fix auto-fixable issues
bun run lint --fix

# Lint specific directory
bun run lint src/

# Check specific file types
bun run lint "**/*.{ts,tsx}"
```

**IDE Integration**:

```json
// .vscode/settings.json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Git Hooks Integration

**Lint-Staged Configuration**:

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

**Husky Pre-commit Hook**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bun run lint-staged
```

## Performance Optimization

### Caching Strategy

**ESLint Cache**:

```bash
# Enable caching for faster subsequent runs
eslint --cache --cache-location .eslintcache src/
```

**Turborepo Integration**:

```json
// turbo.json
{
  "tasks": {
    "lint": {
      "inputs": [
        "src/**/*.{js,jsx,ts,tsx}",
        "eslint.config.js",
        "../../packages/eslint-config/**"
      ],
      "outputs": []
    }
  }
}
```

### Parallel Execution

```bash
# Lint multiple packages in parallel
bun run --parallel lint
```

## Custom Rules

### Eventer-Specific Rules

**API Route Patterns**:

```javascript
{
  rules: {
    // Custom rule for API route naming
    "eventer/api-route-naming": "warn",

    // Enforce event type safety
    "eventer/typed-events": "error",

    // Database query optimization
    "eventer/efficient-queries": "warn",
  }
}
```

### Plugin Development

```javascript
// Custom plugin structure
const eventerPlugin = {
  meta: {
    name: "eslint-plugin-eventer",
    version: "1.0.0",
  },
  rules: {
    "api-route-naming": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Enforce API route naming conventions",
        },
      },
      create(context) {
        return {
          // Rule implementation
        };
      },
    },
  },
};
```

## Migration Guide

### From Legacy ESLint Config

**Before** (ESLint 8 with .eslintrc):

```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "next/core-web-vitals"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-unused-vars": "error"
  }
}
```

**After** (ESLint 9 Flat Config):

```javascript
import config from "@eventer/eslint-config/next-js.js";

export default [
  ...config,
  {
    rules: {
      // Override specific rules
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
```

### Migration Steps

1. ✅ Update to ESLint 9: `bun add -D eslint@^9`
2. ✅ Install config package: `bun add -D @eventer/eslint-config`
3. ✅ Replace `.eslintrc.*` with `eslint.config.js`
4. ✅ Update package.json scripts
5. ✅ Test configuration: `bun run lint`
6. ✅ Fix any new linting errors

This ESLint configuration package ensures consistent code quality, modern JavaScript practices, and framework-specific best practices across the entire Eventer monorepo.
