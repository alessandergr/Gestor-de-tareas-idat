import { TaskEntity } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

// Este caso de uso manda los cambios de una tarea ya creada
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  // Devuelve la tarea con los cambios ya guardados
  execute(task: TaskEntity): Promise<TaskEntity> {
    return this.taskRepository.updateTask(task);
  }
}