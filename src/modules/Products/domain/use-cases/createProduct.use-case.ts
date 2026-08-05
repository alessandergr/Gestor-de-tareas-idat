import { ProductEntity } from "../entities/product.entity";
import { ProductRepository } from "../repositories/product.repository";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(product: ProductEntity): Promise<ProductEntity> {
    const result = await this.productRepository.createProduct(product);
    return result;
  }
}
