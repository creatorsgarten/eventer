# Backend API - Gemini Documentation

## Overview

The Eventer backend is a high-performance API server built with **Elysia.js** running on **Bun**. It provides RESTful endpoints for event management, user authentication, and real-time data synchronization.

## Architecture

### Tech Stack

- **Framework**: Elysia.js (fast, type-safe web framework)
- **Runtime**: Bun (JavaScript runtime, faster than Node.js)
- **Database**: Drizzle ORM with SQLite/PostgreSQL/MySQL support
- **Validation**: Zod schemas for request/response validation
- **API Documentation**: Swagger/OpenAPI auto-generation
- **Testing**: Vitest for unit testing

### Project Structure

```
apps/backend/
├── src/
│   ├── index.ts                 # Main server entry point
│   ├── env.ts                   # Environment configuration
│   ├── client.ts                # Database client setup
│   ├── infrastructure/
│   │   ├── auth/                # Authentication providers
│   │   └── db/                  # Database schemas & migrations
│   ├── modules/                 # Feature modules
│   │   ├── home/                # Home/health endpoints
│   │   ├── auth/                # Authentication routes
│   │   ├── user/                # User management
│   │   ├── event/               # Event CRUD operations
│   │   └── agenda/              # Schedule management
│   └── shared/                  # Shared utilities
│       ├── repository.ts        # Base repository pattern
│       ├── schemas.ts           # Common Zod schemas
│       └── middleware/          # Custom middleware
├── drizzle/                     # Database migrations
├── drizzle.config.ts           # Drizzle configuration
└── vitest.config.ts            # Test configuration
```

## Key Features

### 1. Modular Architecture

Each feature is organized in its own module with clear separation:

- **Routes**: HTTP endpoint definitions
- **Services**: Business logic implementation
- **DTOs**: Data Transfer Objects with validation
- **Models**: Database entity definitions
- **Repositories**: Data access layer

### 2. Type Safety

- End-to-end TypeScript with strict mode
- Zod schemas for runtime validation
- Elysia's built-in type inference
- Shared types between frontend and backend

### 3. Database Management

- **Drizzle ORM**: Type-safe SQL query builder
- **Migrations**: Version-controlled schema changes
- **Multiple DB Support**: SQLite (dev), PostgreSQL/MySQL (prod)
- **Connection Pooling**: Optimized database performance

## API Endpoints

### Base URL

- **Development**: `http://localhost:4000/api`
- **Documentation**: `http://localhost:4000/swagger`

### Module Routes

#### Home (`/api/`)

- `GET /` - Health check and API status

#### Authentication (`/api/auth/`)

- `POST /login` - User login
- `POST /logout` - User logout
- `POST /register` - User registration
- `GET /me` - Get current user profile

#### Users (`/api/users/`)

- `GET /` - List users (with pagination)
- `GET /:id` - Get user by ID
- `POST /` - Create new user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

#### Events (`/api/events/`)

- `GET /` - List events
- `GET /:id` - Get event details
- `POST /` - Create event
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event

#### Agenda (`/api/agenda/`)

- `GET /events/:eventId/agenda` - Get event schedule
- `POST /events/:eventId/agenda` - Add agenda item
- `PUT /agenda/:id` - Update agenda item
- `DELETE /agenda/:id` - Delete agenda item

## Development

### Local Setup

```bash
cd apps/backend

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env with your database configuration

# Run database migrations
bun run db:migrate

# Start development server
bun dev
```

### Environment Variables

```bash
PORT=4000
NODE_ENV=development
DATABASE_URL="sqlite:./dev.db"
CORS_ORIGIN="http://localhost:3000"
JWT_SECRET="your-secret-key"
```

### Database Commands

```bash
bun run db:generate      # Generate new migration
bun run db:migrate       # Apply migrations
bun run db:push          # Push schema changes (dev only)
bun run db:pull          # Pull schema from database
bun run db:studio        # Open Drizzle Studio
```

### Testing

```bash
bun run test            # Run all tests
bun run test:watch      # Watch mode
bun run typecheck       # TypeScript validation
```

## Code Patterns

### Route Definition

```typescript
import { Elysia } from "elysia";
import { authMiddleware } from "#backend/shared/middleware";

export const userRouter = new Elysia({ prefix: "/users" })
  .use(authMiddleware)
  .get("/", async ({ query }) => {
    // Implementation
  })
  .post("/", async ({ body }) => {
    // Implementation
  });
```

### Service Layer

```typescript
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(dto: CreateUserDTO): Promise<UserType> {
    // Business logic here
    return this.userRepository.create(dto);
  }
}
```

### Repository Pattern

```typescript
export class UserRepository extends BaseRepository<UserType> {
  constructor() {
    super(users); // Drizzle table
  }

  async findByEmail(email: string): Promise<UserType | null> {
    return this.db.select().from(users).where(eq(users.email, email)).get();
  }
}
```

## Performance Considerations

### Bun Runtime

- **Fast Startup**: ~3x faster than Node.js
- **Built-in APIs**: WebSocket, SQLite, bundler included
- **TypeScript Support**: Native TypeScript execution

### Database Optimization

- **Connection Pooling**: Configured for production loads
- **Query Optimization**: Drizzle generates efficient SQL
- **Indexing**: Strategic database indexes for performance

### Caching Strategy

- **In-memory**: Frequently accessed data
- **Redis**: Session storage and distributed caching
- **HTTP**: Proper cache headers for static resources

## Security Features

### Authentication

- **JWT Tokens**: Stateless authentication
- **Refresh Tokens**: Secure token rotation
- **Password Hashing**: Bcrypt with salt rounds
- **Session Management**: Secure session handling

### Input Validation

- **Zod Schemas**: Runtime validation for all inputs
- **SQL Injection Prevention**: Drizzle ORM protection
- **XSS Protection**: Input sanitization
- **CORS**: Configurable cross-origin policies

### Authorization

- **Role-based Access**: User roles and permissions
- **Resource Ownership**: Users can only access their data
- **API Rate Limiting**: Prevent abuse and DoS attacks

## Deployment

### Production Build

```bash
bun run build          # Build for production
bun run start          # Start production server
```

### Docker Support

```dockerfile
FROM oven/bun:1.2.8

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 4000
CMD ["bun", "run", "start"]
```

### Environment Configuration

- **Staging**: PostgreSQL with connection pooling
- **Production**: Clustered deployment with load balancer
- **Monitoring**: Health checks and error tracking
- **Logging**: Structured logging with correlation IDs

This backend provides a solid foundation for the Eventer platform with excellent performance, type safety, and maintainability.
