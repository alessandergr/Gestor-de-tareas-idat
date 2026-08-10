import { TaskEntity } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

// Este caso de uso pide todas las tareas del usuario
export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  // El repositorio decide si las trae de Firestore o de SQLite
  execute(): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks();
  }
}