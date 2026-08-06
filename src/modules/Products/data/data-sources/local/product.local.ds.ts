import { getDatabase } from "@/config/database/database.config";

import { ProductEntity } from "../../../domain/entities/product.entity";
import { ProductModel } from "../../models/product.model";

type PendingAction = "create" | "update" | "delete";

interface ProductRow {
  id: string;
  title: string;
  description: string;
  pending_action: PendingAction | null;
}

export interface ProductLocalDataSource {
  getProducts: () => Promise<ProductModel[]>;
  replaceProducts: (
    products: ProductModel[],
  ) => Promise<void>;
  saveProduct: (
    product: ProductModel,
  ) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  createPendingProduct: (
    product: ProductEntity,
  ) => Promise<ProductModel>;
  updatePendingProduct: (
    product: ProductEntity,
  ) => Promise<ProductModel>;
  deletePendingProduct: (
    id: string,
  ) => Promise<ProductModel>;
}

export class ProductLocalDataSourceImpl
  implements ProductLocalDataSource
{
  async getProducts(): Promise<ProductModel[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<ProductRow>(`
        SELECT id, title, description, pending_action
        FROM tasks
        WHERE is_deleted = 0
        ORDER BY rowid DESC
      `);

    return rows.map(
      (row) =>
        new ProductModel(
          row.title,
          row.description,
          row.id,
        ),
    );
  }

  async replaceProducts(
    products: ProductModel[],
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      await database.runAsync(
        "DELETE FROM tasks WHERE pending_action IS NULL",
      );

      for (const product of products) {
        if (!product.id) continue;

        await database.runAsync(
          `
            INSERT OR IGNORE INTO tasks (
              id,
              title,
              description,
              pending_action,
              is_deleted
            )
            VALUES (?, ?, ?, NULL, 0)
          `,
          product.id,
          product.title,
          product.description,
        );
      }
    });
  }

  async saveProduct(
    product: ProductModel,
  ): Promise<void> {
    if (!product.id) return;

    const database = await getDatabase();

    await database.runAsync(
      `
        INSERT OR REPLACE INTO tasks (
          id,
          title,
          description,
          pending_action,
          is_deleted
        )
        VALUES (?, ?, ?, NULL, 0)
      `,
      product.id,
      product.title,
      product.description,
    );
  }

  async removeProduct(id: string): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      "DELETE FROM tasks WHERE id = ?",
      id,
    );
  }

  async createPendingProduct(
    product: ProductEntity,
  ): Promise<ProductModel> {
    const database = await getDatabase();
    const id = `local-${Date.now()}`;

    await database.runAsync(
      `
        INSERT INTO tasks (
          id,
          title,
          description,
          pending_action,
          is_deleted
        )
        VALUES (?, ?, ?, 'create', 0)
      `,
      id,
      product.title,
      product.description,
    );

    return new ProductModel(
      product.title,
      product.description,
      id,
    );
  }

  async updatePendingProduct(
    product: ProductEntity,
  ): Promise<ProductModel> {
    if (!product.id) {
      throw new Error("Task ID is required");
    }

    const database = await getDatabase();

    const current =
      await database.getFirstAsync<ProductRow>(
        "SELECT * FROM tasks WHERE id = ?",
        product.id,
      );

    if (!current) {
      throw new Error("Task not found");
    }

    const action: PendingAction =
      current.pending_action === "create"
        ? "create"
        : "update";

    await database.runAsync(
      `
        UPDATE tasks
        SET title = ?,
            description = ?,
            pending_action = ?
        WHERE id = ?
      `,
      product.title,
      product.description,
      action,
      product.id,
    );

    return new ProductModel(
      product.title,
      product.description,
      product.id,
    );
  }

  async deletePendingProduct(
    id: string,
  ): Promise<ProductModel> {
    const database = await getDatabase();

    const current =
      await database.getFirstAsync<ProductRow>(
        "SELECT * FROM tasks WHERE id = ?",
        id,
      );

    if (!current) {
      throw new Error("Task not found");
    }

    if (current.pending_action === "create") {
      await database.runAsync(
        "DELETE FROM tasks WHERE id = ?",
        id,
      );
    } else {
      await database.runAsync(
        `
          UPDATE tasks
          SET pending_action = 'delete',
              is_deleted = 1
          WHERE id = ?
        `,
        id,
      );
    }

    return new ProductModel(
      current.title,
      current.description,
      current.id,
    );
  }
}