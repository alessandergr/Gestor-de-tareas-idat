import {
  View,
  FlatList,
  ActivityIndicator,
  ListRenderItemInfo,
} from "react-native";
import { Background } from "@/core/components/Background.component";
import { ProductCard } from "../components/ProductCard.component";
import { ProductHeader } from "../components/ProductHeader.component";
import { useProductList } from "../hooks/useProductList.hook";
import { CustomModal } from "@/core/components/CustomModal.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { ProductEntity } from "../../domain/entities/product.entity";
import { useDeleteProduct } from "../hooks/useDeleteProduct.hook";

export const ProductListScreen = () => {
  const { palette } = useThemeContext();
  const { dataStates, handleEdit, handleAddPress, loadData } = useProductList();
  const {
    confirmDelete,
    handleDelete,
    hiddenModal,
    isVisibleModal,
    deleteStatus,
  } = useDeleteProduct({ reloadProducts: loadData });

  const renderItem = ({ item }: ListRenderItemInfo<ProductEntity>) => {
    return (
      <ProductCard
        title={item.title}
        description={item.description}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item.id ?? "")}
      />
    );
  };

  if (dataStates.isLoading || deleteStatus.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          size={"large"}
          color={palette.colors.primary.default}
        />
      </View>
    );
  }

  return (
    <>
      <Background>
        <ProductHeader title="Mi Lista" onAddPress={handleAddPress} />
        <FlatList
          data={dataStates.data}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </Background>
      <CustomModal
        onCancel={hiddenModal}
        visible={isVisibleModal}
        onConfirm={confirmDelete}
        title={`¿Desea eliminar titulo?`}
        message="Al eliminar el titulo no podra ser recuperado"
      />
    </>
  );
};
