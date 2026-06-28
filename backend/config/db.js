import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.resolve(process.env.DATABASE_FILE || '../database/furniture.db');
const schemaPath = path.resolve(process.env.SCHEMA_FILE || '../database/schema.sql');
const seedPath = path.resolve(process.env.SEED_FILE || '../database/seed.sql');

// Make sure parent directory for DB file exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db = null;

export async function getDatabase() {
  if (db) return db;

  try {
    // Open the SQLite database
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    // Check if categories table exists
    const tableCheck = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='categories';"
    );

    if (!tableCheck) {
      console.log('Database not initialized. Bootstrapping schema and seeds...');
      
      // Load Schema
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await db.exec(schemaSql);
        console.log('Schema tables created successfully.');
      } else {
        console.error(`Schema file not found at ${schemaPath}`);
      }

      // Load Seeds
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await db.exec(seedSql);
        console.log('Seed records inserted successfully.');
      } else {
        console.error(`Seed file not found at ${seedPath}`);
      }
    } else {
      console.log('Database connected and ready.');
    }
  } catch (error) {
    console.error('Database connection / initialization failed:', error);
    throw error;
  }

  return db;
}
