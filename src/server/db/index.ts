import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '../.env' });

if (!process.env.DATABASE_URl) {
  throw new Error('DATABASE_URL is not set in .env file');
}

const client = postgres(process.env.DATABASE_URl);
export const db = drizzle(client, { schema });
