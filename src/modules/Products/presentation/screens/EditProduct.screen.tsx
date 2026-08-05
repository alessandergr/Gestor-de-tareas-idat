import { Background } from "@/core/components/Background.component";
import { ProductForm } from "../components/ProductForm.component";
import { ProductFormHeader } from "../components/ProductFormHeader.component";
import { useEditProduct } from "../hooks/useEditProduct.hook";

export const EditProductScreen = () => {
  const {
    handleSubmit,
    onChangeMessage,
    onChangeTitle,
    product,
    dataStates,
  } = useEditProduct();

  return (
    <Background>
      <ProductFormHeader title="Editar tarea" />

      <ProductForm
        title={product.title}
        description={product.description}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
        onChangeTitle={onChangeTitle}
        onChangeMessage={onChangeMessage}
        loading={dataStates.isLoading}
        disabled={dataStates.isLoading}
      />
    </Background>
  );
};