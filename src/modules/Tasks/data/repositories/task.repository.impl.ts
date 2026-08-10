import { TaskEntity } from "../../domain/entities/task.entity";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { TaskLocalDataSource } from "../data-sources/local/task.local.ds";
import { TaskRemoteDataSource } from "../data-sources/remote/task.remote.ds";

export class TaskRepositoryImpl implements TaskRepository {
  constructor(
    private readonly taskRemoteDataSource: TaskRemoteDataSource,
    private readonly taskLocalDataSource: TaskLocalDataSource,
  ) {}

  async getTasks(): Promise<TaskEntity[]> {
    try {
      // Con internet traemos Firestore y actualizamos lo que tenemos en SQLite
      const tasks = await this.taskRemoteDataSource.getTasks();

      await this.taskLocalDataSource.replaceTasks(tasks);

      return this.taskLocalDataSource.getTasks();
    } catch {
      // Si falla internet, mostramos directamente lo que quedó guardado en el celular
      return this.taskLocalDataSource.getTasks();
    }
  }

  async createTask(task: TaskEntity): Promise<TaskEntity> {
    try {
      const result = await this.taskRemoteDataSource.createTask(task);

      // Si Firestore respondió bien, también dejamos una copia local
      await this.taskLocalDataSource.saveTask(result);

      return result;
    } catch {
      // Sin internet la guardamos como pendiente para subirla después
      return this.taskLocalDataSource.createPendingTask(task);
    }
  }

  async updateTask(task: TaskEntity): Promise<TaskEntity> {
    try {
      const result = await this.taskRemoteDataSource.updateTask(task);

      await this.taskLocalDataSource.saveTask(result);

      return result;
    } catch {
      // Guardamos el cambio local aunque todavía no se pueda mandar a Firestore
      return this.taskLocalDataSource.updatePendingTask(task);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      // Primero la marcamos como eliminada en Firestore y luego quitamos la copia local
      await this.taskRemoteDataSource.deleteTask(id);
      await this.taskLocalDataSource.removeTask(id);
    } catch {
      // Si no hay internet queda marcada para eliminarla después
      await this.taskLocalDataSource.deletePendingTask(id);
    }
  }
}