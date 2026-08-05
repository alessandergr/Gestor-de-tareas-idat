import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductRemoteDataSource } from "../data-sources/remote/product.remote.ds";

export class PostRepositoryImpl implements ProductRepository {
  constructor(
    private readonly productRemoteDataSource: ProductRemoteDataSource,
  ) {}

  async getProductList(): Promise<ProductEntity[]> {
    try {
      const response = await this.productRemoteDataSource.getProducts();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(product: ProductEntity) {
    try {
      const response =
        await this.productRemoteDataSource.createProduct(product);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(product: ProductEntity) {
    try {
      const response =
        await this.productRemoteDataSource.updateProduct(product);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      const response = await this.productRemoteDataSource.deleteProduct(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
