import db from './database';

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      place_of_birth TEXT
    );

    CREATE TABLE IF NOT EXISTS relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
      child_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
      UNIQUE(parent_id, child_id)
    );
  `);
}
