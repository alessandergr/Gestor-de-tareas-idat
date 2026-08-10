import { TaskRepository } from "../repositories/task.repository";

// Este caso de uso se usa cuando queremos eliminar una tarea
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  // Solo necesita el ID para saber cuál borrar
  execute(id: string): Promise<void> {
    return this.taskRepository.deleteTask(id);
  }
}