const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, 'edusaarthi.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Pragmas for performance and foreign keys
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize schema
function initSchema() {
  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schemaSql);
}

initSchema();

module.exports = {
  db,
  // Helper for SELECT queries returning multiple rows
  query(sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      return stmt.all(...params);
    } catch (err) {
      console.error('DB query error:', sql, params, err);
      throw err;
    }
  },

  // Helper for SELECT queries returning a single row
  get(sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      return stmt.get(...params) || null;
    } catch (err) {
      console.error('DB get error:', sql, params, err);
      throw err;
    }
  },

  // Helper for INSERT / UPDATE / DELETE queries
  run(sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      return stmt.run(...params);
    } catch (err) {
      console.error('DB run error:', sql, params, err);
      throw err;
    }
  },

  // Direct exec for bulk migrations
  exec(sql) {
    return db.exec(sql);
  }
};
