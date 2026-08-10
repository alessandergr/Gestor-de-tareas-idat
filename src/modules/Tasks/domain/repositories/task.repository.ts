import { TaskEntity } from "../entities/task.entity";

// Acá dejamos las acciones que se pueden hacer con las tareas
export interface TaskRepository {
  getTasks: () => Promise<TaskEntity[]>;
  createTask: (task: TaskEntity) => Promise<TaskEntity>;
  updateTask: (task: TaskEntity) => Promise<TaskEntity>;
  deleteTask: (id: string) => Promise<void>;
}

// La implementación decide si trabaja con Firestore o SQLite