import { getDatabase } from "@/config/database/database.config";
import { firebaseDb } from "@/config/firebase/firebase.config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { TaskPriority } from "../../domain/entities/task.entity";

type PendingAction = "create" | "update" | "delete";

interface PendingTaskRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  priority: TaskPriority;
  user_id: string;
  pending_action: PendingAction;
}

let isSyncing = false;

export const syncPendingTasks = async (
  userId: string,
): Promise<void> => {
  // Evita que se hagan dos sincronizaciones al mismo tiempo
  if (isSyncing) return;

  isSyncing = true;

  try {
    const database = await getDatabase();

    // Buscamos los cambios que quedaron pendientes por falta de internet
    const tasks = await database.getAllAsync<PendingTaskRow>(
      `
        SELECT
          id,
          title,
          description,
          image_url,
          priority,
          user_id,
          pending_action
        FROM tasks
        WHERE user_id = ?
          AND pending_action IN ('create', 'update', 'delete')
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

      // Mandamos a Firestore todos los datos, incluida la prioridad
      await setDoc(
        taskReference,
        {
          title: task.title,
          description: task.description,
          imageUrl: task.image_url ?? null,
          priority: task.priority,
          isDeleted: task.pending_action === "delete",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      if (task.pending_action === "delete") {
        // Si ya se eliminó en Firestore también la quitamos del celular
        await database.runAsync(
          "DELETE FROM tasks WHERE id = ? AND user_id = ?",
          task.id,
          userId,
        );
      } else {
        // Si ya se sincronizó deja de estar marcada como pendiente
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