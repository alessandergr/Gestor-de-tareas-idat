import { ProductLocalDataSourceImpl } from "../data/data-sources/local/product.local.ds";
import { ProductRemoteDataSourceImpl } from "../data/data-sources/remote/product.remote.ds";
import { PostRepositoryImpl } from "../data/repositories/product.repository.impl";
import { CreateProductUseCase } from "../domain/use-cases/createProduct.use-case";
import { DeleteProductUseCase } from "../domain/use-cases/deleteProduct.use-case";
import { GetProductsUseCase } from "../domain/use-cases/getProducts.use-case";
import { UpdateProductUseCase } from "../domain/use-cases/updateProduct.use-case";

const productRemoteDataSource =
  new ProductRemoteDataSourceImpl();

const productLocalDataSource =
  new ProductLocalDataSourceImpl();

const productRepository = new PostRepositoryImpl(
  productRemoteDataSource,
  productLocalDataSource,
);

export const getProductUseCase =
  new GetProductsUseCase(productRepository);

export const createProductUseCase =
  new CreateProductUseCase(productRepository);

export const updateProductUseCase =
  new UpdateProductUseCase(productRepository);

export const deleteProductUseCase =
  new DeleteProductUseCase(productRepository);