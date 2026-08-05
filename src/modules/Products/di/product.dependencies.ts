import { ProductRemoteDataSourceImpl } from "../data/data-sources/remote/product.remote.ds";
import { PostRepositoryImpl } from "../data/repositories/product.repository.impl";
import { CreateProductUseCase } from "../domain/use-cases/createProduct.use-case";
import { DeleteProductUseCase } from "../domain/use-cases/deleteProduct.use-case";
import { GetProductsUseCase } from "../domain/use-cases/getProducts.use-case";
import { UpdateProductUseCase } from "../domain/use-cases/updateProduct.use-case";

// Se instancian UNA sola vez cuando el módulo se importa por primera vez.
// Node/Metro cachea el módulo, así que las siguientes importaciones
// reutilizan las mismas instancias (comportamiento de singleton).

// Data sources
const productRemoteDataSource = new ProductRemoteDataSourceImpl();

// Repositories
const productRepository = new PostRepositoryImpl(productRemoteDataSource);

// Use Cases
export const getProductUseCase = new GetProductsUseCase(productRepository);
export const createProductUseCase = new CreateProductUseCase(productRepository);
export const updateProductUseCase = new UpdateProductUseCase(productRepository);
export const deleteProductUseCase = new DeleteProductUseCase(productRepository);
