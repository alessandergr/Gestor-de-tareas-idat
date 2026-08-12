import { useRouter } from "expo-router";
import {
  useRef,
  useState,
} from "react";

import { createTaskUseCase } from "../../di/task.dependencies";
import type { TaskEntity } from "../../domain/entities/task.entity";

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

export const useNewTask = () => {
  const router = useRouter();

  const [task, setTask] =
    useState<TaskEntity>({
      title: "",
      description: "",
      priority: "medium",
      category: "",
    });

  const [imageUri, setImageUri] =
    useState("");

  const [dataStates, setDataStates] =
    useState<DataStates>(
      DATA_STATES_DEFAULT,
    );

  // Evita crear dos tareas si alguien
  // toca el botón dos veces muy rápido.
  const isSubmitting =
    useRef(false);

  // Actualiza solamente el campo que cambió.
  const updateTask = (
    changes: Partial<TaskEntity>,
  ) => {
    setTask((current) => ({
      ...current,
      ...changes,
    }));
  };

  const handleSubmit = async () => {
    // Si ya está guardando, ignoramos
    // cualquier toque extra.
    if (isSubmitting.current) {
      return;
    }

    isSubmitting.current = true;

    setDataStates({
      ...DATA_STATES_DEFAULT,
      isLoading: true,
    });

    try {
      // El hook solamente arma la tarea.
      //
      // NO revisa internet.
      // NO sube a Cloudinary.
      // NO usa SQLite.
      //
      // Todo eso lo decide el repositorio.
      const result =
        await createTaskUseCase.execute({
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
      priority:
        TaskEntity["priority"],
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