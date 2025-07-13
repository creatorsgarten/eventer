# Backend API - Claude Documentation

## Technical Overview

The Eventer backend is a modern API server leveraging **Elysia.js** on **Bun runtime** for exceptional performance and developer experience. It serves as the core data layer for event management operations with a focus on type safety and maintainability.

## Architecture Decisions

### Framework Choice: Elysia.js

- **Performance**: ~10x faster than Express.js
- **Type Safety**: End-to-end TypeScript inference
- **Developer Experience**: Built-in validation, documentation, testing
- **Ecosystem**: Native Bun integration with modern APIs

### Runtime: Bun

- **Speed**: 3x faster startup, 20% faster execution than Node.js
- **Built-in Tools**: WebSocket, SQLite, test runner, bundler
- **Memory Efficiency**: Lower memory footprint
- **TypeScript Native**: No compilation step needed in development

### Database Strategy: Drizzle ORM

- **Type Safety**: Schema-first with generated types
- **Performance**: Minimal overhead, optimized queries
- **Migration**: Robust versioning and rollback support
- **Multi-database**: SQLite (dev), PostgreSQL/MySQL (production)

## Project Structure

```
apps/backend/
├── src/
│   ├── index.ts                    # Server bootstrap
│   ├── env.ts                      # Environment validation (Zod)
│   ├── client.ts                   # Database client configuration
│   │
│   ├── infrastructure/             # External concerns
│   │   ├── auth/                   # Authentication providers
│   │   │   ├── google.provider.ts
│   │   │   └── jwt.provider.ts
│   │   └── db/                     # Database layer
│   │       ├── index.ts            # Connection setup
│   │       ├── schema.ts           # Drizzle schemas
│   │       └── migrations/         # Version-controlled changes
│   │
│   ├── modules/                    # Domain modules (clean architecture)
│   │   ├── home/                   # Health/status endpoints
│   │   ├── auth/                   # Authentication logic
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dtos/
│   │   ├── user/                   # User management
│   │   │   ├── user.route.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.model.ts
│   │   │   └── dtos/
│   │   ├── event/                  # Event CRUD
│   │   └── agenda/                 # Schedule management
│   │
│   └── shared/                     # Cross-cutting concerns
│       ├── repository.ts           # Base repository with common patterns
│       ├── schemas.ts              # Shared Zod validation schemas
│       └── middleware/             # Custom middleware
│           ├── auth.middleware.ts
│           ├── cors.middleware.ts
│           └── validation.middleware.ts
│
├── drizzle/                        # Database artifacts
│   ├── migrations/                 # Generated SQL migrations
│   └── meta/                       # Migration metadata
│
├── drizzle.config.ts              # ORM configuration
├── vitest.config.ts               # Test configuration
└── package.json                   # Dependencies & scripts
```

## API Design Philosophy

### RESTful Conventions

- **Resource-based URLs**: `/api/events`, `/api/users`
- **HTTP Verbs**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Status Codes**: Consistent use of HTTP standards
- **Content-Type**: JSON for data exchange

### Error Handling

```typescript
// Consistent error response format
{
  error: true,
  code: "VALIDATION_ERROR",
  message: "Invalid email format",
  details: { field: "email", received: "invalid-email" }
}
```

### Pagination Strategy

```typescript
// Query parameters for pagination
GET /api/events?page=1&limit=20&sort=createdAt&order=desc

// Response format
{
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 156,
    totalPages: 8,
    hasNext: true,
    hasPrev: false
  }
}
```

## Module Architecture

### Route Layer

```typescript
// Clean, declarative route definitions
export const userRouter = new Elysia({ prefix: "/users" })
  .use(authMiddleware)
  .get("/", userController.list, {
    query: t.Object({
      page: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
    }),
  })
  .post("/", userController.create, {
    body: CreateUserSchema,
  });
```

### Service Layer

