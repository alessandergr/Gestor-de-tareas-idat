import { ProductEntity } from "../entities/product.entity";
import { ProductRepository } from "../repositories/product.repository";

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<ProductEntity[]> {
    const result = await this.productRepository.getProductList();
    // AQUÍ VA LA LÓGICA DE NEGOCIO:
    // Por ejemplo, filtrar solo los posts activos o ordenarlos por fecha
    return result;
  }
}
