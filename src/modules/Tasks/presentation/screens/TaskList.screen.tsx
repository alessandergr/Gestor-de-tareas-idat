import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, type ListRenderItemInfo,} from "react-native";

import { Background } from "@/core/components/Background.component";
import { CustomModal } from "@/core/components/CustomModal.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";

import { TaskEntity } from "../../domain/entities/task.entity";
import { TaskCard } from "../components/TaskCard.component";
import { TaskHeader } from "../components/TaskHeader.component";
import { TaskListState } from "../components/TaskListState.component";
import { useDeleteTask } from "../hooks/useDeleteTask.hook";
import { useTaskList } from "../hooks/useTaskList.hook";

const FILTERS = [
  { label: "Todas", value: "all" },
  { label: "Baja", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
] as const;

// Acá mostramos las tareas y aplicamos búsqueda y prioridad
export const TaskListScreen = () => {
  const { palette } = useThemeContext();

  const {
    dataStates,
    filteredTasks,
    priorityFilter,
    searchText,
    setPriorityFilter,
    setSearchText,
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

  // Cada tarea usa la misma tarjeta con sus acciones
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
          count={filteredTasks.length}
          onAddPress={handleAddPress}
        />

        {/* Busca las tareas por su nombre */}
        <InputField
          label="Buscar tarea"
          placeholder="Escribe el nombre"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Filtramos las tareas por la prioridad elegida */}
        <View style={styles.filters}>
          {FILTERS.map((filter) => {
            const selected = priorityFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                onPress={() => setPriorityFilter(filter.value)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selected
                      ? palette.colors.primary.default
                      : palette.colors.surfaceSecondary,
                    borderColor: selected
                      ? palette.colors.primary.default
                      : palette.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selected
                        ? palette.texts.primaryButton
                        : palette.texts.primary,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id ?? `task-${index}`
          }
          contentContainerStyle={[
            styles.list,
            filteredTasks.length === 0 && styles.emptyList,
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

      {/* Confirmamos antes de borrar una tarea */}
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
  filters: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    marginBottom: 18,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 10,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
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