// src/config/environment.ts




import mysql, { Pool } from 'mysql2/promise';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const hostname = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306; // Default to 3306 if not provided
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// Validate environment variables
if (!hostname || !database || !username || !password) {
  throw new Error('Missing required environment variables for database configuration');
}

export const dbConfig = {
  host: hostname,
  user: username,
  password: password,
  database: database,
  port: port,
};

export const createDbConnection = async (): Promise<Pool> => {
  const pool = mysql.createPool(dbConfig);

  try {
    await pool.getConnection();
    console.log('Connected to the database!');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }

  return pool;
};
