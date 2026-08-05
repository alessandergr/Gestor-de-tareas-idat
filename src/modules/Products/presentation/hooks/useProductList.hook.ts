import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getProductUseCase } from "../../di/product.dependencies";
import { ProductEntity } from "../../domain/entities/product.entity";

const DATA_STATES_DEFAULT = {
  isLoading: false,
  isError: false,
  data: [],
};

interface DataStates {
  isLoading: boolean;
  isError: boolean;
  data: ProductEntity[];
}

export const useProductList = () => {
  const [dataStates, setDataStates] = useState<DataStates>(DATA_STATES_DEFAULT);
  const router = useRouter();

  const handleAddPress = () => {
    router.push("/products/new");
  };

  const handleEdit = (post: ProductEntity) => {
    router.push({
      pathname: `/products/[id]`,
      params: {
        id: post.id,
        title: post.title,
        description: post.description,
      },
    });
  };

  const loadData = async () => {
    setDataStates({ ...DATA_STATES_DEFAULT, isLoading: true });
    try {
      const result = await getProductUseCase.execute();
      setDataStates({ ...DATA_STATES_DEFAULT, data: result });
    } catch (error) {
      setDataStates({ ...DATA_STATES_DEFAULT, isError: true });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    loadData,
    dataStates,
    handleEdit,
    handleAddPress,
  };
};
