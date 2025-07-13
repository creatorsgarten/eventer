# UI Package - Claude Technical Documentation

## Component Library Architecture

### Module System Design

```typescript
// packages/ui/package.json export strategy
{
  "exports": {
    "./*": "./src/*.tsx"  // Direct file-based exports for tree-shaking
  }
}

// Consumption pattern in applications
import { Button } from "@eventer/ui/button";  // Direct import, optimal bundling
import { Card } from "@eventer/ui/card";      // Tree-shakeable
import { Code } from "@eventer/ui/code";      // Zero unused code
```

### TypeScript Configuration

```json
// packages/ui/tsconfig.json
{
  "extends": "@eventer/typescript-config/base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Component Implementation Analysis

### Button Component Architecture

```typescript
// src/button.tsx - Client-side interactive component
"use client";

import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;        // Telemetry/debugging identifier
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  // Event handler with app context
  const handleClick = () => {
    // Debug/telemetry hook
    alert(`Hello from your ${appName} app!`);

    // In production, this would be:
    // analytics.track('button_click', { app: appName, component: 'Button' });
  };

  return (
    <button
      type="button"              // Explicit button type
      className={className}      // Style injection point
      onClick={handleClick}      // Interaction handler
    >
      {children}
    </button>
  );
};
```

### Card Component Implementation

```typescript
// src/card.tsx - Link card with analytics
import type { JSX } from "react";

interface CardProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}

export function Card({
  className,
  title,
  children,
  href,
}: CardProps): JSX.Element {
  // UTM parameter injection for analytics tracking
  const enhancedHref = `${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`;

  return (
    <a
      className={className}
      href={enhancedHref}
      rel="noopener noreferrer"  // Security best practice
      target="_blank"            // External navigation
    >
      <h2>
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
```

### Code Component Structure

```typescript
// src/code.tsx - Semantic code display
import type { JSX } from "react";

interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

export function Code({
  children,
  className,
}: CodeProps): JSX.Element {
  return (
    <code
      className={className}
      // Future: add syntax highlighting props
      // data-language={language}
      // data-theme={theme}
    >
      {children}
    </code>
  );
}
```

## Build System Integration

### Turborepo Configuration

```typescript
// turbo/generators/config.ts
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("react-component", {
    description: "Adds a new React component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "Component name cannot include file extension";
          }
          if (input.includes(" ")) {
            return "Component name cannot include spaces";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{kebabCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
    ],
  });
}
```

### Component Template System

```handlebars
{{! templates/component.hbs }}
"use client"; import type { ReactNode } from "react"; interface
{{pascalCase name}}Props { children: ReactNode; className?: string; } export
const
{{pascalCase name}}
= ({ children, className }:
{{pascalCase name}}Props) => { return (
<div className="{className}">
  {children}
</div>
); };
```

## Workspace Integration Patterns

### Monorepo Dependency Resolution

```json
// Consumer package.json
{
  "dependencies": {
    "@eventer/ui": "workspace:*" // Automatic local linking
  }
}
```

### Build Pipeline Integration

```typescript
// Consuming app's next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@eventer/ui"], // Transpile for client components
  experimental: {
    optimizePackageImports: ["@eventer/ui"], // Tree-shaking optimization
  },
};
```

### TypeScript Path Resolution

```json
// Consuming app's tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@eventer/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

## Performance Engineering

### Bundle Optimization Strategy

```typescript
// Tree-shaking friendly exports
// ❌ Barrel exports (creates large bundles)
export * from "./button";
export * from "./card";
export * from "./code";

// ✅ Direct imports (optimal tree-shaking)
import { Button } from "@eventer/ui/button";
```

### Client-Side Hydration

```typescript
// Strategic "use client" placement
"use client"; // Only when component needs browser APIs

// Server Component compatible props
interface ComponentProps {
  // Serializable props only
  title: string;
  href: string;
  className?: string;
  children: React.ReactNode; // Server components can pass JSX
}
```

### Code Splitting Strategy

```typescript
// Lazy loading for heavy components
import { lazy, Suspense } from "react";

const HeavyChart = lazy(() => import("@eventer/ui/chart"));

// Usage with loading states
export const Dashboard = () => (
  <Suspense fallback={<ChartSkeleton />}>
    <HeavyChart data={chartData} />
  </Suspense>
);
```

