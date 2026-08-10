import { useState } from "react";

import { deleteTaskUseCase } from "../../di/task.dependencies";

interface DeleteState {
  isLoading: boolean;
  isError: boolean;
}

const DELETE_STATE_DEFAULT: DeleteState = {
  isLoading: false,
  isError: false,
};

interface DeleteTaskHookProps {
  reloadTasks: () => void;
}

// Guarda la tarea elegida hasta que el usuario confirme si quiere borrarla
export const useDeleteTask = ({
  reloadTasks,
}: DeleteTaskHookProps) => {
  const [deleteStatus, setDeleteStatus] =
    useState<DeleteState>(DELETE_STATE_DEFAULT);

  const [taskId, setTaskId] = useState<string>();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const hideModal = () => setIsVisibleModal(false);

  const handleDelete = (id: string) => {
    setTaskId(id);
    setIsVisibleModal(true);
  };

  const confirmDelete = async () => {
    if (!taskId) return;

    setDeleteStatus({
      ...DELETE_STATE_DEFAULT,
      isLoading: true,
    });

    try {
      // Eliminamos la tarea y luego actualizamos la lista que ve el usuario
      await deleteTaskUseCase.execute(taskId);
      reloadTasks();

      setDeleteStatus(DELETE_STATE_DEFAULT);
    } catch {
      setDeleteStatus({
        ...DELETE_STATE_DEFAULT,
        isError: true,
      });
    } finally {
      // Cerramos el modal y limpiamos el ID para la siguiente eliminación
      hideModal();
      setTaskId(undefined);
    }
  };

  return {
    deleteStatus,
    hideModal,
    handleDelete,
    confirmDelete,
    isVisibleModal,
  };
};