const path = require('path');
const { DatabaseSync } = require('node:sqlite'); // built into Node 22+, no native build step needed
require('dotenv').config();

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './worksync.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

module.exports = db;
