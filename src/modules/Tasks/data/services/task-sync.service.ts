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

// Guardamos la sincronización que esté corriendo.
// Así no lanzamos dos al mismo tiempo.
let syncPromise: Promise<void> | null = null;

let syncingUserId: string | null = null;

// Nos dice si la imagen ya está subida.
// Si empieza con http ya no es una foto local.
const isRemoteImage = (
  imageUrl: string,
): boolean => {
  return (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  );
};

// Acá ocurre la sincronización real de las tareas pendientes.
const runPendingSync = async (
  userId: string,
): Promise<void> => {
  const database = await getDatabase();

  // Buscamos solo las tareas de este usuario
  // que todavía tengan algo pendiente.
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
    let imageUrl = task.image_url;

    // Si la tarea se creó sin internet,
    // la imagen todavía puede ser una URI del celular.
    if (
      task.pending_action !== "delete" &&
      imageUrl &&
      !isRemoteImage(imageUrl)
    ) {
      imageUrl =
        await uploadTaskImage(imageUrl);

      // Guardamos la URL apenas Cloudinary responde.
      // Si Firestore falla después, no tendremos que
      // volver a subir la misma foto.
      await database.runAsync(
        `
          UPDATE tasks
          SET image_url = ?
          WHERE id = ? AND user_id = ?
        `,
        imageUrl,
        task.id,
        userId,
      );
    }

    const taskReference = doc(
      firebaseDb,
      "users",
      userId,
      "tasks",
      task.id,
    );

    // Mandamos la tarea a Firestore.
    await setDoc(
      taskReference,
      {
        title: task.title,
        description: task.description,
        imageUrl: imageUrl ?? null,
        priority: task.priority,
        category: task.category,

        // Si estaba pendiente de borrar,
        // Firestore la deja marcada como eliminada.
        isDeleted:
          task.pending_action === "delete",

        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (
      task.pending_action === "delete"
    ) {
      // Ya se reflejó el borrado en Firestore,
      // así que ya podemos quitarla del celular.
      await database.runAsync(
        `
          DELETE FROM tasks
          WHERE id = ? AND user_id = ?
        `,
        task.id,
        userId,
      );
    } else {
      // Ya llegó correctamente a Firestore.
      // Quitamos la marca de pendiente.
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
};

export const syncPendingTasks = async (
  userId: string,
): Promise<void> => {
  // Si ya estamos sincronizando las tareas
  // del mismo usuario, esperamos ese proceso.
  //
  // Esto evita dos sincronizaciones compitiendo.
  if (
    syncPromise &&
    syncingUserId === userId
  ) {
    return syncPromise;
  }

  // Caso raro: se cambió de cuenta mientras
  // todavía había una sincronización anterior.
  //
  // Esperamos que termine y luego sincronizamos
  // la cuenta actual.
  if (syncPromise) {
    try {
      await syncPromise;
    } catch {
      // Si la anterior falló no pasa nada.
      // Las tareas siguen pendientes en SQLite.
    }

    return syncPendingTasks(userId);
  }

  syncingUserId = userId;

  syncPromise = runPendingSync(
    userId,
  ).finally(() => {
    syncPromise = null;
    syncingUserId = null;
  });

  return syncPromise;
};