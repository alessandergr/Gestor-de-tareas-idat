import { Background } from "@/core/components/Background.component";

import { TaskForm } from "../components/TaskForm.component";
import { TaskFormHeader } from "../components/TaskFormHeader.component";
import { useNewTask } from "../hooks/useNewTask.hook";

// Esta pantalla conecta el formulario con una tarea nueva
export const NewTaskScreen = () => {
  const {
    task,
    imageUri,
    dataStates,
    handleSubmit,
    onChangeTitle,
    onChangeDescription,
    onChangePriority,
    onChangeImage,
  } = useNewTask();

  return (
    <Background>
      <TaskFormHeader title="Nueva tarea" />

      {/* El formulario recibe también la prioridad elegida */}
      <TaskForm
        title={task.title}
        description={task.description}
        priority={task.priority}
        imageUri={imageUri}
        submitLabel="Crear tarea"
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