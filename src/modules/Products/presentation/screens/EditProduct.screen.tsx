import { Background } from "@/core/components/Background.component";
import { ProductFormHeader } from "../components/ProductFormHeader.component";
import { ProductForm } from "../components/ProductForm.component";
import { useEditProduct } from "../hooks/useEditProduct.hook";

export const EditProductScreen = () => {
  const { handleSubmit, onChangeMessage, onChangeTitle, product, dataStates } =
    useEditProduct();

  return (
    <Background>
      <ProductFormHeader title="Editar producto" />
      <ProductForm
        title={product.title}
        onSubmit={handleSubmit}
        onChangeTitle={onChangeTitle}
        loading={dataStates.isLoading}
        disabled={dataStates.isLoading}
        description={product.description}
        onChangeMessage={onChangeMessage}
      />
    </Background>
  );
};
