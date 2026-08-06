import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductLocalDataSource } from "../data-sources/local/product.local.ds";
import { ProductRemoteDataSource } from "../data-sources/remote/product.remote.ds";

export class PostRepositoryImpl
  implements ProductRepository
{
  constructor(
    private readonly productRemoteDataSource:
      ProductRemoteDataSource,
    private readonly productLocalDataSource:
      ProductLocalDataSource,
  ) {}

  async getProductList(): Promise<ProductEntity[]> {
    try {
      const products =
        await this.productRemoteDataSource.getProducts();

      await this.productLocalDataSource.replaceProducts(
        products,
      );

      return this.productLocalDataSource.getProducts();
    } catch {
      return this.productLocalDataSource.getProducts();
    }
  }

  async createProduct(
    product: ProductEntity,
  ): Promise<ProductEntity> {
    try {
      const result =
        await this.productRemoteDataSource.createProduct(
          product,
        );

      await this.productLocalDataSource.saveProduct(result);

      return result;
    } catch {
      return this.productLocalDataSource.createPendingProduct(
        product,
      );
    }
  }

  async updateProduct(
    product: ProductEntity,
  ): Promise<ProductEntity> {
    try {
      const result =
        await this.productRemoteDataSource.updateProduct(
          product,
        );

      await this.productLocalDataSource.saveProduct(result);

      return result;
    } catch {
      return this.productLocalDataSource.updatePendingProduct(
        product,
      );
    }
  }

  async deleteProduct(
    id: string,
  ): Promise<ProductEntity> {
    try {
      const result =
        await this.productRemoteDataSource.deleteProduct(id);

      await this.productLocalDataSource.removeProduct(id);

      return result;
    } catch {
      return this.productLocalDataSource.deletePendingProduct(
        id,
      );
    }
  }
}