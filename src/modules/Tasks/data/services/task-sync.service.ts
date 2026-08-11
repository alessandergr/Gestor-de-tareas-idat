import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getDatabase } from "@/config/database/database.config";
import { firebaseDb } from "@/config/firebase/firebase.config";

import type { TaskPriority } from "../../domain/entities/task.entity";
import { uploadTaskImage } from "./cloudinary-upload.service";

type PendingAction =
  | "create"
  | "update"
  | "delete";

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

// Cuando vuelve el internet, esta función manda
// a la nube todo lo que quedó pendiente en SQLite.
export const syncPendingTasks = async (
  userId: string,
): Promise<void> => {
  // Evita que se ejecuten dos sincronizaciones
  // al mismo tiempo.
  if (isSyncing) return;

  isSyncing = true;

  try {
    const database = await getDatabase();

    // Buscamos solamente las tareas que todavía
    // tienen algún cambio pendiente.
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
          WHERE user_id = ?
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
      let imageUrl = task.image_url;

      // Una tarea creada sin internet puede tener
      // todavía la dirección local de la foto.
      //
      // Cuando vuelve la conexión primero subimos
      // esa foto a Cloudinary.
      if (
        task.pending_action !== "delete" &&
        imageUrl &&
        !imageUrl.startsWith("http")
      ) {
        imageUrl =
          await uploadTaskImage(imageUrl);
      }

      const taskReference = doc(
        firebaseDb,
        "users",
        userId,
        "tasks",
        task.id,
      );

      // Ahora sí mandamos la tarea completa a Firestore.
      await setDoc(
        taskReference,
        {
          title: task.title,
          description: task.description,
          imageUrl: imageUrl ?? null,
          priority: task.priority,
          category: task.category,
          isDeleted:
            task.pending_action === "delete",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      if (
        task.pending_action === "delete"
      ) {
        // Si ya se eliminó en Firestore,
        // tampoco necesitamos conservarla en SQLite.
        await database.runAsync(
          `
            DELETE FROM tasks
            WHERE id = ? AND user_id = ?
          `,
          task.id,
          userId,
        );
      } else {
        // La tarea ya llegó correctamente a la nube.
        // Guardamos la URL final de la imagen
        // y quitamos la marca de pendiente.
        await database.runAsync(
          `
            UPDATE tasks
            SET
              image_url = ?,
              pending_action = NULL,
              is_deleted = 0
            WHERE id = ? AND user_id = ?
          `,
          imageUrl ?? null,
          task.id,
          userId,
        );
      }
    }
  } finally {
    // Aunque algo falle, dejamos libre
    // la sincronización para otro intento.
    isSyncing = false;
  }
};