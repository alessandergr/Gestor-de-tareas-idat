import { ProductEntity } from "@/modules/Products/domain/entities/product.entity";
import { ProductDtoResponse } from "../../dtos/product.dto";
import { ProductModel } from "../../models/product.model";

export interface ProductRemoteDataSource {
  getProducts: () => Promise<ProductModel[]>;
  createProduct: (post: ProductEntity) => Promise<ProductModel>;
  updateProduct: (post: ProductEntity) => Promise<ProductModel>;
  deleteProduct: (id: string) => Promise<ProductModel>;
}

export class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  async getProducts() {
    try {
      const response = await fetch(
        "https://6a64ba3406b3848d4b8659e8.mockapi.io/api/v1/products",
      );
      const json = (await response.json()) as ProductDtoResponse[];
      return json.map((product) => ProductModel.fromDTO(product));
    } catch (error) {
      throw error;
    }
  }

  async createProduct(product: ProductEntity) {
    try {
      const model = ProductModel.fromEntity(product);
      const dto = model.toDTO();
      const response = await fetch(
        "https://6a64ba3406b3848d4b8659e8.mockapi.io/api/v1/products",
        {
          method: "POST",
          body: JSON.stringify(dto),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const json = (await response.json()) as ProductDtoResponse;
      return ProductModel.fromDTO(json);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(post: ProductEntity) {
    try {
      const model = ProductModel.fromEntity(post);
      const dto = model.toDTO();
      const response = await fetch(
        `https://6a64ba3406b3848d4b8659e8.mockapi.io/api/v1/products/${post.id}`,
        {
          method: "PUT",
          body: JSON.stringify(dto),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const json = (await response.json()) as ProductDtoResponse;
      return ProductModel.fromDTO(json);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      const response = await fetch(
        `https://6a64ba3406b3848d4b8659e8.mockapi.io/api/v1/products/${id}`,
        {
          method: "DELETE",
        },
      );
      const json = (await response.json()) as ProductDtoResponse;
      return ProductModel.fromDTO(json);
    } catch (error) {
      throw error;
    }
  }
}
