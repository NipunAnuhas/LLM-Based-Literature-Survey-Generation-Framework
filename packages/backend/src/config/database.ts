import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5436', 10),
  database: process.env.DB_NAME || 'literature_survey',
  user: process.env.DB_USER || 'litsurvey',
  password: process.env.DB_PASSWORD || 'litsurvey_dev_password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection cannot be established
};

// Create connection pool
const pool = new Pool(poolConfig);

// Log pool-level errors but never crash the process — the backend is
// designed to fall back to demo mode when Postgres is unreachable.
pool.on('error', (err) => {
  console.error('Postgres pool error (continuing):', err.message);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);

  // Monkey patch the query method to add logging
  client.query = (...args: any[]) => {
    const start = Date.now();
    // @ts-ignore
    return originalQuery(...args).then((result) => {
      const duration = Date.now() - start;
      console.log('Executed query', { duration, rows: result.rowCount });
      return result;
    });
  };

  // Monkey patch the release method to prevent double-release
  let released = false;
  client.release = () => {
    if (released) {
      console.warn('Client already released');
      return;
    }
    released = true;
    return originalRelease();
  };

  return client;
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database health check passed', { timestamp: result.rows[0].now });
    return true;
  } catch (error) {
    console.error('Database health check failed', error);
    return false;
  }
};

export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('Database pool closed successfully');
  } catch (error) {
    console.error('Error closing database pool', error);
    throw error;
  }
};

// Export pool for direct access if needed
export { pool };
