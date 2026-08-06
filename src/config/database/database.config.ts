import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

const initializeDatabase =
  async (): Promise<SQLite.SQLiteDatabase> => {
    const database =
      await SQLite.openDatabaseAsync("tasks.db");

    await database.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);

    return database;
  };

export const getDatabase =
  (): Promise<SQLite.SQLiteDatabase> => {
    if (!databasePromise) {
      databasePromise = initializeDatabase();
    }

    return databasePromise;
  };