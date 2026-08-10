import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getDatabase } from "@/config/database/database.config";
import { firebaseDb } from "@/config/firebase/firebase.config";

import type { TaskPriority } from "../../domain/entities/task.entity";

type PendingAction = "create" | "update" | "delete";

interface PendingTaskRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  priority: TaskPriority;
  category: string;
  user_id: string;
  pending_action: PendingAction;
}

let isSyncing = false;

// Envía a Firestore los cambios que quedaron pendientes en SQLite
export const syncPendingTasks = async (
  userId: string,
): Promise<void> => {
  if (isSyncing) return;

  isSyncing = true;

  try {
    const database = await getDatabase();

    const tasks =
      await database.getAllAsync<PendingTaskRow>(
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
          WHERE
            user_id = ?
            AND pending_action IN (
              'create',
              'update',
              'delete'
            )
          ORDER BY rowid ASC
        `,
        userId,
      );

    for (const task of tasks) {
      const taskReference = doc(
        firebaseDb,
        "users",
        userId,
        "tasks",
        task.id,
      );

      await setDoc(
        taskReference,
        {
          title: task.title,
          description: task.description,
          imageUrl: task.image_url ?? null,
          priority: task.priority,
          category: task.category,
          isDeleted:
            task.pending_action === "delete",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      if (task.pending_action === "delete") {
        // Si ya se eliminó en Firestore ya no hace falta conservarla localmente
        await database.runAsync(
          "DELETE FROM tasks WHERE id = ? AND user_id = ?",
          task.id,
          userId,
        );
      } else {
        await database.runAsync(
          `
            UPDATE tasks
            SET pending_action = NULL, is_deleted = 0
            WHERE id = ? AND user_id = ?
          `,
          task.id,
          userId,
        );
      }
    }
  } finally {
    isSyncing = false;
  }
};