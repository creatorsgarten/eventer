# Web Application - Claude Technical Documentation

## System Architecture

### Application Framework

```typescript
// Next.js 15 App Router with React 19
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
};
```

### Technical Stack Analysis

#### Core Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0", // App Router, Image optimization
    "react": "^19.0.0", // Concurrent features, Suspense
    "react-dom": "^19.0.0", // Server Components
    "react-icons": "^5.4.0", // Icon system
    "typescript": "^5.8.2" // Strict type checking
  }
}
```

#### Development Toolchain

```json
{
  "devDependencies": {
    "@types/node": "^22.9.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "vitest": "^2.1.8", // Testing framework
    "eslint": "^9.15.0", // Code linting
    "turbo": "latest" // Monorepo build system
  }
}
```

## Component Architecture

### Page Structure

```typescript
// apps/web/src/app/(home)/page.tsx
interface LandingPageProps {
  className?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ className }) => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={`${styles.main} ${className || ''}`}>
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
};
```

### CSS Module System

```css
/* apps/web/src/app/(home)/page.module.css */
.main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-section);
  background: var(--background-gradient);
}

.heroSection {
  container-type: inline-size;
  padding: var(--spacing-hero);
  max-width: var(--max-width);
  margin: 0 auto;
}

@container (max-width: 768px) {
  .heroSection {
    padding: var(--spacing-mobile);
  }
}
```

### State Management Pattern

```typescript
// Stateful component for showcase carousel
const ShowcaseSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const demoItems = useMemo(() => [
    {
      id: 'agenda',
      title: 'จัดการ Agenda',
      image: '/agenda-demo.png',
      description: 'เพิ่ม ลบ แก้ไข กิจกรรมใน Agenda ได้แบบเรียลไทม์'
    }
  ], []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % demoItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, demoItems.length]);

  return (
    <section
      className={styles.showcaseSection}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Carousel implementation */}
    </section>
  );
};
```

## Performance Engineering

### Next.js 15 Optimizations

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
};

module.exports = nextConfig;
```

### Image Optimization Strategy

```typescript
import Image from 'next/image';

const OptimizedImage: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      {...props}
    />
  );
};
```

### CSS Performance

```css
/* Critical CSS inlined, non-critical loaded async */
:root {
  --primary-gradient: linear-gradient(
    to right,
    #7f56d9 0%,
    #c091f3 39%,
    #7f56d9 100%
  );
  --feature-shadow: 0 4px 24px 0 rgba(80, 80, 120, 0.08);
  --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* GPU-accelerated animations */
.animatedElement {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

@keyframes slideInFromBottom {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
```

## Development Environment

### TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"],
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### ESLint Configuration

```javascript
// eslint.config.js
import baseConfig from "@repo/eslint-config/base.js";
import nextConfig from "@repo/eslint-config/next.js";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...nextConfig,
];
```

### Vitest Setup

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
```

## Responsive Design System

### Container Query Implementation

```css
.heroContent {
  container-type: inline-size;
}

@container (min-width: 768px) {
  .heroTitle {
    font-size: 3rem;
    line-height: 1.1;
  }

  .heroLayout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
}

@container (max-width: 767px) {
  .heroTitle {
    font-size: 2rem;
    text-align: center;
  }

  .heroLayout {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}
```

### Fluid Typography

```css
/* Responsive type scale using clamp() */
.heroTitle {
  font-size: clamp(2rem, 4vw + 1rem, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.sectionTitle {
  font-size: clamp(1.5rem, 3vw + 1rem, 2.5rem);
  line-height: 1.2;
}

.bodyText {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.125rem);
  line-height: 1.6;
}
```

## Internationalization Strategy

### Thai Language Support

```typescript
// Thai typography considerations
const thaiTypography = {
  fontFamily: '"Noto Sans Thai", "Sarabun", system-ui, sans-serif',
  lineHeight: 1.7, // Increased for Thai scripts
  letterSpacing: "0.025em", // Improved readability
};

// Number formatting for Thai locale
const formatThaiNumber = (num: number): string => {
  return new Intl.NumberFormat("th-TH").format(num);
};

// Date formatting
const formatThaiDate = (date: Date): string => {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
```

### Content Structure

```typescript
// Structured content for easy translation
interface ContentSection {
  id: string;
  title: string;
  description: string;
  cta?: string;
}

const heroContent: ContentSection = {
  id: "hero",
  title: "จัดงานให้ง่าย บริหารให้เป็นระบบ",
  description:
    "แพลตฟอร์มที่ครบครันสำหรับการจัดงาน ตั้งแต่การวางแผน จนถึงการดำเนินงาน",
  cta: "ทดลองใช้เลย",
};
```

## Testing Strategy

### Component Testing

```typescript
// src/test/components/HeroSection.test.tsx
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/HeroSection';

describe('HeroSection', () => {
  it('renders hero content correctly', () => {
    render(<HeroSection />);

    expect(screen.getByRole('heading', { level: 1 }))
      .toHaveTextContent('จัดงานให้ง่าย บริหารให้เป็นระบบ');

    expect(screen.getByRole('button', { name: /ทดลองใช้/ }))
      .toBeInTheDocument();
  });

  it('handles CTA button interaction', async () => {
    const user = userEvent.setup();
    render(<HeroSection />);

    const ctaButton = screen.getByRole('button', { name: /ทดลองใช้/ });
    await user.click(ctaButton);

    // Test expected behavior
  });
});
```

### Visual Regression Testing

```typescript
// src/test/visual/pages.test.ts
import { test, expect } from "@playwright/test";

test.describe("Landing Page Visual Tests", () => {
  test("homepage renders correctly on desktop", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("homepage renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });
});
```

## Build & Deployment

### Production Build Process

```bash
#!/bin/bash
# Build script for production deployment

# Type checking
echo "🔍 Type checking..."
bun run check-types

# Linting
echo "🧹 Linting..."
bun run lint

# Testing
echo "🧪 Running tests..."
bun run test

# Build
echo "🏗️ Building application..."
bun run build

# Bundle analysis (optional)
echo "📊 Analyzing bundle..."
ANALYZE=true bun run build

echo "✅ Build complete!"
```

### Deployment Configuration

```dockerfile
# Dockerfile for containerized deployment
FROM oven/bun:1 AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["bun", "server.js"]
```

### Performance Monitoring

```typescript
// src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function reportWebVitals(metric: any) {
  // Send to analytics service
  if (process.env.NODE_ENV === "production") {
    // Google Analytics 4
    gtag("event", metric.name, {
      custom_map: { metric_name: "custom_metric" },
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      event_category: "Web Vitals",
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Initialize web vitals monitoring
export function initWebVitals() {
  getCLS(reportWebVitals);
  getFID(reportWebVitals);
  getFCP(reportWebVitals);
  getLCP(reportWebVitals);
  getTTFB(reportWebVitals);
}
```

This web application provides a high-performance, accessible, and maintainable landing page that effectively showcases the Eventer platform's capabilities while delivering an excellent user experience optimized for Thai users.
