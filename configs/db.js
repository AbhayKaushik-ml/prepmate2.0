import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let dbInstance;

// This function provides a lazily-initialized database instance.
export function getDbConnection() {
  if (!dbInstance) {
    // Check for the database URL and throw a clear error if it's missing.
    if (!process.env.NEON_DATABASE_URL) {
      throw new Error('FATAL: NEON_DATABASE_URL environment variable is not set.');
    }

    const connectionString = process.env.NEON_DATABASE_URL;

    // Configure the database client for a serverless environment.
    const client = postgres(connectionString, {
      ssl: 'require', // Required for Neon
      max: 1,         // Recommended for serverless to avoid exhausting connections
    });

    dbInstance = drizzle(client);
  }
  return dbInstance;
}
