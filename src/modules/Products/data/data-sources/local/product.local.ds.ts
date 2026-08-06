import { getDatabase } from "@/config/database/database.config";

import { ProductModel } from "../../models/product.model";

interface ProductRow {
  id: string;
  title: string;
  description: string;
}

export interface ProductLocalDataSource {
  getProducts: () => Promise<ProductModel[]>;

  replaceProducts: (
    products: ProductModel[],
  ) => Promise<void>;
}

export class ProductLocalDataSourceImpl
  implements ProductLocalDataSource
{
  async getProducts(): Promise<ProductModel[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<ProductRow>(
        `
          SELECT id, title, description
          FROM tasks
          ORDER BY rowid DESC
        `,
      );

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

    await database.withTransactionAsync(
      async () => {
        await database.runAsync(
          "DELETE FROM tasks",
        );

        for (const product of products) {
          if (!product.id) {
            continue;
          }

          await database.runAsync(
            `
              INSERT INTO tasks (
                id,
                title,
                description
              )
              VALUES (?, ?, ?)
            `,
            product.id,
            product.title,
            product.description,
          );
        }
      },
    );
  }
}