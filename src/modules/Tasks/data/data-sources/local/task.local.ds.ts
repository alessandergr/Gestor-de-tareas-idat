import { getDatabase } from "@/config/database/database.config";
import { firebaseAuth } from "@/config/firebase/firebase.config";

import {
  TaskEntity,
  TaskPriority,
} from "../../../domain/entities/task.entity";
import { TaskModel } from "../../models/task.model";

type PendingAction = "create" | "update" | "delete";

interface TaskRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  priority: TaskPriority;
  category: string;
  user_id: string | null;
  pending_action: PendingAction | null;
}

// Sacamos el usuario actual para no mezclar tareas entre cuentas
const getCurrentUserId = (): string => {
  const userId = firebaseAuth.currentUser?.uid;

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  return userId;
};

export interface TaskLocalDataSource {
  getTasks: () => Promise<TaskModel[]>;
  replaceTasks: (tasks: TaskModel[]) => Promise<void>;
  saveTask: (task: TaskModel) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  createPendingTask: (
    task: TaskEntity,
  ) => Promise<TaskModel>;
  updatePendingTask: (
    task: TaskEntity,
  ) => Promise<TaskModel>;
  deletePendingTask: (
    id: string,
  ) => Promise<TaskModel>;
}

export class TaskLocalDataSourceImpl
  implements TaskLocalDataSource
{
  async getTasks(): Promise<TaskModel[]> {
    const database = await getDatabase();
    const userId = getCurrentUserId();

    const rows = await database.getAllAsync<TaskRow>(
      `
        SELECT
          id,
          title,
          description,
          image_url,
          priority,
          category,
          user_id,
          pending_action
        FROM tasks
        WHERE is_deleted = 0 AND user_id = ?
        ORDER BY rowid DESC
      `,
      userId,
    );

    return rows.map(
      (row) =>
        new TaskModel(
          row.title,
          row.description,
          row.id,
          row.image_url ?? undefined,
          row.priority,
          row.category || "Sin categoría",
        ),
    );
  }

  async replaceTasks(tasks: TaskModel[]): Promise<void> {
    const database = await getDatabase();
    const userId = getCurrentUserId();

    await database.withTransactionAsync(async () => {
      await database.runAsync(
        `
          DELETE FROM tasks
          WHERE pending_action IS NULL AND user_id = ?
        `,
        userId,
      );

      // Guardamos en SQLite lo que llegó desde Firestore
      for (const task of tasks) {
        if (!task.id) continue;

        await database.runAsync(
          `
            INSERT OR REPLACE INTO tasks (
              id,
              title,
              description,
              image_url,
              priority,
              category,
              user_id,
              pending_action,
              is_deleted
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 0)
          `,
          task.id,
          task.title,
          task.description,
          task.imageUrl ?? null,
          task.priority,
          task.category,
          userId,
        );
      }
    });
  }

  async saveTask(task: TaskModel): Promise<void> {
    if (!task.id) return;

    const database = await getDatabase();
    const userId = getCurrentUserId();

    await database.runAsync(
      `
        INSERT OR REPLACE INTO tasks (
          id,
          title,
          description,
          image_url,
          priority,
          category,
          user_id,
          pending_action,
          is_deleted
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 0)
      `,
      task.id,
      task.title,
      task.description,
      task.imageUrl ?? null,
      task.priority,
      task.category,
      userId,
    );
  }

  async removeTask(id: string): Promise<void> {
    const database = await getDatabase();
    const userId = getCurrentUserId();

    await database.runAsync(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      id,
      userId,
    );
  }

  async createPendingTask(
    task: TaskEntity,
  ): Promise<TaskModel> {
    const database = await getDatabase();
    const userId = getCurrentUserId();
    const id = `local-${userId}-${Date.now()}`;

    // Sin internet la dejamos marcada para sincronizarla después
    await database.runAsync(
      `
        INSERT INTO tasks (
          id,
          title,
          description,
          image_url,
          priority,
          category,
          user_id,
          pending_action,
          is_deleted
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'create', 0)
      `,
      id,
      task.title,
      task.description,
      task.imageUrl ?? null,
      task.priority,
      task.category,
      userId,
    );

    return new TaskModel(
      task.title,
      task.description,
      id,
      task.imageUrl,
      task.priority,
      task.category,
    );
  }

  async updatePendingTask(
    task: TaskEntity,
  ): Promise<TaskModel> {
    if (!task.id) {
      throw new Error("La tarea no tiene ID");
    }

    const database = await getDatabase();
    const userId = getCurrentUserId();

    const current =
      await database.getFirstAsync<TaskRow>(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        task.id,
        userId,
      );

    if (!current) {
      throw new Error("Tarea no encontrada");
    }

    const action: PendingAction =
      current.pending_action === "create"
        ? "create"
        : "update";

    await database.runAsync(
      `
        UPDATE tasks
        SET
          title = ?,
          description = ?,
          image_url = ?,
          priority = ?,
          category = ?,
          pending_action = ?
        WHERE id = ? AND user_id = ?
      `,
      task.title,
      task.description,
      task.imageUrl ?? null,
      task.priority,
      task.category,
      action,
      task.id,
      userId,
    );

    return new TaskModel(
      task.title,
      task.description,
      task.id,
      task.imageUrl,
      task.priority,
      task.category,
    );
  }

  async deletePendingTask(
    id: string,
  ): Promise<TaskModel> {
    const database = await getDatabase();
    const userId = getCurrentUserId();

    const current =
      await database.getFirstAsync<TaskRow>(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        id,
        userId,
      );

    if (!current) {
      throw new Error("Tarea no encontrada");
    }

    if (current.pending_action === "create") {
      await database.runAsync(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        id,
        userId,
      );
    } else {
      await database.runAsync(
        `
          UPDATE tasks
          SET pending_action = 'delete', is_deleted = 1
          WHERE id = ? AND user_id = ?
        `,
        id,
        userId,
      );
    }

    return new TaskModel(
      current.title,
      current.description,
      current.id,
      current.image_url ?? undefined,
      current.priority,
      current.category,
    );
  }
}