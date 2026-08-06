import { getDatabase } from "@/config/database/database.config";
import { firebaseDb } from "@/config/firebase/firebase.config";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

type PendingAction = "create" | "update" | "delete";

interface PendingTaskRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  pending_action: PendingAction;
}

let isSyncing = false;

export const syncPendingTasks = async (
  userId: string,
): Promise<void> => {
  if (isSyncing) {
    return;
  }

  isSyncing = true;

  try {
    const database = await getDatabase();

    const tasks =
      await database.getAllAsync<PendingTaskRow>(`
        SELECT
          id,
          title,
          description,
          image_url,
          pending_action
        FROM tasks
        WHERE pending_action IN (
          'create',
          'update',
          'delete'
        )
        ORDER BY rowid ASC
      `);

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
          isDeleted:
            task.pending_action === "delete",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await database.runAsync(
        `
          UPDATE tasks
          SET
            pending_action = 'synced',
            is_deleted = ?
          WHERE id = ?
        `,
        task.pending_action === "delete" ? 1 : 0,
        task.id,
      );
    }
  } finally {
    isSyncing = false;
  }
};