```typescript
// Business logic separation
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async createUser(dto: CreateUserDTO): Promise<UserResponse> {
    // Validation, business rules, side effects
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const user = await this.userRepository.create(dto);
    await this.emailService.sendWelcome(user.email);

    return this.toResponse(user);
  }
}
```

### Repository Pattern

```typescript
// Data access abstraction
export class UserRepository extends BaseRepository<UserType> {
  async findByEmail(email: string): Promise<UserType | null> {
    return this.db.select().from(users).where(eq(users.email, email)).get();
  }

  async findActiveUsers(): Promise<UserType[]> {
    return this.db.select().from(users).where(eq(users.isActive, true)).all();
  }
}
```

## Development Workflow

### Local Development

```bash
# Quick start
cd apps/backend
bun install
cp .env.example .env
bun run db:migrate
bun dev

# Development server runs on http://localhost:4000
# API documentation at http://localhost:4000/swagger
```

### Database Management

```bash
# Schema changes workflow
bun run db:generate     # Create migration from schema changes
bun run db:migrate      # Apply pending migrations
bun run db:studio       # Visual database browser

# Development utilities
bun run db:push         # Push schema without migration (dev only)
bun run db:pull         # Reverse engineer from existing DB
```

### Testing Strategy

```bash
# Unit tests with Vitest
bun run test           # Run once
bun run test:watch     # Watch mode for development
bun run test:coverage  # Generate coverage report

# Integration tests
bun run test:integration

# Type checking
bun run typecheck
```

## Performance Optimizations

### Database Performance

- **Connection Pooling**: Configured for concurrent load
- **Query Optimization**: Drizzle generates efficient SQL
- **Indexing Strategy**: Database indexes on frequently queried fields
- **Prepared Statements**: Automatic statement preparation and caching

### Runtime Performance

- **Bun Advantages**: Native speed improvements over Node.js
- **Memory Management**: Efficient garbage collection patterns
- **HTTP/2 Support**: Modern protocol support for better throughput
- **Streaming**: Large response streaming for file operations

### Caching Strategy

```typescript
// Multi-layer caching approach
class CacheService {
  // L1: In-memory for hot data
  private memoryCache = new Map();

  // L2: Redis for distributed caching
  private redisCache: RedisClient;

  // L3: Database with proper indexes
  async get(key: string) {
    return (
      this.memoryCache.get(key) ||
      (await this.redisCache.get(key)) ||
      (await this.database.query(key))
    );
  }
}
```

## Security Implementation

### Authentication Flow

1. **Login**: Email/password or OAuth (Google)
2. **JWT Generation**: Access token (15min) + Refresh token (7 days)
3. **Token Validation**: Middleware validates on protected routes
4. **Token Refresh**: Automatic refresh when access token expires

### Input Validation

```typescript
// Zod schemas for runtime validation
export const CreateEventSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().min(1),
  capacity: z.number().int().positive(),
});
```

### Security Headers

- **CORS**: Configurable origins for cross-origin requests
- **Rate Limiting**: Prevent abuse with request throttling
- **Helmet**: Security headers for common vulnerabilities
- **Input Sanitization**: XSS prevention on all user inputs

## Production Considerations

### Deployment Architecture

```yaml
# Docker composition for production
services:
  api:
    image: eventer-backend:latest
    replicas: 3
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://...

  database:
    image: postgres:15
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  nginx:
    image: nginx:alpine
    # Load balancer + SSL termination
```

### Monitoring & Observability

- **Health Checks**: `/api/health` endpoint for load balancer
- **Metrics**: Prometheus metrics for performance monitoring
- **Logging**: Structured JSON logs with correlation IDs
- **Error Tracking**: Sentry integration for error reporting
- **Performance**: APM tools for request tracing

### Scalability Patterns

- **Horizontal Scaling**: Stateless design allows multiple instances
- **Database Scaling**: Read replicas for query distribution
- **Caching**: Redis cluster for distributed caching
- **Queue Processing**: Background job processing for heavy operations

This backend architecture provides a robust, scalable foundation for the Eventer platform while maintaining excellent developer experience and performance characteristics.
