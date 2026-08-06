import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null =
  null;

const initializeDatabase =
  async (): Promise<SQLite.SQLiteDatabase> => {
    const database =
      await SQLite.openDatabaseAsync("tasks_v2.db");

    await database.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        pending_action TEXT,
        is_deleted INTEGER NOT NULL DEFAULT 0
      );
    `);

    try {
      await database.execAsync(
        "ALTER TABLE tasks ADD COLUMN image_url TEXT;",
      );
    } catch (error) {
      const columnAlreadyExists =
        error instanceof Error &&
        error.message.includes(
          "duplicate column name",
        );

      if (!columnAlreadyExists) {
        throw error;
      }
    }

    return database;
  };

export const getDatabase =
  (): Promise<SQLite.SQLiteDatabase> => {
    if (!databasePromise) {
      databasePromise = initializeDatabase();
    }

    return databasePromise;
  };