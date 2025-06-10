import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Database initialization function with error handling
function initializeDatabase() {
  try {
    // Check if the required environment variables are set
    if (!process.env.NEON_DATABASE_URL) {
      // In production, this is a fatal error. The app cannot run without a database.
      if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: NEON_DATABASE_URL environment variable is not set in production.');
      }

      // In non-production environments, warn and return a mock DB for local development.
      console.warn('NEON_DATABASE_URL environment variable is not set. Database features will be disabled.');
      return {
        select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
        insert: () => ({ values: () => ({ returning: () => [{ id: 1, name: 'Mock User', email: 'mock@example.com', isMember: false }] }) }),
        // Add other methods as needed
      };
    }

    // Create the connection with serverless-optimized settings
    const connectionString = process.env.NEON_DATABASE_URL;
    const client = postgres(connectionString, {
      ssl: 'require',
      max: 1 // Recommended for serverless environments to avoid exhausting connections
    });
    return drizzle(client);
  } catch (error) {
    console.error('Error initializing database:', error);
    // In production, a DB connection error is fatal.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`FATAL: Database connection failed: ${error.message}`);
    }
    // Return a mock DB object in non-production environments
    return {
      select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
      insert: () => ({ values: () => ({ returning: () => [{ id: 1, name: 'Mock User', email: 'mock@example.com', isMember: false }] }) }),
      // Add other methods as needed
    };
  }
}

export const db = initializeDatabase();
