import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { getTasksUseCase } from "../../di/task.dependencies";
import { TaskEntity } from "../../domain/entities/task.entity";

interface DataStates {
  isLoading: boolean;
  isError: boolean;
  data: TaskEntity[];
}

const DEFAULT_STATE: DataStates = {
  isLoading: false,
  isError: false,
  data: [],
};

// Acá manejamos la lista y las rutas para ver, editar o crear tareas
export const useTaskList = () => {
  const router = useRouter();

  const [dataStates, setDataStates] =
    useState<DataStates>(DEFAULT_STATE);

  const handleAddPress = () => {
    router.push("/tasks/new");
  };

  const handleView = (task: TaskEntity) => {
    router.push({
      pathname: "/tasks/detail",
      params: {
        id: task.id ?? "",
        title: task.title,
        description: task.description,
        imageUrl: task.imageUrl ?? "",
        priority: task.priority,
      },
    });
  };

  const handleEdit = (task: TaskEntity) => {
    router.push({
      pathname: "/tasks/[id]",
      params: {
        id: task.id ?? "",
        title: task.title,
        description: task.description,
        imageUrl: task.imageUrl ?? "",
        priority: task.priority,
      },
    });
  };

  const loadTasks = async () => {
    setDataStates({
      ...DEFAULT_STATE,
      isLoading: true,
    });

    try {
      // Pedimos las tareas al caso de uso y actualizamos la lista
      const result = await getTasksUseCase.execute();

      setDataStates({
        ...DEFAULT_STATE,
        data: result,
      });
    } catch {
      // Si tampoco se pudieron obtener localmente, mostramos el estado de error
      setDataStates({
        ...DEFAULT_STATE,
        isError: true,
      });
    }
  };

  // Carga las tareas apenas entramos a esta pantalla
  useEffect(() => {
    void loadTasks();
  }, []);

  return {
    dataStates,
    loadTasks,
    handleView,
    handleEdit,
    handleAddPress,
  };
};