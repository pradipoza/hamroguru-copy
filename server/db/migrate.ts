import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

const runMigrations = async () => {
  const connection = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(connection);

  console.log('Running database migrations...');
  await migrate(db, { migrationsFolder: './server/drizzle' });
  console.log('Migrations completed successfully.');

  await connection.end();
};

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
