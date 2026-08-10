import { TaskEntity } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

// Este caso de uso se encarga de mandar una tarea nueva al repositorio
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  // Recibe la tarea y devuelve la que terminó guardándose
  execute(task: TaskEntity): Promise<TaskEntity> {
    return this.taskRepository.createTask(task);
  }
}