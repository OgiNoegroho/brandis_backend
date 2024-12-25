import { Pool } from "pg";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const hostname = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432; // Default to 5432 for PostgreSQL if not provided
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// Validate environment variables
if (!hostname || !database || !username || !password) {
  throw new Error(
    "Missing required environment variables for database configuration"
  );
}

const maxConnections = process.env.DB_MAX_CONNECTIONS
  ? parseInt(process.env.DB_MAX_CONNECTIONS)
  : 10; // Default to 10

export const dbConfig = {
  host: hostname,
  user: username,
  password: password,
  database: database,
  port: port,
  connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT
    ? Number(process.env.DB_CONNECTION_TIMEOUT)
    : 2000, // 2 seconds, ensure it's a number
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT
    ? Number(process.env.DB_IDLE_TIMEOUT)
    : 30000, // 30 seconds, ensure it's a number
  max: maxConnections, // Max connections in pool
  min: 0, // No minimum connections
};

export const createDbConnection = async (): Promise<Pool> => {
  const pool = new Pool(dbConfig);

  const connectWithRetry = async (retries: number = 5) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        await pool.connect();
        console.log("Connected to the PostgreSQL database!");
        return;
      } catch (err) {
        attempt++;
        console.error(`Connection attempt ${attempt} failed:`, err);
        if (attempt === retries) {
          console.error(
            "Max retry attempts reached. Could not connect to database."
          );
          throw err; // Re-throw the error after retries are exhausted
        }
        // Wait for some time before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Retry after 5 seconds
      }
    }
  };

  await connectWithRetry();

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down, closing database connection...");
    await pool.end(); // Close all connections in the pool
    console.log("Database connection closed");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, closing database connection...");
    await pool.end();
    console.log("Database connection closed");
    process.exit(0);
  });

  return pool;
};
