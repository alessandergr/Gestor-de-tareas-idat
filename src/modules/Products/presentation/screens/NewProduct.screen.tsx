import { Background } from "@/core/components/Background.component";
import { ProductForm } from "../components/ProductForm.component";
import { ProductFormHeader } from "../components/ProductFormHeader.component";
import { useNewProduct } from "../hooks/useNewProduct.hook";

export const NewProductScreen = () => {
  const {
    dataStates,
    handleSubmit,
    onChangeDescription,
    onChangeTitle,
    product,
    imageUri,
    onChangeImage,
  } = useNewProduct();

  return (
    <Background>
      <ProductFormHeader title="Nueva tarea" />

      <ProductForm
        title={product.title}
        description={product.description}
        submitLabel="Crear tarea"
        imageUri={imageUri}
        onChangeImage={onChangeImage}
        onSubmit={handleSubmit}
        onChangeTitle={onChangeTitle}
        onChangeMessage={onChangeDescription}
        loading={dataStates.isLoading}
        disabled={dataStates.isLoading}
      />
    </Background>
  );
};