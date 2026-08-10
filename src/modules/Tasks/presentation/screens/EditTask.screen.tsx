import { Background } from "@/core/components/Background.component";

import { TaskForm } from "../components/TaskForm.component";
import { TaskFormHeader } from "../components/TaskFormHeader.component";
import { useEditTask } from "../hooks/useEditTask.hook";

// Esta pantalla conecta el formulario con la tarea que estamos editando
export const EditTaskScreen = () => {
  const {
    handleSubmit,
    onChangeDescription,
    onChangeTitle,
    onChangePriority,
    task,
    dataStates,
    imageUri,
    onChangeImage,
  } = useEditTask();

  return (
    <Background>
      <TaskFormHeader title="Editar tarea" />

      {/* Mandamos también la prioridad actual para poder cambiarla */}
      <TaskForm
        title={task.title}
        description={task.description}
        priority={task.priority}
        imageUri={imageUri}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
        onChangeTitle={onChangeTitle}
        onChangeDescription={onChangeDescription}
        onChangePriority={onChangePriority}
        onChangeImage={onChangeImage}
        loading={dataStates.isLoading}
        disabled={dataStates.isLoading}
      />
    </Background>
  );
};