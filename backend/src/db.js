import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(process.env.DB_FILE ?? 'data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    content      TEXT NOT NULL,
    category     TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('publish', 'draft', 'thrash')),
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
