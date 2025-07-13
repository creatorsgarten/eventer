# UI Package - Gemini Documentation

## Overview

The `@eventer/ui` package is a shared React component library that provides reusable UI components across the Eventer monorepo. Built with **React 19** and **TypeScript**, it ensures consistency and maintainability across all applications.

## Tech Stack

- **Framework**: React 19 (Client Components)
- **Language**: TypeScript with strict mode
- **Build System**: Turborepo with TypeScript compilation
- **Package Manager**: Bun with workspace protocol
- **Code Quality**: ESLint with shared configuration

## Project Structure

```
packages/ui/
├── src/
│   ├── button.tsx           # Interactive button component
│   ├── card.tsx             # Link card component
│   └── code.tsx             # Code display component
│
├── turbo/
│   └── generators/          # Component generators
│       └── config.ts        # Turbo generator configuration
│
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── eslint.config.mjs       # ESLint configuration
```

## Available Components

### 1. Button Component

**Purpose**: Interactive button with customizable styling and behavior

```typescript
interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string; // For debugging/tracking which app uses the button
}

// Usage example
<Button className="primary-button" appName="web">
  Click Me
</Button>
```

**Features**:

- Client-side component (`"use client"`)
- Built-in click handler with app identification
- Flexible styling via className prop
- TypeScript interface for type safety
- Supports any ReactNode as children

### 2. Card Component

**Purpose**: Navigation card component for external links

```typescript
interface CardProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string; // External URL
}

// Usage example
<Card
  title="Documentation"
  href="https://docs.example.com"
  className="doc-card"
>
  Learn how to use our platform
</Card>
```

**Features**:

- Automatic UTM parameter injection for analytics
- External link handling (`target="_blank"`, `rel="noopener noreferrer"`)
- Semantic HTML structure with h2 title
- Arrow indicator for external links
- SEO-friendly link structure

### 3. Code Component

**Purpose**: Inline code display with styling support

```typescript
interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

// Usage example
<Code className="syntax-highlight">
  npm install @eventer/ui
</Code>
```

**Features**:

- Simple semantic `<code>` element wrapper
- Customizable styling via className
- Supports any ReactNode content
- Accessible code presentation

## Package Configuration

### Dependencies

```json
{
  "dependencies": {
    "react": "^19.1.0", // Latest React with concurrent features
    "react-dom": "^19.1.0" // React DOM rendering
  },
  "devDependencies": {
    "@eventer/eslint-config": "workspace:*", // Shared ESLint rules
    "@eventer/typescript-config": "workspace:*", // Shared TypeScript config
    "@turbo/gen": "^2.5.0", // Component generation
    "typescript": "5.8.2" // TypeScript compiler
  }
}
```

### Export Strategy

```json
{
  "exports": {
    "./*": "./src/*.tsx" // Direct file-based exports
  }
}
```

This export pattern allows importing components directly:

```typescript
// In consuming applications
import { Button } from "@eventer/ui/button";
import { Card } from "@eventer/ui/card";
import { Code } from "@eventer/ui/code";
```

## Development Workflow

### Adding New Components

1. **Create Component File**:

```bash
cd packages/ui/src
touch new-component.tsx
```

2. **Use Turbo Generator** (Recommended):

```bash
# From package root
bun run generate:component

# This will prompt for component name and generate boilerplate
```

3. **Component Template**:

```typescript
"use client"; // If component uses browser APIs

import type { ReactNode } from "react";

interface NewComponentProps {
  children: ReactNode;
  className?: string;
  // Add specific props here
}

export const NewComponent = ({
  children,
  className,
  ...props
}: NewComponentProps) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
```

### Code Quality Checks

```bash
# Type checking
bun run check-types

# Linting
bun run lint

# Fix linting issues automatically
bun run lint --fix
```

### Testing Components

```typescript
// Example test structure (when testing is added)
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button appName="test">Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies custom className', () => {
    render(<Button appName="test" className="custom">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });
});
```

## Integration with Applications

### Installation in Apps

Components are automatically available in monorepo apps through workspace resolution:

```json
// In app package.json
{
  "dependencies": {
    "@eventer/ui": "workspace:*"
  }
}
```

### Usage Examples

**In Next.js App (Web)**:

```typescript
// apps/web/src/app/page.tsx
import { Button } from "@eventer/ui/button";
import { Card } from "@eventer/ui/card";

export default function HomePage() {
  return (
    <div>
      <Card
        title="Get Started"
        href="https://docs.eventer.dev"
        className="welcome-card"
      >
        Learn how to use Eventer platform
      </Card>

      <Button appName="web" className="cta-button">
        Try Now
      </Button>
    </div>
  );
}
```

**In Backend API Documentation**:

```typescript
// apps/backend/src/docs/components.tsx
import { Code } from "@eventer/ui/code";

export const APIExample = () => {
  return (
    <div>
      <h3>API Usage</h3>
      <Code className="api-example">
        {`curl -X POST /api/events -H "Content-Type: application/json"`}
      </Code>
    </div>
  );
};
```

## Design System Integration

### Styling Approach

The UI package provides **unstyled components** with className support, allowing each app to apply its own design system:

```typescript
// App-specific styling
<Button
  appName="web"
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
>
  Styled Button
</Button>
```

### Theme Integration

```typescript
// Example theme provider integration
interface ThemeProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

// Enhanced button with theme support
export const ThemedButton = ({
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps & ThemeProps) => {
  const themeClasses = `btn btn-${variant} btn-${size}`;

  return (
    <Button
      className={`${themeClasses} ${props.className || ''}`}
      {...props}
    />
  );
};
```

## Performance Considerations

### Bundle Optimization

- **Tree Shaking**: Individual component imports prevent unused code
- **Client Components**: Minimal "use client" directives for optimal SSR
- **TypeScript**: Zero runtime overhead with compile-time type checking

### Loading Strategy

```typescript
// Lazy loading for heavy components
const HeavyChart = lazy(() => import("@eventer/ui/chart"));

// Usage with Suspense
<Suspense fallback={<div>Loading chart...</div>}>
  <HeavyChart data={chartData} />
</Suspense>
```

## Future Enhancements

### Planned Components

1. **Form Components**: Input, Select, Checkbox, Radio
2. **Layout Components**: Container, Grid, Flex
3. **Navigation Components**: Menu, Breadcrumb, Pagination
4. **Feedback Components**: Alert, Toast, Modal, Tooltip
5. **Data Display**: Table, List, Badge, Avatar

### Design System Evolution

1. **CSS-in-JS Integration**: Styled-components or Emotion support
2. **Theme Provider**: Centralized theming system
3. **Icon Library**: SVG icon components
4. **Animation Library**: Framer Motion integration
5. **Accessibility**: ARIA patterns and screen reader optimization

### Development Tools

1. **Storybook**: Component documentation and testing
2. **Visual Testing**: Chromatic for visual regression testing
3. **Unit Testing**: Jest and React Testing Library setup
4. **Bundle Analysis**: Size tracking and optimization

This UI package serves as the foundation for consistent, reusable components across the Eventer platform, promoting design system consistency and development efficiency.
