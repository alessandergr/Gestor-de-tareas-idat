import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";

import {
  getTaskCategories,
  type TaskCategory,
} from "../../data/services/category-api.service";
import type { TaskPriority } from "../../domain/entities/task.entity";
import { TaskImageField } from "./TaskImageField.component";

interface TaskFormProps {
  title: string;
  description: string;
  imageUri: string;
  priority: TaskPriority;
  category: string;
  submitLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
  onChangeTitle: (title: string) => void;
  onChangeDescription: (description: string) => void;
  onChangeImage: (uri: string) => void;
  onChangePriority: (priority: TaskPriority) => void;
  onChangeCategory: (category: string) => void;
}

interface FormErrors {
  title: string;
  description: string;
  category: string;
}

const PRIORITIES: {
  value: TaskPriority;
  label: string;
}[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

export const TaskForm = ({
  title,
  description,
  imageUri,
  priority,
  category,
  submitLabel,
  onSubmit,
  disabled,
  loading,
  onChangeTitle,
  onChangeDescription,
  onChangeImage,
  onChangePriority,
  onChangeCategory,
}: TaskFormProps) => {
  const { palette } = useThemeContext();

  const [categories, setCategories] = useState<
    TaskCategory[]
  >([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);
  const [categoryError, setCategoryError] =
    useState(false);

  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    description: "",
    category: "",
  });

  // La lista viene de la API REST, no está escrita directamente en el formulario
  const loadCategories = async () => {
    setLoadingCategories(true);
    setCategoryError(false);

    try {
      const result = await getTaskCategories();
      setCategories(result);
    } catch {
      setCategoryError(true);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const validateAndSubmit = () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    const nextErrors: FormErrors = {
      title:
        cleanTitle.length === 0
          ? "Ingrese un título"
          : cleanTitle.length < 3
            ? "El título debe tener al menos 3 caracteres"
            : "",
      description:
        cleanDescription.length === 0
          ? "Ingrese una descripción"
          : "",
      category: !category
        ? "Seleccione una categoría"
        : "",
    };

    setErrors(nextErrors);

    if (
      nextErrors.title ||
      nextErrors.description ||
      nextErrors.category
    ) {
      return;
    }

    onSubmit();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <InputField
            label="Título"
            placeholder="Escribe un título"
            value={title}
            maxLength={60}
            error={errors.title}
            onChangeText={(value) => {
              onChangeTitle(value);

              if (errors.title) {
                setErrors((current) => ({
                  ...current,
                  title: "",
                }));
              }
            }}
          />

          <InputField
            label="Descripción"
            placeholder="Escribe una descripción"
            value={description}
            maxLength={300}
            multiline
            error={errors.description}
            onChangeText={(value) => {
              onChangeDescription(value);

              if (errors.description) {
                setErrors((current) => ({
                  ...current,
                  description: "",
                }));
              }
            }}
          />

          <View>
            <Text
              style={[
                styles.label,
                { color: palette.texts.primary },
              ]}
            >
              Categoría
            </Text>

            {loadingCategories ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator
                  size="small"
                  color={palette.colors.primary.default}
                />
                <Text
                  style={{
                    color: palette.texts.secondary,
                  }}
                >
                  Cargando categorías...
                </Text>
              </View>
            ) : categoryError ? (
              <Pressable onPress={() => void loadCategories()}>
                <Text
                  style={{
                    color: palette.colors.primary.default,
                  }}
                >
                  No se pudieron cargar. Toca para reintentar.
                </Text>
              </Pressable>
            ) : (
              <View style={styles.options}>
                {categories.map((item) => {
                  const selected =
                    category === item.label;

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        onChangeCategory(item.label);
                        setErrors((current) => ({
                          ...current,
                          category: "",
                        }));
                      }}
                      style={[
                        styles.option,
                        {
                          backgroundColor: selected
                            ? palette.colors.primary.default
                            : palette.colors.surfaceSecondary,
                          borderColor: selected
                            ? palette.colors.primary.default
                            : palette.colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected
                            ? palette.texts.primaryButton
                            : palette.texts.primary,
                        }}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {errors.category ? (
              <Text style={styles.error}>
                {errors.category}
              </Text>
            ) : null}
          </View>

          <View>
            <Text
              style={[
                styles.label,
                { color: palette.texts.primary },
              ]}
            >
              Prioridad
            </Text>

            <View style={styles.options}>
              {PRIORITIES.map((item) => {
                const selected =
                  priority === item.value;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() =>
                      onChangePriority(item.value)
                    }
                    style={[
                      styles.option,
                      {
                        backgroundColor: selected
                          ? palette.colors.primary.default
                          : palette.colors.surfaceSecondary,
                        borderColor: selected
                          ? palette.colors.primary.default
                          : palette.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected
                          ? palette.texts.primaryButton
                          : palette.texts.primary,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <TaskImageField
            imageUri={imageUri}
            onChangeImage={onChangeImage}
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title={
                loading
                  ? "Guardando..."
                  : submitLabel
              }
              onPress={validateAndSubmit}
              disabled={
                disabled ||
                loading ||
                loadingCategories
              }
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 120,
  },
  form: {
    gap: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "700",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  error: {
    marginTop: 7,
    fontSize: 12,
    color: "#D32F2F",
  },
  buttonContainer: {
    height: 52,
  },
});