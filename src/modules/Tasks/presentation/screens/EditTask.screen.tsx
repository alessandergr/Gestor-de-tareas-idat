import { Background } from "@/core/components/Background.component";
import { TaskForm } from "../components/TaskForm.component";
import { TaskFormHeader } from "../components/TaskFormHeader.component";
import { useEditTask } from "../hooks/useEditTask.hook";

export const EditTaskScreen = () => {
  const {
    task,
    imageUri,
    dataStates,
    handleSubmit,
    onChangeTitle,
    onChangeDescription,
    onChangePriority,
    onChangeCategory,
    onChangeImage,
  } = useEditTask();

  return (
    <Background>
      <TaskFormHeader title="Editar tarea" />

      <TaskForm
        title={task.title}
        description={task.description}
        priority={task.priority}
        category={task.category}
        imageUri={imageUri}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
        onChangeTitle={onChangeTitle}
        onChangeDescription={onChangeDescription}
        onChangePriority={onChangePriority}
        onChangeCategory={onChangeCategory}
        onChangeImage={onChangeImage}
        loading={dataStates.isLoading}
        disabled={dataStates.isLoading}
      />
    </Background>
  );
};