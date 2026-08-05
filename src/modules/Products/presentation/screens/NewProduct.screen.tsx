import { ProductFormHeader } from "../components/ProductFormHeader.component";
import { ProductForm } from "../components/ProductForm.component";
import { Background } from "@/core/components/Background.component";
import { useNewProduct } from "../hooks/useNewProduct.hook";

export const NewProductScreen = () => {
  const {
    dataStates,
    handleSubmit,
    onChangeDescription,
    onChangeTitle,
    product,
  } = useNewProduct();
  return (
    <Background>
      <ProductFormHeader title="Crear producto" />
      <ProductForm
        title={product.title}
        onSubmit={handleSubmit}
        onChangeTitle={onChangeTitle}
        loading={dataStates.isLoading}
        disabled={dataStates.isLoading}
        description={product.description}
        onChangeMessage={onChangeDescription}
      />
    </Background>
  );
};
