import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

if (!process.env.DATABASE_URl) {
  throw new Error('DATABASE_URL is not set in .env file');
}

const runMigrations = async () => {
  const connection = postgres(process.env.DATABASE_URl!, { max: 1 });
  const db = drizzle(connection);

  console.log('Running database migrations...');
  await migrate(db, { migrationsFolder: 'src/server/drizzle' });
  console.log('Migrations completed successfully.');

  await connection.end();
};

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
