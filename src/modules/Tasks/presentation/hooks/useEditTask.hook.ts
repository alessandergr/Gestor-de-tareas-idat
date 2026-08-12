import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  useRef,
  useState,
} from "react";

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

// Expo Router puede devolver un string
// o un arreglo. Acá lo dejamos siempre
// como un string normal.
const getParamValue = (
  value:
    | string
    | string[]
    | undefined,
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

// Solo aceptamos las tres prioridades
// que realmente usa la aplicación.
const getPriority = (
  value:
    | string
    | string[]
    | undefined,
): TaskPriority => {
  const priority =
    getParamValue(value);

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

  const params =
    useLocalSearchParams();

  // Cargamos los datos que llegaron
  // desde la tarea seleccionada.
  const [task, setTask] =
    useState<TaskEntity>({
      id: getParamValue(
        params.id,
      ),

      title: getParamValue(
        params.title,
      ),

      description:
        getParamValue(
          params.description,
        ),

      priority:
        getPriority(
          params.priority,
        ),

      category:
        getParamValue(
          params.category,
        ) || "Sin categoría",
    });

  const [imageUri, setImageUri] =
    useState(
      getParamValue(
        params.imageUrl,
      ),
    );

  const [dataStates, setDataStates] =
    useState<DataStates>(
      DATA_STATES_DEFAULT,
    );

  // Igual que al crear:
  // evita varios guardados por toques rápidos.
  const isSubmitting =
    useRef(false);

  const updateTask = (
    changes: Partial<TaskEntity>,
  ) => {
    setTask((current) => ({
      ...current,
      ...changes,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) {
      return;
    }

    isSubmitting.current = true;

    setDataStates({
      ...DATA_STATES_DEFAULT,
      isLoading: true,
    });

    try {
      // El hook no revisa internet
      // ni intenta subir la foto.
      //
      // El repositorio decide qué hacer
      // dependiendo de la conexión.
      const result =
        await updateTaskUseCase.execute({
          ...task,

          imageUrl:
            imageUri || undefined,
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
    } finally {
      isSubmitting.current = false;
    }
  };

  return {
    task,
    imageUri,
    dataStates,
    handleSubmit,

    onChangeTitle: (
      title: string,
    ) =>
      updateTask({
        title,
      }),

    onChangeDescription: (
      description: string,
    ) =>
      updateTask({
        description,
      }),

    onChangePriority: (
      priority: TaskPriority,
    ) =>
      updateTask({
        priority,
      }),

    onChangeCategory: (
      category: string,
    ) =>
      updateTask({
        category,
      }),

    onChangeImage: setImageUri,
  };
};