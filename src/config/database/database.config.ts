import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Agrega una columna solo si todavía no existe
const addColumnIfMissing = async (
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

const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  const database = await SQLite.openDatabaseAsync("tasks_v2.db");

  // Crea la tabla donde guardamos las tareas en el celular
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      user_id TEXT,
      pending_action TEXT,
      is_deleted INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Esto actualiza las bases antiguas sin borrar las tareas que ya existen
  await addColumnIfMissing(
    database,
    "ALTER TABLE tasks ADD COLUMN image_url TEXT;",
  );

  await addColumnIfMissing(
    database,
    "ALTER TABLE tasks ADD COLUMN user_id TEXT;",
  );

  await addColumnIfMissing(
    database,
    "ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium';",
  );

  return database;
};

// Reutilizamos la misma conexión mientras la aplicación esté abierta
export const getDatabase = (): Promise<SQLite.SQLiteDatabase> => {
  if (!databasePromise) {
    databasePromise = initializeDatabase();
  }

  return databasePromise;
};