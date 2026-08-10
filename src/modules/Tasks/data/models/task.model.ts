import { TaskEntity, TaskPriority, } from "../../domain/entities/task.entity";

// Este modelo representa una tarea dentro de la parte de datos
export class TaskModel implements TaskEntity {
  constructor(
    public title: string,
    public description: string,
    public id?: string,
    public imageUrl?: string,
    public priority: TaskPriority = "medium",
    public category: string = "Sin categoría",
  ) {}

  // Si recibimos una tarea normal, la convertimos al modelo que usamos en datos
  static fromEntity(task: TaskEntity): TaskModel {
    return new TaskModel(
      task.title,
      task.description,
      task.id,
      task.imageUrl,
      task.priority,
      task.category,
    );
  }
}