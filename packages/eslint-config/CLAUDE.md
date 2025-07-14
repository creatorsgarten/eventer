# ESLint Config - Claude Technical Documentation

## Flat Configuration Architecture

### ESLint 9 Migration Strategy

```javascript
// packages/eslint-config/base.js - Modern flat config
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint configuration using flat config format
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  // Foundation configurations
  js.configs.recommended, // ESLint recommended rules
  eslintConfigPrettier, // Disable formatting conflicts
  ...tseslint.configs.recommended, // TypeScript-aware rules

  // Plugin configurations
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn", // Monorepo env safety
    },
  },

  // Development experience optimization
  {
    plugins: {
      onlyWarn, // Convert errors to warnings
    },
  },

  // Global ignores
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js"],
  },
];

export default config;
```

### Framework-Specific Extensions

#### Next.js Configuration Analysis

```javascript
// packages/eslint-config/next.js
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

import { config as baseConfig } from "./base.js";

export const config = [
  ...baseConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      // React 18+ patterns
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,

      // Modern React optimizations
      "react/react-in-jsx-scope": "off", // React 17+ JSX transform
      "react/prop-types": "off", // TypeScript supersedes PropTypes
      "react/display-name": "warn", // Debug-friendly components

      // Next.js performance rules
      "@next/next/no-img-element": "warn", // Enforce Image component
      "@next/next/no-sync-scripts": "error", // Async script loading
      "@next/next/no-html-link-for-pages": "error", // Use Link component
      "@next/next/no-css-tags": "error", // CSS import pattern

      // Hook optimization
      "react-hooks/exhaustive-deps": "warn", // Dependency array completeness
      "react-hooks/rules-of-hooks": "error", // Hook call rules
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly", // Global React for JSX
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect", // Auto-detect React version
      },
    },
  },
];
```

#### React Library Configuration

```javascript
// packages/eslint-config/react-internal.js
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

import { config as baseConfig } from "./base.js";

export const config = [
  ...baseConfig,
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // Component library specific rules
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // Library development patterns
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "error", // Required for dev tools
      "react/no-unknown-property": "error", // Prevent typos
      "react/jsx-key": "error", // List rendering safety

      // Hook patterns for libraries
      "react-hooks/exhaustive-deps": "error", // Strict dependency arrays
      "react-hooks/rules-of-hooks": "error",

      // Component API consistency
      "react/function-component-definition": [
        "warn",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
```

## TypeScript Integration Deep Dive

### Type-Aware Linting Configuration

```javascript
// Advanced TypeScript ESLint configuration
import tseslint from "typescript-eslint";

export const typescriptConfig = tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true, // Automatic project detection
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Type safety enforcement
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Allow unused args with _
          varsIgnorePattern: "^_",
        },
      ],

      // Modern TypeScript patterns
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/strict-boolean-expressions": "warn",

      // Import organization
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // Separate type imports
          fixStyle: "separate-type-imports",
        },
      ],

      // Function declarations
      "@typescript-eslint/explicit-function-return-type": "off", // Inferred types OK
      "@typescript-eslint/no-inferrable-types": "error", // Remove redundant types
    },
  }
);
```

### Performance Optimizations

```javascript
// Type-checking performance configuration
export const performanceConfig = {
  languageOptions: {
    parserOptions: {
      // Project service for better performance
      projectService: {
        allowDefaultProject: ["*.js", "*.mjs"],
        defaultProject: "./tsconfig.json",
      },

      // Cache configuration
      cacheLifetime: {
        glob: "Infinity", // Cache glob results
      },
    },
  },

  // Selective type checking
  rules: {
    "@typescript-eslint/await-thenable": "error", // Requires type info
    "@typescript-eslint/no-floating-promises": "error", // Requires type info
    "@typescript-eslint/no-misused-promises": "error", // Requires type info
  },
};
```

## Monorepo Integration Patterns

### Turborepo Plugin Configuration

```javascript
// Turborepo-specific linting rules
import turboPlugin from "eslint-plugin-turbo";

export const turboConfig = {
  plugins: {
    turbo: turboPlugin,
  },
  rules: {
    // Environment variable validation
    "turbo/no-undeclared-env-vars": "warn",

    // Workspace dependency validation
    "turbo/no-workspace-cycles": "error",

    // Build optimization
    "turbo/no-dynamic-imports": "warn", // Static analysis friendly
  },
  settings: {
    turbo: {
      rootDir: "../../", // Monorepo root
    },
  },
};
```

### Workspace-Aware Configuration

```javascript
// Cross-package import validation
export const workspaceConfig = {
  rules: {
    // Prevent circular dependencies
    "import/no-cycle": ["error", { maxDepth: 2 }],

    // Workspace protocol validation
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^@eventer/"], // Workspace packages
      },
    ],

    // Internal import organization
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Node.js builtins
          "external", // npm packages
          "internal", // Workspace packages
          "parent", // Parent directory
          "sibling", // Same directory
          "index", // Index files
        ],
        pathGroups: [
          {
            pattern: "@eventer/**",
            group: "internal",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
      },
    ],
  },
};
```

## Development Experience Optimization

