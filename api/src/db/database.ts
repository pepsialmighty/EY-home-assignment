import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'family-tree.db');

const db = new DatabaseSync(dbPath);

// Enable foreign key enforcement
db.exec('PRAGMA foreign_keys = ON');

export default db;
