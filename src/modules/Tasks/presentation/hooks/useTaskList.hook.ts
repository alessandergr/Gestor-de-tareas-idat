import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { getTasksUseCase } from "../../di/task.dependencies";
import {
  TaskEntity,
  TaskPriority,
} from "../../domain/entities/task.entity";

type PriorityFilter = "all" | TaskPriority;

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

export const useTaskList = () => {
  const router = useRouter();

  const [dataStates, setDataStates] =
    useState<DataStates>(DEFAULT_STATE);

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");

  const [searchText, setSearchText] = useState("");

  // Filtramos por prioridad y también por el nombre de la tarea
  const filteredTasks = dataStates.data.filter((task) => {
    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());

    return matchesPriority && matchesSearch;
  });

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
        category: task.category,
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
        category: task.category,
      },
    });
  };

  // Traemos nuevamente las tareas cuando necesitamos actualizar la lista
  const loadTasks = async () => {
    setDataStates({
      ...DEFAULT_STATE,
      isLoading: true,
    });

    try {
      const result = await getTasksUseCase.execute();

      setDataStates({
        ...DEFAULT_STATE,
        data: result,
      });
    } catch {
      setDataStates({
        ...DEFAULT_STATE,
        isError: true,
      });
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  return {
    dataStates,
    filteredTasks,
    priorityFilter,
    searchText,
    setPriorityFilter,
    setSearchText,
    handleView,
    handleEdit,
    handleAddPress,
    loadTasks,
  };
};