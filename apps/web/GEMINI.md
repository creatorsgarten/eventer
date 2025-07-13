# Web Application - Gemini Documentation

## Overview

The Eventer web application is the main landing page built with **Next.js 15** and **React 19**. It showcases the platform's capabilities with a focus on Thai event organizers, featuring modern design, responsive layout, and interactive components.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19 with Concurrent Features
- **Language**: TypeScript with strict mode
- **Styling**: CSS Modules with custom properties
- **Icons**: React Icons (Font Awesome, etc.)
- **Package Manager**: Bun
- **Development**: Turbo for fast refresh

## Project Structure

```
apps/web/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   └── (home)/              # Home route group
│   │       ├── page.tsx         # Landing page component
│   │       └── page.module.css  # Landing page styles
│   │
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Basic UI components
│   │   ├── sections/            # Page sections
│   │   └── shared/              # Shared components
│   │
│   ├── features/                # Feature-specific components
│   │   ├── landing/             # Landing page features
│   │   ├── auth/                # Authentication UI
│   │   └── events/              # Event management UI
│   │
│   ├── lib/                     # Utilities and configurations
│   │   ├── utils.ts             # Helper functions
│   │   ├── constants.ts         # App constants
│   │   └── types.ts             # TypeScript types
│   │
│   └── env.ts                   # Environment validation
│
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   ├── icons/                   # Icon files
│   └── logos/                   # Brand logos
│
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Key Features

### 1. Landing Page Sections

#### Hero Section

- **Animated Entry**: Staggered animations for text and images
- **Thai Content**: Native Thai language support
- **CTA Button**: Interactive button with hover effects
- **Mobile First**: Responsive design starting from mobile

#### Features Section

- **Feature Cards**: Highlighting key platform capabilities
- **Icon Integration**: Visual icons for each feature
- **Grid Layout**: Responsive card grid

#### Showcase Section

- **Interactive Demo**: Rotating showcase with auto-advance
- **Image Carousel**: Smooth transitions between demo images
- **Feature Descriptions**: Detailed explanations for each capability

#### Testimonials

- **Logo Carousel**: Infinite scrolling customer logos
- **Social Proof**: Building trust with potential users
- **Smooth Animation**: CSS-based infinite scroll

#### Call-to-Action

- **Email Signup**: Newsletter subscription form
- **Contact Information**: Easy ways to get in touch
- **Social Links**: Social media integration

### 2. Design System

#### CSS Custom Properties

```css
:root {
  --primary-gradient: linear-gradient(
    to right,
    #7f56d9 0%,
    #c091f3 39%,
    #7f56d9 100%
  );
  --feature-shadow: 0 4px 24px 0 rgba(80, 80, 120, 0.08);
  --spacing-base: 8px;
  --max-width: 1400px;
}
```

#### Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

#### Animation System

- **CSS Keyframes**: Smooth, performant animations
- **Intersection Observer**: Scroll-triggered animations
- **State-based**: React state controls animation timing

### 3. Component Architecture

#### Section Components

```typescript
// Reusable section pattern
const FeatureSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: "/calendar-feature.svg",
      title: "จัดการตารางเวลา ณ วันงาน",
      description: "ปรับเปลี่ยนตารางเวลาแบบเรียลไทม์..."
    }
  ];

  return (
    <section className={styles.featuresSection}>
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </section>
  );
};
```

#### Interactive Elements

```typescript
// Button with interaction states
const CTAButton: React.FC = () => {
  return (
    <button
      type="button"
      className={styles.ctaButton}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
      onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      ทดลองใช้เลย
    </button>
  );
};
```

## Development

### Local Development

```bash
cd apps/web

# Install dependencies (if not done at root)
bun install

# Start development server
bun dev

# Application runs on http://localhost:3000
```

### Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Build & Deployment

```bash
# Production build
bun run build

# Start production server
bun start

# Type checking
bun run check-types

# Linting
bun run lint
```

## Styling Approach

### CSS Modules

- **Scoped Styles**: Component-specific CSS classes
- **No Conflicts**: Automatic class name generation
- **Type Safety**: TypeScript integration for class names

### Design Tokens

```css
/* Consistent spacing */
.section {
  padding: calc(var(--spacing-base) * 8);
  gap: calc(var(--spacing-base) * 4);
}

/* Responsive typography */
.heroTitle {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
}
```

### Animation Patterns

```css
/* Smooth entrance animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animatedElement {
  animation: fadeInUp 0.8s ease-out forwards;
}
```

## Performance Optimizations

### Next.js Features

- **App Router**: Modern routing with layouts
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Automatic bundle optimization
- **Static Generation**: Pre-rendered pages for better performance

### React 19 Features

- **Concurrent Rendering**: Better user experience with non-blocking updates
- **Automatic Batching**: Optimized state updates
- **Suspense**: Loading states for better UX

### Asset Optimization

- **Image Formats**: WebP with fallbacks
- **Font Loading**: Optimized web font loading
- **CSS Optimization**: Purged unused styles in production
- **JavaScript**: Tree shaking and minification

## Content Strategy

### Thai Localization

- **Primary Language**: All content in Thai
- **Cultural Adaptation**: Thai event management terminology
- **Reading Patterns**: Right-to-left friendly layouts where needed

### SEO Optimization

- **Meta Tags**: Proper Open Graph and Twitter Card tags
- **Structured Data**: JSON-LD for rich snippets
- **Performance**: Core Web Vitals optimization
- **Accessibility**: WCAG 2.1 compliance

### Content Management

```typescript
// Content as data for easy updates
const features = [
  {
    icon: "/calendar-feature.svg",
    title: "จัดการตารางเวลา ณ วันงาน",
    description:
      "ปรับเปลี่ยนตารางเวลาแบบเรียลไทม์และสามารถ sync กับ Staff ทุกคนได้ทันที",
  },
];
```

## Testing Strategy

### Unit Testing

```bash
# Vitest for component testing
bun run test

# Watch mode for development
bun run test:watch

# UI testing mode
bun run test:ui
```

### E2E Testing

- **Playwright**: Cross-browser testing
- **User Flows**: Critical path testing
- **Visual Regression**: Screenshot comparison

### Accessibility Testing

- **axe-core**: Automated accessibility testing
- **Screen Reader**: Manual testing with assistive technology
- **Keyboard Navigation**: Full keyboard accessibility

## Deployment

### Production Build

```bash
# Optimized production build
bun run build

# Static export (if needed)
bun run export
```

### Hosting Options

- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative with edge functions
- **Docker**: Self-hosted containerized deployment

### Performance Monitoring

- **Core Web Vitals**: Real User Monitoring
- **Lighthouse**: Regular performance audits
- **Error Tracking**: Sentry for error monitoring

This web application serves as an effective landing page that showcases Eventer's capabilities while providing an excellent user experience for Thai event organizers.
