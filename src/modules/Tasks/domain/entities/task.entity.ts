// Estas son las tres prioridades que puede tener una tarea
export type TaskPriority = "low" | "medium" | "high";

// Acá definimos todos los datos que tiene una tarea dentro de la app
export interface TaskEntity {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  priority: TaskPriority;
}