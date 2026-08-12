import NetInfo from "@react-native-community/netinfo";

import { firebaseAuth } from "@/config/firebase/firebase.config";

import type { TaskEntity } from "../../domain/entities/task.entity";
import type { TaskRepository } from "../../domain/repositories/task.repository";
import type { TaskLocalDataSource } from "../data-sources/local/task.local.ds";
import type { TaskRemoteDataSource } from "../data-sources/remote/task.remote.ds";
import { uploadTaskImage } from "../services/cloudinary-upload.service";
import { syncPendingTasks } from "../services/task-sync.service";

// Revisamos la red antes de intentar Firestore.
// Si NetInfo dice directamente que no hay internet,
// usamos SQLite sin perder tiempo.
const hasInternetConnection =
  async (): Promise<boolean> => {
    const state =
      await NetInfo.fetch();

    return (
      state.isConnected === true &&
      state.isInternetReachable !==
        false
    );
  };

// Si la tarea tiene una foto local,
// antes de mandarla a Firestore la subimos.
//
// Si ya empieza con http significa que
// la foto ya está en Cloudinary.
const prepareTaskForRemote =
  async (
    task: TaskEntity,
  ): Promise<TaskEntity> => {
    if (
      !task.imageUrl ||
      task.imageUrl.startsWith("http")
    ) {
      return task;
    }

    const imageUrl =
      await uploadTaskImage(
        task.imageUrl,
      );

    return {
      ...task,
      imageUrl,
    };
  };

export class TaskRepositoryImpl
  implements TaskRepository
{
  constructor(
    private readonly taskRemoteDataSource:
      TaskRemoteDataSource,

    private readonly taskLocalDataSource:
      TaskLocalDataSource,
  ) {}

  async getTasks(): Promise<
    TaskEntity[]
  > {
    const hasInternet =
      await hasInternetConnection();

    // Sin internet ni intentamos Firestore.
    if (!hasInternet) {
      return this.taskLocalDataSource.getTasks();
    }

    try {
      const userId =
        firebaseAuth.currentUser?.uid;

      // Antes de descargar Firestore intentamos
      // mandar lo que haya quedado pendiente.
      //
      // Así evitamos traer una lista vieja
      // justo antes de subir las tareas nuevas.
      if (userId) {
        await syncPendingTasks(userId);
      }

      const remoteTasks =
        await this.taskRemoteDataSource.getTasks();

      // Actualizamos la copia del celular
      // con lo que ahora sí está en Firestore.
      await this.taskLocalDataSource.replaceTasks(
        remoteTasks,
      );

      return this.taskLocalDataSource.getTasks();
    } catch {
      // Si algo remoto falla, la lista local
      // sigue estando disponible.
      return this.taskLocalDataSource.getTasks();
    }
  }

  async createTask(
    task: TaskEntity,
  ): Promise<TaskEntity> {
    const hasInternet =
      await hasInternetConnection();

    // Offline va directo a SQLite.
    if (!hasInternet) {
      return this.taskLocalDataSource.createPendingTask(
        task,
      );
    }

    let taskToSave = task;

    try {
      // Si hay una foto nueva,
      // recién acá intentamos Cloudinary.
      taskToSave =
        await prepareTaskForRemote(
          task,
        );

      const result =
        await this.taskRemoteDataSource.createTask(
          taskToSave,
        );

      // Si quedó bien en Firestore,
      // dejamos la misma copia en SQLite.
      await this.taskLocalDataSource.saveTask(
        result,
      );

      return result;
    } catch {
      // Si internet falla a mitad del proceso,
      // no perdemos lo que escribió el usuario.
      return this.taskLocalDataSource.createPendingTask(
        taskToSave,
      );
    }
  }

  async updateTask(
    task: TaskEntity,
  ): Promise<TaskEntity> {
    const hasInternet =
      await hasInternetConnection();

    if (!hasInternet) {
      return this.taskLocalDataSource.updatePendingTask(
        task,
      );
    }

    let taskToSave = task;

    try {
      taskToSave =
        await prepareTaskForRemote(
          task,
        );

      const result =
        await this.taskRemoteDataSource.updateTask(
          taskToSave,
        );

      await this.taskLocalDataSource.saveTask(
        result,
      );

      return result;
    } catch {
      return this.taskLocalDataSource.updatePendingTask(
        taskToSave,
      );
    }
  }

  async deleteTask(
    id: string,
  ): Promise<void> {
    const hasInternet =
      await hasInternetConnection();

    if (!hasInternet) {
      await this.taskLocalDataSource.deletePendingTask(
        id,
      );

      return;
    }

    try {
      await this.taskRemoteDataSource.deleteTask(
        id,
      );

      await this.taskLocalDataSource.removeTask(
        id,
      );
    } catch {
      await this.taskLocalDataSource.deletePendingTask(
        id,
      );
    }
  }
}