import { useRouter } from "expo-router";
import { useState } from "react";

import { uploadTaskImage } from "../../data/services/cloudinary-upload.service";
import { createProductUseCase } from "../../di/product.dependencies";
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

export const useNewProduct = () => {
  const router = useRouter();

  const [product, setProduct] = useState({
    title: "",
    description: "",
  });

  const [imageUri, setImageUri] = useState("");

  const [dataStates, setDataStates] =
    useState<DataStates>(DATA_STATES_DEFAULT);

  const onChangeTitle = (title: string) => {
    setProduct((current) => ({
      ...current,
      title,
    }));
  };

  const onChangeDescription = (
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
      const imageUrl = imageUri
        ? await uploadTaskImage(imageUri)
        : undefined;

      const result =
        await createProductUseCase.execute({
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
    onChangeDescription,
    onChangeImage: setImageUri,
  };
};