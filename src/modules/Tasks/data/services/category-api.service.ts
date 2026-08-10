export interface TaskCategory {
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

// Traemos las categorías desde un servicio REST
export const getTaskCategories = async (): Promise<
  TaskCategory[]
> => {
  const response = await fetch(CATEGORIES_URL);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las categorías");
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    throw new Error("Respuesta de categorías no válida");
  }

  const tags = data.filter(
    (item): item is string => typeof item === "string",
  );

  // Solo mostramos categorías que realmente llegaron desde la API
  return CATEGORY_OPTIONS.filter((category) =>
    tags.includes(category.id),
  );
};