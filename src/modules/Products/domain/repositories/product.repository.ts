import { ProductEntity } from "../entities/product.entity";

export interface ProductRepository {
  getProductList: () => Promise<ProductEntity[]>;
  createProduct: (post: ProductEntity) => Promise<ProductEntity>;
  updateProduct: (post: ProductEntity) => Promise<ProductEntity>;
  deleteProduct: (id: string) => Promise<ProductEntity>;
}
