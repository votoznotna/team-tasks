import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection string
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DATABASE_USER || 'postgres'}:${
    process.env.DATABASE_PASSWORD || 'postgres'
  }@${process.env.DATABASE_HOST || 'localhost'}:${
    process.env.DATABASE_PORT || '5432'
  }/${process.env.DATABASE_NAME || 'team_tasks'}`;

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export schema for convenience
export * from './schema';
