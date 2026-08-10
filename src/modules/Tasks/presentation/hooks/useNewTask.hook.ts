import { useRouter } from "expo-router";
import { useState } from "react";

import { uploadTaskImage } from "../../data/services/cloudinary-upload.service";
import { createTaskUseCase } from "../../di/task.dependencies";
import { TaskEntity, TaskPriority } from "../../domain/entities/task.entity";

const DEFAULT_STATE = {
  isLoading: false,
  isError: false,
  data: null as TaskEntity | null,
};

// Acá guardamos los datos de la nueva tarea
export const useNewTask = () => {
  const router = useRouter();

  const [task, setTask] = useState<TaskEntity>({
    title: "",
    description: "",
    priority: "medium",
  });

  const [imageUri, setImageUri] = useState("");
  const [dataStates, setDataStates] = useState(DEFAULT_STATE);

  const updateTask = (changes: Partial<TaskEntity>) => {
    setTask((current) => ({ ...current, ...changes }));
  };

  // Cada opción del formulario actualiza solamente el dato que cambió
  const handleSubmit = async () => {
    setDataStates({ ...DEFAULT_STATE, isLoading: true });

    try {
      const imageUrl = imageUri
        ? await uploadTaskImage(imageUri)
        : undefined;

      const result = await createTaskUseCase.execute({
        ...task,
        imageUrl,
      });

      setDataStates({ ...DEFAULT_STATE, data: result });
      router.replace("/tasks");
    } catch {
      setDataStates({ ...DEFAULT_STATE, isError: true });
    }
  };

  return {
    task,
    imageUri,
    dataStates,
    handleSubmit,
    onChangeTitle: (title: string) => updateTask({ title }),
    onChangeDescription: (description: string) =>
      updateTask({ description }),
    onChangePriority: (priority: TaskPriority) =>
      updateTask({ priority }),
    onChangeImage: setImageUri,
  };
};