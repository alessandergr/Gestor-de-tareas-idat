import { getDatabase } from "@/config/database/database.config";

export interface TaskCategory {
  id: string;
  label: string;
}

interface TaskCategoryRow {
  id: string;
  label: string;
}

const CATEGORIES_URL =
  "https://dummyjson.com/posts/tag-list";

const CATEGORY_OPTIONS: TaskCategory[] = [
  { id: "life", label: "Personal" },
  { id: "books", label: "Estudio" },
  { id: "activity", label: "Actividad" },
  { id: "market", label: "Compras" },
  { id: "family", label: "Familia" },
];

const saveCategories = async (
  categories: TaskCategory[],
): Promise<void> => {
  const database = await getDatabase();

  await database.withTransactionAsync(async () => {
    await database.runAsync(
      "DELETE FROM task_categories",
    );

    for (const [index, category] of
      categories.entries()) {
      await database.runAsync(
        `
          INSERT INTO task_categories (
            id,
            label,
            sort_order
          )
          VALUES (?, ?, ?)
        `,
        category.id,
        category.label,
        index,
      );
    }
  });
};

const getCachedCategories = async (): Promise<
  TaskCategory[]
> => {
  try {
    const database = await getDatabase();

    return await database.getAllAsync<TaskCategoryRow>(
      `
        SELECT id, label
        FROM task_categories
        ORDER BY sort_order ASC
      `,
    );
  } catch {
    return [];
  }
};

export const getTaskCategories = async (): Promise<
  TaskCategory[]
> => {
  try {
    const response = await fetch(CATEGORIES_URL);

    if (!response.ok) {
      throw new Error(
        "No se pudieron cargar las categorías",
      );
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      throw new Error(
        "Respuesta de categorías no válida",
      );
    }

    const tags = data.filter(
      (item): item is string =>
        typeof item === "string",
    );

    const categories = CATEGORY_OPTIONS.filter(
      (category) => tags.includes(category.id),
    );

    if (categories.length === 0) {
      throw new Error(
        "La API no devolvió categorías disponibles",
      );
    }

    await saveCategories(categories);

    return categories;
  } catch {
    const cachedCategories =
      await getCachedCategories();

    if (cachedCategories.length > 0) {
      return cachedCategories;
    }

    try {
      await saveCategories(CATEGORY_OPTIONS);
    } catch {
      // Si SQLite falla, todavía usamos la lista de respaldo.
    }

    return CATEGORY_OPTIONS;
  }
};