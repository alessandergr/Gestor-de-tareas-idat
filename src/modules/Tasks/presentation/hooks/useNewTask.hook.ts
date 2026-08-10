import { useRouter } from "expo-router";
import { useState } from "react";

import { uploadTaskImage } from "../../data/services/cloudinary-upload.service";
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

  const [task, setTask] = useState<TaskEntity>({
    title: "",
    description: "",
    priority: "medium",
    category: "",
  });

  const [imageUri, setImageUri] = useState("");

  const [dataStates, setDataStates] =
    useState<DataStates>(DATA_STATES_DEFAULT);

  // Evita repetir un setTask distinto para cada campo
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
      const imageUrl = imageUri
        ? await uploadTaskImage(imageUri)
        : undefined;

      const result = await createTaskUseCase.execute({
        ...task,
        imageUrl,
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
    onChangeDescription: (description: string) =>
      updateTask({ description }),
    onChangePriority: (
      priority: TaskEntity["priority"],
    ) => updateTask({ priority }),
    onChangeCategory: (category: string) =>
      updateTask({ category }),
    onChangeImage: setImageUri,
  };
};