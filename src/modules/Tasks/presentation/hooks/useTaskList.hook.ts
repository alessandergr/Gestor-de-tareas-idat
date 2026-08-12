import {
  useFocusEffect,
  useRouter,
} from "expo-router";
import {
  useCallback,
  useRef,
  useState,
} from "react";

import { getTasksUseCase } from "../../di/task.dependencies";
import {
  TaskEntity,
  TaskPriority,
} from "../../domain/entities/task.entity";

type PriorityFilter =
  | "all"
  | TaskPriority;

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

// Usamos un número para que el orden de prioridad
// sea siempre el mismo.
const PRIORITY_ORDER: Record<
  TaskPriority,
  number
> = {
  high: 1,
  medium: 2,
  low: 3,
};

// Primero ordenamos por prioridad.
// Si dos tienen la misma, las ordenamos por título.
const sortTasks = (
  tasks: TaskEntity[],
): TaskEntity[] => {
  return [...tasks].sort((a, b) => {
    const priorityDifference =
      PRIORITY_ORDER[a.priority] -
      PRIORITY_ORDER[b.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return a.title.localeCompare(
      b.title,
      "es",
      {
        sensitivity: "base",
      },
    );
  });
};

export const useTaskList = () => {
  const router = useRouter();

  const [dataStates, setDataStates] =
    useState<DataStates>(DEFAULT_STATE);

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");

  const [searchText, setSearchText] =
    useState("");

  // Sirve para saber cuál fue la carga más reciente.
  // Así una consulta vieja no puede reemplazar una nueva.
  const lastRequest = useRef(0);

  const filteredTasks =
    dataStates.data.filter((task) => {
      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            searchText
              .trim()
              .toLowerCase(),
          );

      return (
        matchesPriority &&
        matchesSearch
      );
    });

  const handleAddPress = () => {
    router.push("/tasks/new");
  };

  const handleView = (
    task: TaskEntity,
  ) => {
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

  const handleEdit = (
    task: TaskEntity,
  ) => {
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

  const loadTasks = useCallback(
    async () => {
      const requestId =
        ++lastRequest.current;

      // Si ya teníamos tareas, no vaciamos toda
      // la pantalla mientras se actualiza.
      setDataStates((current) => ({
        ...current,
        isLoading:
          current.data.length === 0,
        isError: false,
      }));

      try {
        const result =
          await getTasksUseCase.execute();

        // Si mientras esperábamos empezó otra carga,
        // esta respuesta ya es vieja y no la usamos.
        if (
          requestId !==
          lastRequest.current
        ) {
          return;
        }

        setDataStates({
          isLoading: false,
          isError: false,
          data: sortTasks(result),
        });
      } catch {
        if (
          requestId !==
          lastRequest.current
        ) {
          return;
        }

        setDataStates((current) => ({
          ...current,
          isLoading: false,
          isError: true,
        }));
      }
    },
    [],
  );

  // useFocusEffect vuelve a cargar la lista
  // cada vez que realmente regresamos a Tareas.
  useFocusEffect(
    useCallback(() => {
      void loadTasks();

      return () => {
        // Si salimos mientras una carga seguía viva,
        // la marcamos como vieja.
        lastRequest.current += 1;
      };
    }, [loadTasks]),
  );

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