import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ProductEntity } from "../../domain/entities/product.entity";
import { updateProductUseCase } from "../../di/product.dependencies";

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

export const useEditProduct = () => {
  const router = useRouter();
  const params = useLocalSearchParams() as unknown as ProductEntity;
  const [product, setProduct] = useState({
    id: params.id,
    title: params.title,
    description: params.description,
  });
  const [dataStates, setDataStates] = useState<DataStates>(DATA_STATES_DEFAULT);

  const onChangeTitle = (title: string) => {
    setProduct({
      ...product,
      title,
    });
  };

  const onChangeMessage = (description: string) => {
    setProduct({
      ...product,
      description,
    });
  };

  const handleSubmit = async () => {
    setDataStates({ ...DATA_STATES_DEFAULT, isLoading: true });
    try {
      const result = await updateProductUseCase.execute(product);
      router.push("/products");
      setDataStates({ ...DATA_STATES_DEFAULT, data: result });
    } catch (error) {
      setDataStates({ ...DATA_STATES_DEFAULT, isError: true });
    }
  };

  return { handleSubmit, product, onChangeTitle, onChangeMessage, dataStates };
};
