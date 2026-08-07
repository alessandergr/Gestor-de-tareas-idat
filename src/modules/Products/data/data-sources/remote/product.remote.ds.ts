import { firebaseAuth } from "@/config/firebase/firebase.config";
import { ProductEntity } from "@/modules/Products/domain/entities/product.entity";

import { ProductDtoResponse } from "../../dtos/product.dto";
import { ProductModel } from "../../models/product.model";

const API_URL =
  "https://6a64ba3406b3848d4b8659e8.mockapi.io/api/v1/products";

interface ProductRemoteDto
  extends ProductDtoResponse {
  userId?: string;
}

const getCurrentUserId = (): string => {
  const userId = firebaseAuth.currentUser?.uid;

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  return userId;
};

const validateResponse = (
  response: Response,
): void => {
  if (!response.ok) {
    throw new Error(
      `Error HTTP: ${response.status}`,
    );
  }
};

export interface ProductRemoteDataSource {
  getProducts: () => Promise<ProductModel[]>;

  createProduct: (
    product: ProductEntity,
  ) => Promise<ProductModel>;

  updateProduct: (
    product: ProductEntity,
  ) => Promise<ProductModel>;

  deleteProduct: (
    id: string,
  ) => Promise<ProductModel>;
}

export class ProductRemoteDataSourceImpl
  implements ProductRemoteDataSource
{
  async getProducts(): Promise<ProductModel[]> {
    const userId = getCurrentUserId();

    const response = await fetch(API_URL);

    validateResponse(response);

    const json =
      (await response.json()) as ProductRemoteDto[];

    return json
      .filter(
        (product) => product.userId === userId,
      )
      .map((product) =>
        ProductModel.fromDTO(product),
      );
  }

  async createProduct(
    product: ProductEntity,
  ): Promise<ProductModel> {
    const userId = getCurrentUserId();

    const model =
      ProductModel.fromEntity(product);

    const dto = model.toDTO();

    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        ...dto,
        userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    validateResponse(response);

    const json =
      (await response.json()) as ProductRemoteDto;

    return ProductModel.fromDTO(json);
  }

  async updateProduct(
    product: ProductEntity,
  ): Promise<ProductModel> {
    if (!product.id) {
      throw new Error("Task ID is required");
    }

    const userId = getCurrentUserId();

    const model =
      ProductModel.fromEntity(product);

    const dto = model.toDTO();

    const response = await fetch(
      `${API_URL}/${product.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...dto,
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    validateResponse(response);

    const json =
      (await response.json()) as ProductRemoteDto;

    return ProductModel.fromDTO(json);
  }

  async deleteProduct(
    id: string,
  ): Promise<ProductModel> {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      },
    );

    validateResponse(response);

    const json =
      (await response.json()) as ProductRemoteDto;

    return ProductModel.fromDTO(json);
  }
}