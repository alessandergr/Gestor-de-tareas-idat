import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductDtoResponse } from "../dtos/product.dto";

export class ProductModel implements ProductEntity {
  constructor(
    public title: string,
    public description: string,
    public id?: string,
    public imageUrl?: string,
  ) {}

  static fromDTO(
    dto: ProductDtoResponse,
  ): ProductModel {
    return new ProductModel(
      dto.title,
      dto.description,
      dto.id,
      dto.imageUrl,
    );
  }

  static fromEntity(
    product: ProductEntity,
  ): ProductModel {
    return new ProductModel(
      product.title,
      product.description,
      product.id,
      product.imageUrl,
    );
  }

  toDTO(): ProductDtoResponse {
    return {
      id: this.id ?? "",
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl,
    };
  }
}