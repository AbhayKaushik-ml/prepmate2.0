import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Check for the database URL and throw a clear error if it's missing.
if (!process.env.NEON_DATABASE_URL) {
  throw new Error('FATAL: NEON_DATABASE_URL environment variable is not set.');
}

const connectionString = process.env.NEON_DATABASE_URL;

// Configure the database client for a serverless environment.
// The 'postgres' library is smart and will manage connections automatically.
const client = postgres(connectionString, {
  ssl: 'require', // Required for Neon
  max: 1,         // Recommended for serverless to avoid exhausting connections
});

// Export the Drizzle instance for use in your application.
export const db = drizzle(client);
