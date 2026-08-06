import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { getProductUseCase } from "../../di/product.dependencies";
import { ProductEntity } from "../../domain/entities/product.entity";

interface DataStates {
  isLoading: boolean;
  isError: boolean;
  data: ProductEntity[];
}

const DEFAULT_STATE: DataStates = {
  isLoading: false,
  isError: false,
  data: [],
};

export const useProductList = () => {
  const router = useRouter();

  const [dataStates, setDataStates] =
    useState<DataStates>(DEFAULT_STATE);

  const handleAddPress = () => {
    router.push("/products/new");
  };

  const handleView = (task: ProductEntity) => {
    router.push({
      pathname: "/products/detail",
      params: {
        id: task.id ?? "",
        title: task.title,
        description: task.description,
        imageUrl: task.imageUrl ?? "",
      },
    });
  };

  const handleEdit = (task: ProductEntity) => {
    router.push({
      pathname: "/products/[id]",
      params: {
        id: task.id ?? "",
        title: task.title,
        description: task.description,
        imageUrl: task.imageUrl ?? "",
      },
    });
  };

  const loadData = async () => {
    setDataStates({
      ...DEFAULT_STATE,
      isLoading: true,
    });

    try {
      const result =
        await getProductUseCase.execute();

      setDataStates({
        ...DEFAULT_STATE,
        data: result,
      });
    } catch {
      setDataStates({
        ...DEFAULT_STATE,
        isError: true,
      });
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return {
    dataStates,
    loadData,
    handleView,
    handleEdit,
    handleAddPress,
  };
};