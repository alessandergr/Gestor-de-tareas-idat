import { FC, useState } from "react";
import { ProductEntity } from "../../domain/entities/product.entity";
import { deleteProductUseCase } from "../../di/product.dependencies";

const DATA_STATES_DEFAULT = {
  isLoading: false,
  isError: false,
  data: null,
};

interface DataStates {
  isLoading: boolean;
  isError: boolean;
  data: ProductEntity | null;
}

interface DeleteProductHookProps {
  reloadProducts: () => void;
}

export const useDeleteProduct = ({
  reloadProducts,
}: DeleteProductHookProps) => {
  const [dataStates, setDataStates] = useState<DataStates>(DATA_STATES_DEFAULT);
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const hiddenModal = () => setIsVisibleModal(false);
  const showModal = () => setIsVisibleModal(true);

  const handleDelete = (id: string) => {
    setProductId(id);
    showModal();
  };

  const confirmDelete = async () => {
    setDataStates({ ...DATA_STATES_DEFAULT, isLoading: true });
    try {
      if (!productId) throw new Error("Product ID is required");
      const result = await deleteProductUseCase.execute(productId);
      reloadProducts();
      setDataStates({ ...DATA_STATES_DEFAULT, data: result });
    } catch (error) {
      setDataStates({ ...DATA_STATES_DEFAULT, isError: true });
    } finally {
      hiddenModal();
      setProductId(undefined);
    }
  };

  return {
    deleteStatus: dataStates,
    hiddenModal,
    handleDelete,
    confirmDelete,
    isVisibleModal,
  };
};
