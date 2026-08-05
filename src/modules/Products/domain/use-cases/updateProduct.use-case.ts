import { ProductEntity } from "../entities/product.entity";
import { ProductRepository } from "../repositories/product.repository";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(product: ProductEntity): Promise<ProductEntity> {
    const result = await this.productRepository.updateProduct(product);
    return result;
  }
}
