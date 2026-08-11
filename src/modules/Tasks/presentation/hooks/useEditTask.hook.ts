import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useState } from "react";

import { updateTaskUseCase } from "../../di/task.dependencies";
import type {
  TaskEntity,
  TaskPriority,
} from "../../domain/entities/task.entity";

const DATA_STATES_DEFAULT = {
  isLoading: false,
  isError: false,
  data: null,
};

interface DataStates {
  isLoading: boolean;
  isError: boolean;
  data: TaskEntity | null;
}

// Expo Router puede mandar un valor o un arreglo.
// Acá simplemente lo dejamos como texto normal.
const getParamValue = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

// Si llega una prioridad que no conocemos,
// usamos "medium" para evitar valores incorrectos.
const getPriority = (
  value: string | string[] | undefined,
): TaskPriority => {
  const priority = getParamValue(value);

  if (
    priority === "low" ||
    priority === "medium" ||
    priority === "high"
  ) {
    return priority;
  }

  return "medium";
};

export const useEditTask = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Cargamos en el formulario los datos
  // de la tarea que el usuario quiere editar.
  const [task, setTask] = useState<TaskEntity>({
    id: getParamValue(params.id),
    title: getParamValue(params.title),
    description:
      getParamValue(params.description),
    priority:
      getPriority(params.priority),
    category:
      getParamValue(params.category) ||
      "Sin categoría",
  });

  const [imageUri, setImageUri] = useState(
    getParamValue(params.imageUrl),
  );

  const [dataStates, setDataStates] =
    useState<DataStates>(DATA_STATES_DEFAULT);

  // Igual que al crear, actualizamos
  // solamente el dato que cambió.
  const updateTask = (
    changes: Partial<TaskEntity>,
  ) => {
    setTask((current) => ({
      ...current,
      ...changes,
    }));
  };

  const handleSubmit = async () => {
    setDataStates({
      ...DATA_STATES_DEFAULT,
      isLoading: true,
    });

    try {
      // El hook no necesita saber si hay internet.
      // El repositorio decide si actualiza
      // Firestore o deja el cambio en SQLite.
      const result =
        await updateTaskUseCase.execute({
          ...task,
          imageUrl: imageUri || undefined,
        });

      setDataStates({
        ...DATA_STATES_DEFAULT,
        data: result,
      });

      router.replace("/tasks");
    } catch {
      setDataStates({
        ...DATA_STATES_DEFAULT,
        isError: true,
      });
    }
  };

  return {
    task,
    imageUri,
    dataStates,
    handleSubmit,

    onChangeTitle: (title: string) =>
      updateTask({ title }),

    onChangeDescription: (
      description: string,
    ) => updateTask({ description }),

    onChangePriority: (
      priority: TaskPriority,
    ) => updateTask({ priority }),

    onChangeCategory: (category: string) =>
      updateTask({ category }),

    onChangeImage: setImageUri,
  };
};