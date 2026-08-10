import { ActivityIndicator, FlatList, StyleSheet, View, type ListRenderItemInfo, } from "react-native";

import { Background } from "@/core/components/Background.component";
import { CustomModal } from "@/core/components/CustomModal.component";
import { useThemeContext } from "@/core/contexts/theme.context";

import { TaskEntity } from "../../domain/entities/task.entity";
import { TaskCard } from "../components/TaskCard.component";
import { TaskHeader } from "../components/TaskHeader.component";
import { TaskListState } from "../components/TaskListState.component";
import { useDeleteTask } from "../hooks/useDeleteTask.hook";
import { useTaskList } from "../hooks/useTaskList.hook";

// Acá mostramos todas las tareas y conectamos sus acciones
export const TaskListScreen = () => {
  const { palette } = useThemeContext();

  const {
    dataStates,
    handleView,
    handleEdit,
    handleAddPress,
    loadTasks,
  } = useTaskList();

  const {
    confirmDelete,
    handleDelete,
    hideModal,
    isVisibleModal,
    deleteStatus,
  } = useDeleteTask({
    reloadTasks: loadTasks,
  });

  // Cada elemento de la lista se muestra usando la misma tarjeta
  const renderItem = ({
    item,
  }: ListRenderItemInfo<TaskEntity>) => (
    <TaskCard
      title={item.title}
      description={item.description}
      priority={item.priority}
      onView={() => handleView(item)}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.id ?? "")}
    />
  );

  // Mientras carga o elimina evitamos que el usuario siga tocando opciones
  if (dataStates.isLoading || deleteStatus.isLoading) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: palette.colors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={palette.colors.primary.default}
        />
      </View>
    );
  }

  return (
    <>
      <Background>
        <TaskHeader
          count={dataStates.data.length}
          onAddPress={handleAddPress}
        />

        <FlatList
          data={dataStates.data}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id ?? `task-${index}`
          }
          contentContainerStyle={[
            styles.list,
            dataStates.data.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <TaskListState
              isError={dataStates.isError}
              onRetry={loadTasks}
            />
          }
        />
      </Background>

      {/* Pedimos confirmación antes de eliminar la tarea */}
      <CustomModal
        visible={isVisibleModal}
        onCancel={hideModal}
        onConfirm={confirmDelete}
        title="¿Eliminar tarea?"
        message="La tarea eliminada no podrá recuperarse."
      />
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flexGrow: 1,
    gap: 14,
    paddingBottom: 24,
  },
  emptyList: {
    justifyContent: "center",
  },
});