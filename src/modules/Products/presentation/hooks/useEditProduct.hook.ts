import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useState } from "react";

import { uploadTaskImage } from "../../data/services/cloudinary-upload.service";
import { updateProductUseCase } from "../../di/product.dependencies";
import { ProductEntity } from "../../domain/entities/product.entity";

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

  const params =
    useLocalSearchParams() as unknown as ProductEntity;

  const [product, setProduct] = useState({
    id: params.id,
    title: params.title,
    description: params.description,
  });

  const [imageUri, setImageUri] = useState(
    params.imageUrl ?? "",
  );

  const [dataStates, setDataStates] =
    useState<DataStates>(DATA_STATES_DEFAULT);

  const onChangeTitle = (title: string) => {
    setProduct((current) => ({
      ...current,
      title,
    }));
  };

  const onChangeMessage = (
    description: string,
  ) => {
    setProduct((current) => ({
      ...current,
      description,
    }));
  };

  const handleSubmit = async () => {
    setDataStates({
      ...DATA_STATES_DEFAULT,
      isLoading: true,
    });

    try {
      const imageUrl =
        imageUri && !imageUri.startsWith("http")
          ? await uploadTaskImage(imageUri)
          : imageUri || undefined;

      const result =
        await updateProductUseCase.execute({
          ...product,
          imageUrl,
        });

      setDataStates({
        ...DATA_STATES_DEFAULT,
        data: result,
      });

      router.replace("/products");
    } catch {
      setDataStates({
        ...DATA_STATES_DEFAULT,
        isError: true,
      });
    }
  };

  return {
    product,
    imageUri,
    dataStates,
    handleSubmit,
    onChangeTitle,
    onChangeMessage,
    onChangeImage: setImageUri,
  };
};