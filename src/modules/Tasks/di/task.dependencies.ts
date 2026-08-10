import { TaskLocalDataSourceImpl } from "../data/data-sources/local/task.local.ds";
import { TaskRemoteDataSourceImpl } from "../data/data-sources/remote/task.remote.ds";
import { TaskRepositoryImpl } from "../data/repositories/task.repository.impl";
import { CreateTaskUseCase } from "../domain/use-cases/createTask.use-case";
import { DeleteTaskUseCase } from "../domain/use-cases/deleteTask.use-case";
import { GetTasksUseCase } from "../domain/use-cases/getTasks.use-case";
import { UpdateTaskUseCase } from "../domain/use-cases/updateTask.use-case";

// Creamos las partes que trabajan con SQLite y Firestore
const taskRemoteDataSource = new TaskRemoteDataSourceImpl();
const taskLocalDataSource = new TaskLocalDataSourceImpl();

// El repositorio junta la parte remota con la parte local
const taskRepository = new TaskRepositoryImpl(
  taskRemoteDataSource,
  taskLocalDataSource,
);

// Estos son los casos de uso que después llaman las pantallas y hooks
export const getTasksUseCase =
  new GetTasksUseCase(taskRepository);

export const createTaskUseCase =
  new CreateTaskUseCase(taskRepository);

export const updateTaskUseCase =
  new UpdateTaskUseCase(taskRepository);

export const deleteTaskUseCase =
  new DeleteTaskUseCase(taskRepository);