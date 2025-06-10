import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let dbInstance;

// This function provides a lazily-initialized database instance.
export const getDbConnection = () => {
  if (!dbInstance) {
    console.log("Attempting to create new database connection instance.");
    // Check for the database URL and throw a clear error if it's missing.
    if (!process.env.NEON_DATABASE_URL) {
      console.error("FATAL: NEON_DATABASE_URL environment variable is not set.");
      throw new Error('FATAL: NEON_DATABASE_URL environment variable is not set.');
    }
    console.log("NEON_DATABASE_URL is present. Initializing Neon connection.");
    const sql = neon(process.env.NEON_DATABASE_URL);
    console.log("Drizzling Neon connection with schema.");
    dbInstance = drizzle(sql, { schema });
    console.log("Database connection instance created successfully.");
  }
  return dbInstance;
};
