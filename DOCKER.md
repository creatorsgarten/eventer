# Docker Deployment Guide

This guide explains how to build and deploy the Eventer application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Environment variables configured

## Quick Start

1. **Clone the repository and navigate to the project root:**

   ```bash
   cd /path/to/eventer
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.docker .env
   # Edit .env file with your actual values
   ```

3. **Build and run all services:**

   ```bash
   docker-compose up --build
   ```

4. **Access the applications:**
   - Web application: http://localhost:3000
   - Backend API: http://localhost:4000
   - Database: localhost:5432

## Individual Application Deployment

### Backend Application

1. **Build the backend Docker image:**

   ```bash
   cd apps/backend
   docker build -t eventer-backend .
   ```

2. **Run the backend container:**
   ```bash
   docker run -p 4000:4000 \
     -e DATABASE_URL="your_database_url" \
     -e SUPABASE_URL="your_supabase_url" \
     -e SUPABASE_KEY="your_supabase_key" \
     eventer-backend
   ```

### Web Application

1. **Build the web Docker image:**

   ```bash
   cd apps/web
   docker build -t eventer-web .
   ```

2. **Run the web container:**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
     -e NEXT_PUBLIC_BACKEND_URL="http://localhost:4000" \
     eventer-web
   ```

## Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase API key
- `PORT`: Port for the backend server (default: 4000)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:3000)

### Web

- `NEXT_PUBLIC_APP_URL`: Public URL of the web application
- `NEXT_PUBLIC_BACKEND_URL`: Public URL of the backend API

## Production Deployment

For production deployment, you may want to:

1. **Use environment-specific configurations:**

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Set up proper SSL certificates and reverse proxy (nginx/traefik)**

3. **Use external database services instead of the local PostgreSQL container**

4. **Configure proper backup and monitoring solutions**

## Database Migration

After starting the backend container, you may need to run database migrations:

```bash
docker exec -it eventer-backend-1 bun run db:migrate
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 4000, and 5432 are available
2. **Environment variables**: Verify all required environment variables are set
3. **Database connection**: Ensure the database is running and accessible
4. **Build failures**: Check that all dependencies are properly installed

### Logs

View logs for specific services:

```bash
docker-compose logs backend
docker-compose logs web
docker-compose logs db
```

## Development with Docker

For development with hot reloading:

```bash
# Override the default commands for development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This setup provides a complete containerized environment for the Eventer application with both backend and web components.
