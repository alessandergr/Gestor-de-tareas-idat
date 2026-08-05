import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from "react-native";

import { Background } from "@/core/components/Background.component";
import { CustomModal } from "@/core/components/CustomModal.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductCard } from "../components/ProductCard.component";
import { ProductHeader } from "../components/ProductHeader.component";
import { TaskListState } from "../components/TaskListState.component";
import { useDeleteProduct } from "../hooks/useDeleteProduct.hook";
import { useProductList } from "../hooks/useProductList.hook";

export const ProductListScreen = () => {
  const { palette } = useThemeContext();

  const {
    dataStates,
    handleEdit,
    handleAddPress,
    loadData,
  } = useProductList();

  const {
    confirmDelete,
    handleDelete,
    hiddenModal,
    isVisibleModal,
    deleteStatus,
  } = useDeleteProduct({
    reloadProducts: loadData,
  });

  const renderItem = ({
    item,
  }: ListRenderItemInfo<ProductEntity>) => (
    <ProductCard
      title={item.title}
      description={item.description}
      onEdit={() => handleEdit(item)}
      onDelete={() =>
        handleDelete(item.id ?? "")
      }
    />
  );

  if (
    dataStates.isLoading ||
    deleteStatus.isLoading
  ) {
    return (
      <View
        style={[
          styles.loading,
          {
            backgroundColor:
              palette.colors.background,
          },
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
        <ProductHeader
          title="Mis tareas"
          count={dataStates.data.length}
          onAddPress={handleAddPress}
        />

        <FlatList
          data={dataStates.data}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id ?? `task-${index}`
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            dataStates.data.length === 0 &&
              styles.emptyList,
          ]}
          ListEmptyComponent={
            <TaskListState
              isError={dataStates.isError}
              onRetry={loadData}
            />
          }
        />
      </Background>

      <CustomModal
        onCancel={hiddenModal}
        visible={isVisibleModal}
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