## Testing Infrastructure

### Component Testing Framework

```typescript
// __tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/button';

describe('Button Component', () => {
  beforeEach(() => {
    // Mock console.log to prevent test noise
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with correct content', () => {
    render(
      <Button appName="test">
        Click me
      </Button>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick handler with app context', () => {
    const alertSpy = jest.spyOn(window, 'alert');

    render(<Button appName="web">Button</Button>);
    fireEvent.click(screen.getByRole('button'));

    expect(alertSpy).toHaveBeenCalledWith('Hello from your web app!');
  });

  it('applies custom className', () => {
    render(
      <Button appName="test" className="custom-class">
        Button
      </Button>
    );

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
```

### Visual Regression Testing

```typescript
// __tests__/visual.test.tsx
import { render } from '@testing-library/react';
import { Button, Card, Code } from '../src';

describe('Visual Regression Tests', () => {
  it('matches button snapshot', () => {
    const { container } = render(
      <Button appName="test" className="test-class">
        Test Button
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches card snapshot', () => {
    const { container } = render(
      <Card title="Test Card" href="https://example.com">
        Card content
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

## Advanced Component Patterns

### Compound Component Pattern

```typescript
// Future enhancement: Compound components
interface CardCompoundProps {
  children: React.ReactNode;
  className?: string;
}

const CardRoot = ({ children, className }: CardCompoundProps) => (
  <div className={`card ${className || ''}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <header className="card-header">{children}</header>
);

const CardBody = ({ children }: { children: React.ReactNode }) => (
  <div className="card-body">{children}</div>
);

const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <footer className="card-footer">{children}</footer>
);

// Compound component export
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

// Usage:
// <Card>
//   <Card.Header>Title</Card.Header>
//   <Card.Body>Content</Card.Body>
//   <Card.Footer>Actions</Card.Footer>
// </Card>
```

### Polymorphic Component Pattern

```typescript
// Advanced: Polymorphic button component
import { ComponentProps, ElementType, ReactNode } from "react";

type PolymorphicButtonProps<C extends ElementType> = {
  as?: C;
  children: ReactNode;
  className?: string;
} & ComponentProps<C>;

export const PolymorphicButton = <C extends ElementType = "button">({
  as,
  children,
  className,
  ...props
}: PolymorphicButtonProps<C>) => {
  const Component = as || "button";

  return (
    <Component className={`btn ${className || ''}`} {...props}>
      {children}
    </Component>
  );
};

// Usage:
// <PolymorphicButton>Button</PolymorphicButton>
// <PolymorphicButton as="a" href="/link">Link Button</PolymorphicButton>
// <PolymorphicButton as={NextLink} href="/next">Next.js Link</PolymorphicButton>
```

## Development Tooling

### ESLint Configuration

```javascript
// eslint.config.mjs
import baseConfig from "@eventer/eslint-config/base.js";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  ...baseConfig,
  {
    rules: {
      // Component-specific rules
      "react/prop-types": "off", // Using TypeScript
      "react/react-in-jsx-scope": "off", // React 17+ JSX transform
      "react-hooks/rules-of-hooks": "error", // Hook rules
      "react-hooks/exhaustive-deps": "warn", // Dependency arrays
    },
  },
];
```

### Development Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix",
    "check-types": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "generate:component": "turbo gen react-component",
    "clean": "rm -rf dist"
  }
}
```

## Deployment & Distribution

### Package Publishing (Future)

```json
// package.json for npm publishing
{
  "name": "@eventer/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./*": {
      "types": "./dist/*.d.ts",
      "default": "./dist/*.js"
    }
  },
  "files": ["dist"],
  "publishConfig": {
    "access": "public"
  }
}
```

### CI/CD Pipeline Integration

```yaml
# .github/workflows/ui-package.yml
name: UI Package CI

on:
  push:
    paths: ["packages/ui/**"]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Type check
        run: bun run check-types
        working-directory: packages/ui

      - name: Lint
        run: bun run lint
        working-directory: packages/ui

      - name: Test
        run: bun run test
        working-directory: packages/ui

      - name: Build
        run: bun run build
        working-directory: packages/ui
```

This UI package provides a solid foundation for shared component architecture across the Eventer monorepo, with emphasis on performance, type safety, and developer experience.
