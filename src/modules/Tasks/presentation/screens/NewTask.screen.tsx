import { Background } from "@/core/components/Background.component";
import { TaskForm } from "../components/TaskForm.component";
import { TaskFormHeader } from "../components/TaskFormHeader.component";
import { useNewTask } from "../hooks/useNewTask.hook";

export const NewTaskScreen = () => {
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
  } = useNewTask();

  return (
    <Background>
      <TaskFormHeader title="Nueva tarea" />

      <TaskForm
        title={task.title}
        description={task.description}
        priority={task.priority}
        category={task.category}
        imageUri={imageUri}
        submitLabel="Crear tarea"
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