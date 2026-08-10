import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  firebaseAuth,
  firebaseDb,
} from "@/config/firebase/firebase.config";

import {
  TaskEntity,
  TaskPriority,
} from "../../../domain/entities/task.entity";
import { TaskModel } from "../../models/task.model";

// Si una tarea antigua no tiene prioridad, usamos media
const getPriority = (value: unknown): TaskPriority => {
  if (
    value === "low" ||
    value === "medium" ||
    value === "high"
  ) {
    return value;
  }

  return "medium";
};

const getCurrentUserId = (): string => {
  const userId = firebaseAuth.currentUser?.uid;

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  return userId;
};

const getTasksCollection = () => {
  const userId = getCurrentUserId();

  return collection(
    firebaseDb,
    "users",
    userId,
    "tasks",
  );
};

export interface TaskRemoteDataSource {
  getTasks: () => Promise<TaskModel[]>;
  createTask: (
    task: TaskEntity,
  ) => Promise<TaskModel>;
  updateTask: (
    task: TaskEntity,
  ) => Promise<TaskModel>;
  deleteTask: (id: string) => Promise<void>;
}

export class TaskRemoteDataSourceImpl
  implements TaskRemoteDataSource
{
  async getTasks(): Promise<TaskModel[]> {
    const snapshot = await getDocs(
      getTasksCollection(),
    );

    // Convertimos los documentos de Firestore a tareas
    return snapshot.docs
      .filter(
        (document) =>
          document.data().isDeleted !== true,
      )
      .map((document) => {
        const data = document.data();

        return new TaskModel(
          data.title,
          data.description,
          document.id,
          data.imageUrl || undefined,
          getPriority(data.priority),
          data.category || "Sin categoría",
        );
      });
  }

  async createTask(
    task: TaskEntity,
  ): Promise<TaskModel> {
    const taskRef = doc(getTasksCollection());

    await setDoc(taskRef, {
      title: task.title,
      description: task.description,
      imageUrl: task.imageUrl ?? null,
      priority: task.priority,
      category: task.category,
      isDeleted: false,
      updatedAt: serverTimestamp(),
    });

    return new TaskModel(
      task.title,
      task.description,
      taskRef.id,
      task.imageUrl,
      task.priority,
      task.category,
    );
  }

  async updateTask(
    task: TaskEntity,
  ): Promise<TaskModel> {
    if (!task.id) {
      throw new Error("La tarea no tiene ID");
    }

    const userId = getCurrentUserId();

    const taskRef = doc(
      firebaseDb,
      "users",
      userId,
      "tasks",
      task.id,
    );

    await setDoc(
      taskRef,
      {
        title: task.title,
        description: task.description,
        imageUrl: task.imageUrl ?? null,
        priority: task.priority,
        category: task.category,
        isDeleted: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
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

  async deleteTask(id: string): Promise<void> {
    const userId = getCurrentUserId();

    const taskRef = doc(
      firebaseDb,
      "users",
      userId,
      "tasks",
      id,
    );

    await setDoc(
      taskRef,
      {
        isDeleted: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}