import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductLocalDataSource } from "../data-sources/local/product.local.ds";
import { ProductRemoteDataSource } from "../data-sources/remote/product.remote.ds";

export class PostRepositoryImpl implements ProductRepository {
  constructor(
    private readonly productRemoteDataSource: ProductRemoteDataSource,
    private readonly productLocalDataSource: ProductLocalDataSource,
  ) {}

  async getProductList(): Promise<ProductEntity[]> {
    try {
      const products =
        await this.productRemoteDataSource.getProducts();

      await this.productLocalDataSource.replaceProducts(products);

      return products;
    } catch {
      return this.productLocalDataSource.getProducts();
    }
  }

  async createProduct(
    product: ProductEntity,
  ): Promise<ProductEntity> {
    const createdProduct =
      await this.productRemoteDataSource.createProduct(product);

    const localProducts =
      await this.productLocalDataSource.getProducts();

    await this.productLocalDataSource.replaceProducts([
      createdProduct,
      ...localProducts.filter(
        (item) => item.id !== createdProduct.id,
      ),
    ]);

    return createdProduct;
  }

  async updateProduct(
    product: ProductEntity,
  ): Promise<ProductEntity> {
    const updatedProduct =
      await this.productRemoteDataSource.updateProduct(product);

    const localProducts =
      await this.productLocalDataSource.getProducts();

    await this.productLocalDataSource.replaceProducts([
      updatedProduct,
      ...localProducts.filter(
        (item) => item.id !== updatedProduct.id,
      ),
    ]);

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<ProductEntity> {
    const deletedProduct =
      await this.productRemoteDataSource.deleteProduct(id);

    const localProducts =
      await this.productLocalDataSource.getProducts();

    await this.productLocalDataSource.replaceProducts(
      localProducts.filter((item) => item.id !== id),
    );

    return deletedProduct;
  }
}