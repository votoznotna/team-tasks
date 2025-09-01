# Database Setup Guide

This project uses PostgreSQL with Drizzle ORM for data persistence.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm

## Quick Start

### 1. Start PostgreSQL Database

```bash
# Start the PostgreSQL container
docker-compose up -d

# Check if the database is running
docker-compose ps
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/team_tasks
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=team_tasks
```

### 3. Database Setup

```bash
# Generate and run migrations
npm run db:generate
npm run db:push

# Seed the database with initial data
npm run db:seed
```

## Database Schema

### Tables

#### `columns`

- `id` - UUID primary key
- `title` - Column title (e.g., "Todo", "In Progress", "Done")
- `order` - Display order
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### `tasks`

- `id` - UUID primary key
- `title` - Task title
- `description` - Task description
- `priority` - Priority level (low, medium, high)
- `assignee` - Assigned team member
- `dueDate` - Due date (optional)
- `columnId` - Foreign key to columns table
- `order` - Display order within column
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Available Scripts

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with initial data

## Database Management

### View Database in Drizzle Studio

```bash
npm run db:studio
```

This will open a web interface at `https://local.drizzle.studio` where you can:

- View and edit data
- Run queries
- Manage schema

**Note**: Drizzle Studio uses a tunnel service, so the interface is accessible at `https://local.drizzle.studio` rather than a localhost port.

### Reset Database

```bash
# Stop and remove containers
docker-compose down -v

# Start fresh
docker-compose up -d

# Re-run setup
npm run db:push
npm run db:seed
```

## Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: team_tasks
- **Username**: postgres
- **Password**: postgres

## Troubleshooting

### Database Connection Issues

1. Ensure Docker is running
2. Check if PostgreSQL container is healthy:
   ```bash
   docker-compose ps
   ```
3. Verify environment variables in `.env.local`
4. Check logs:
   ```bash
   docker-compose logs postgres
   ```

### Migration Issues

1. Reset database if schema is corrupted:

   ```bash
   docker-compose down -v
   docker-compose up -d
   npm run db:push
   ```

2. Check migration files in `lib/db/migrations/`

### Performance Tips

- Use indexes for frequently queried columns
- Consider connection pooling for production
- Monitor query performance with Drizzle Studio
