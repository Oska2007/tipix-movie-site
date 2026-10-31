import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Local SQLite database file එක
const sqlite = new Database('movie-db.sqlite');
export const db = drizzle(sqlite, { schema });