### Warning-Only Development Mode

```javascript
// eslint-plugin-only-warn integration
import onlyWarn from "eslint-plugin-only-warn";

export const developmentConfig = {
  plugins: {
    onlyWarn,
  },
  // Automatically converts all errors to warnings
  // Allows development to continue without blocking
  // CI/CD can still enforce errors
};

// CI-specific configuration override
export const ciConfig = {
  rules: {
    // Restore errors in CI environment
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "error",
  },
};
```

### IDE Integration Patterns

```javascript
// VSCode ESLint configuration
// .vscode/settings.json
{
  "eslint.experimental.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "eslint.codeAction.showDocumentation": {
    "enable": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Build System Integration

### Turborepo Task Configuration

```json
// turbo.json - ESLint task optimization
{
  "tasks": {
    "lint": {
      "inputs": [
        "src/**/*.{js,jsx,ts,tsx}",
        "eslint.config.js",
        "../../packages/eslint-config/**/*.js",
        "../../packages/typescript-config/**/*.json"
      ],
      "outputs": [],
      "cache": true,
      "persistent": false
    },

    "lint:fix": {
      "inputs": ["src/**/*.{js,jsx,ts,tsx}", "eslint.config.js"],
      "outputs": ["src/**/*.{js,jsx,ts,tsx}"],
      "cache": false
    }
  }
}
```

### Parallel Execution Strategy

```bash
#!/bin/bash
# Parallel linting across workspace packages

# Function to run ESLint with error handling
lint_package() {
  local package_path=$1
  echo "Linting $package_path..."

  cd "$package_path" || exit 1

  if bun run lint; then
    echo "✅ $package_path linted successfully"
  else
    echo "❌ $package_path linting failed"
    return 1
  fi
}

# Export function for parallel execution
export -f lint_package

# Parallel execution with xargs
find apps packages -name "package.json" -not -path "*/node_modules/*" \
  | xargs -I {} dirname {} \
  | xargs -P 4 -I {} bash -c 'lint_package "{}"'
```

## Custom Rule Development

### Eventer-Specific Rules

```javascript
// Custom ESLint rule for API route validation
const apiRouteRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce API route naming and structure conventions",
      category: "Best Practices",
    },
    fixable: "code",
    schema: [],
  },

  create(context) {
    return {
      FunctionDeclaration(node) {
        // Validate API route handler naming
        if (context.getFilename().includes("/api/")) {
          const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

          if (!validMethods.includes(node.id.name)) {
            context.report({
              node,
              message: `API route handler must be named after HTTP method (${validMethods.join(", ")})`,
              fix(fixer) {
                // Auto-fix suggestion
                return fixer.replaceText(node.id, "GET");
              },
            });
          }
        }
      },
    };
  },
};

// Plugin structure
export const eventerPlugin = {
  meta: {
    name: "eslint-plugin-eventer",
    version: "1.0.0",
  },
  rules: {
    "api-route-naming": apiRouteRule,
    "typed-events": typedEventsRule,
    "database-safety": databaseSafetyRule,
  },
};
```

### Plugin Testing Framework

```javascript
// ESLint rule testing
import { RuleTester } from "eslint";
import { apiRouteRule } from "./rules/api-route-naming.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

ruleTester.run("api-route-naming", apiRouteRule, {
  valid: [
    {
      code: "export function GET(request) { return Response.json({}); }",
      filename: "/api/users/route.ts",
    },
  ],
  invalid: [
    {
      code: "export function handleUsers(request) { return Response.json({}); }",
      filename: "/api/users/route.ts",
      errors: [
        { message: "API route handler must be named after HTTP method" },
      ],
    },
  ],
});
```

## Performance Monitoring

### Linting Performance Analysis

```javascript
// ESLint performance profiling
import { ESLint } from "eslint";

const eslint = new ESLint({
  overrideConfigFile: "eslint.config.js",
  // Performance monitoring options
  cache: true,
  cacheLocation: ".eslintcache",
  cacheStrategy: "metadata",

  // Timing information
  reportUnusedDisableDirectives: "error",
});

// Custom performance reporting
const lintWithTiming = async (filePaths) => {
  const startTime = performance.now();

  const results = await eslint.lintFiles(filePaths);

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`Linting completed in ${duration.toFixed(2)}ms`);
  console.log(`Files processed: ${filePaths.length}`);
  console.log(
    `Average time per file: ${(duration / filePaths.length).toFixed(2)}ms`
  );

  return results;
};
```

### Cache Strategy Optimization

```javascript
// Advanced caching configuration
export const cacheConfig = {
  cache: true,
  cacheLocation: ".eslintcache",
  cacheStrategy: "content", // Hash-based caching

  // Cache invalidation triggers
  cacheLifetime: 86400000, // 24 hours

  // Selective caching
  ignorePatterns: [
    "**/*.d.ts", // Skip declaration files
    "**/dist/**", // Skip build output
    "**/coverage/**", // Skip test coverage
  ],
};
```

This ESLint configuration system provides comprehensive code quality enforcement, modern JavaScript/TypeScript support, and optimized development experience across the entire Eventer monorepo.
