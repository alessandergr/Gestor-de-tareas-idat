import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null =
  null;

// Agrega una columna solamente cuando todavía no existe
const addColumn = async (
  database: SQLite.SQLiteDatabase,
  sql: string,
) => {
  try {
    await database.execAsync(sql);
  } catch (error) {
    const alreadyExists =
      error instanceof Error &&
      error.message.includes("duplicate column name");

    if (!alreadyExists) throw error;
  }
};

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
        priority TEXT NOT NULL DEFAULT 'medium',
        category TEXT NOT NULL DEFAULT 'Sin categoría',
        user_id TEXT,
        pending_action TEXT,
        is_deleted INTEGER NOT NULL DEFAULT 0
      );
    `);

    // Estas migraciones permiten conservar bases creadas antes
    await addColumn(
      database,
      "ALTER TABLE tasks ADD COLUMN image_url TEXT;",
    );

    await addColumn(
      database,
      "ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium';",
    );

    await addColumn(
      database,
      "ALTER TABLE tasks ADD COLUMN user_id TEXT;",
    );

    await addColumn(
      database,
      "ALTER TABLE tasks ADD COLUMN category TEXT NOT NULL DEFAULT 'Sin categoría';",
    );

    return database;
  };

export const getDatabase =
  (): Promise<SQLite.SQLiteDatabase> => {
    if (!databasePromise) {
      databasePromise = initializeDatabase();
    }

    return databasePromise;
  };