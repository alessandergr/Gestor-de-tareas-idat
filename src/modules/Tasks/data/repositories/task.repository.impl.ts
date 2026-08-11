import NetInfo from "@react-native-community/netinfo";

import type { TaskEntity } from "../../domain/entities/task.entity";
import type { TaskRepository } from "../../domain/repositories/task.repository";
import type { TaskLocalDataSource } from "../data-sources/local/task.local.ds";
import type { TaskRemoteDataSource } from "../data-sources/remote/task.remote.ds";
import { uploadTaskImage } from "../services/cloudinary-upload.service";

// Revisamos la conexión antes de intentar Firebase o Cloudinary.
const hasInternetConnection =
  async (): Promise<boolean> => {
    const state = await NetInfo.fetch();

    return (
      state.isConnected === true &&
      state.isInternetReachable === true
    );
  };

// Si la foto todavía es local, la subimos antes
// de mandar la tarea a Firestore.
//
// Si ya empieza con http significa que ya está
// en Cloudinary y no hace falta volverla a subir.
const prepareTaskForRemote = async (
  task: TaskEntity,
): Promise<TaskEntity> => {
  if (
    !task.imageUrl ||
    task.imageUrl.startsWith("http")
  ) {
    return task;
  }

  const imageUrl = await uploadTaskImage(
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

  async getTasks(): Promise<TaskEntity[]> {
    // Sin internet usamos directamente SQLite.
    if (!(await hasInternetConnection())) {
      return this.taskLocalDataSource.getTasks();
    }

    try {
      // Con internet traemos las tareas de Firestore.
      const tasks =
        await this.taskRemoteDataSource.getTasks();

      // También dejamos una copia en SQLite.
      await this.taskLocalDataSource.replaceTasks(
        tasks,
      );

      return this.taskLocalDataSource.getTasks();
    } catch {
      // Si Firestore falla, igual tenemos la copia local.
      return this.taskLocalDataSource.getTasks();
    }
  }

  async createTask(
    task: TaskEntity,
  ): Promise<TaskEntity> {
    // Sin internet ni intentamos la nube.
    // La guardamos de frente como pendiente en SQLite.
    if (!(await hasInternetConnection())) {
      return this.taskLocalDataSource.createPendingTask(
        task,
      );
    }

    let taskToSave = task;

    try {
      // Si tiene una foto local, primero va a Cloudinary.
      taskToSave =
        await prepareTaskForRemote(task);

      // Después guardamos la tarea en Firestore.
      const result =
        await this.taskRemoteDataSource.createTask(
          taskToSave,
        );

      // Y mantenemos también la copia local.
      await this.taskLocalDataSource.saveTask(
        result,
      );

      return result;
    } catch {
      // Si la conexión falla a mitad del proceso,
      // no perdemos la tarea: queda pendiente en SQLite.
      return this.taskLocalDataSource.createPendingTask(
        taskToSave,
      );
    }
  }

  async updateTask(
    task: TaskEntity,
  ): Promise<TaskEntity> {
    // Offline, el cambio queda guardado localmente.
    if (!(await hasInternetConnection())) {
      return this.taskLocalDataSource.updatePendingTask(
        task,
      );
    }

    let taskToSave = task;

    try {
      // Si eligió una foto nueva, la subimos primero.
      taskToSave =
        await prepareTaskForRemote(task);

      const result =
        await this.taskRemoteDataSource.updateTask(
          taskToSave,
        );

      await this.taskLocalDataSource.saveTask(
        result,
      );

      return result;
    } catch {
      // Si falla internet, el cambio queda pendiente.
      return this.taskLocalDataSource.updatePendingTask(
        taskToSave,
      );
    }
  }

  async deleteTask(id: string): Promise<void> {
    // Sin conexión solamente dejamos marcada
    // la eliminación para hacerla después.
    if (!(await hasInternetConnection())) {
      await this.taskLocalDataSource.deletePendingTask(
        id,
      );

      return;
    }

    try {
      await this.taskRemoteDataSource.deleteTask(id);

      await this.taskLocalDataSource.removeTask(id);
    } catch {
      // Si falla Firebase, la eliminación queda pendiente.
      await this.taskLocalDataSource.deletePendingTask(
        id,
      );
    }
  }
}