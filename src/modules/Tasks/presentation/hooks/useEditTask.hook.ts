import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { uploadTaskImage } from "../../data/services/cloudinary-upload.service";
import { updateTaskUseCase } from "../../di/task.dependencies";
import { TaskEntity, TaskPriority, } from "../../domain/entities/task.entity";

interface DataStates {
  isLoading: boolean;
  isError: boolean;
  data: TaskEntity | null;
}

const DATA_STATES_DEFAULT: DataStates = {
  isLoading: false,
  isError: false,
  data: null,
};

// Expo Router puede devolver uno o varios valores, acá sacamos solo uno
const getParamValue = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

// Revisamos la prioridad recibida y usamos media si todavía no existe
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

// Acá guardamos los datos de la tarea que el usuario eligió editar
export const useEditTask = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [task, setTask] = useState<TaskEntity>({
    id: getParamValue(params.id),
    title: getParamValue(params.title),
    description: getParamValue(params.description),
    priority: getPriority(params.priority),
  });

  const [imageUri, setImageUri] = useState(
    getParamValue(params.imageUrl),
  );

  const [dataStates, setDataStates] =
    useState<DataStates>(DATA_STATES_DEFAULT);

  const onChangeTitle = (title: string) => {
    setTask((current) => ({
      ...current,
      title,
    }));
  };

  const onChangeDescription = (description: string) => {
    setTask((current) => ({
      ...current,
      description,
    }));
  };

  const onChangePriority = (priority: TaskPriority) => {
    setTask((current) => ({
      ...current,
      priority,
    }));
  };

  const handleSubmit = async () => {
    setDataStates({
      ...DATA_STATES_DEFAULT,
      isLoading: true,
    });

    try {
      // Si es una foto nueva la subimos, si ya tiene URL usamos la misma
      const imageUrl =
        imageUri && !imageUri.startsWith("http")
          ? await uploadTaskImage(imageUri)
          : imageUri || undefined;

      const result = await updateTaskUseCase.execute({
        ...task,
        imageUrl,
      });

      setDataStates({
        ...DATA_STATES_DEFAULT,
        data: result,
      });

      // Después de guardar volvemos al listado de tareas
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
    onChangeTitle,
    onChangeDescription,
    onChangePriority,
    onChangeImage: setImageUri,
  };
};