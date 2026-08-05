import { ProductEntity } from "../entities/product.entity";
import { ProductRepository } from "../repositories/product.repository";

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<ProductEntity> {
    const result = await this.productRepository.deleteProduct(id);
    return result;
  }
}
