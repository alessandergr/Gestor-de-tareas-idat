import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductDtoResponse } from "../dtos/product.dto";

export class ProductModel implements ProductEntity {
  constructor(
    public title: string,
    public description: string,
    public id?: string,
  ) {}

  static fromDTO(dto: ProductDtoResponse): ProductModel {
    return new ProductModel(dto.title, dto.description, dto.id);
  }

  static fromEntity(product: ProductEntity): ProductModel {
    return new ProductModel(product.title, product.description, product.id);
  }

  toDTO(): ProductDtoResponse {
    return {
      id: this.id ?? "",
      title: this.title,
      description: this.description,
    };
  }
}
