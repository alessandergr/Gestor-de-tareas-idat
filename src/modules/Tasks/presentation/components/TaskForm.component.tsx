import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native";

import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";

import { TaskPriority } from "../../domain/entities/task.entity";
import { TaskImageField } from "./TaskImageField.component";

interface TaskFormProps {
  title: string;
  description: string;
  imageUri: string;
  priority: TaskPriority;
  submitLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
  onChangeTitle: (title: string) => void;
  onChangeDescription: (description: string) => void;
  onChangeImage: (uri: string) => void;
  onChangePriority: (priority: TaskPriority) => void;
}

interface FormErrors {
  title: string;
  description: string;
}

const PRIORITIES: {
  label: string;
  value: TaskPriority;
}[] = [
  { label: "Baja", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
];

// Usamos el mismo formulario tanto para crear como para editar una tarea
export const TaskForm = ({
  title,
  description,
  imageUri,
  priority,
  submitLabel,
  onSubmit,
  disabled,
  loading,
  onChangeTitle,
  onChangeDescription,
  onChangeImage,
  onChangePriority,
}: TaskFormProps) => {
  const { palette } = useThemeContext();

  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    description: "",
  });

  const validateAndSubmit = () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    let titleError = "";
    let descriptionError = "";

    // Revisamos los campos antes de guardar la tarea
    if (!cleanTitle) {
      titleError = "Ingrese un título";
    } else if (cleanTitle.length < 3) {
      titleError =
        "El título debe tener al menos 3 caracteres";
    }

    if (!cleanDescription) {
      descriptionError = "Ingrese una descripción";
    }

    setErrors({
      title: titleError,
      description: descriptionError,
    });

    if (titleError || descriptionError) return;

    onSubmit();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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

          {/* El usuario elige una de las tres prioridades antes de guardar */}
          <View style={styles.prioritySection}>
            <Text
              style={[
                styles.priorityLabel,
                { color: palette.texts.primary },
              ]}
            >
              Prioridad
            </Text>

            <View style={styles.priorityRow}>
              {PRIORITIES.map((item) => {
                const selected = priority === item.value;

                return (
                  <Pressable
                    key={item.value}
                    disabled={disabled || loading}
                    onPress={() =>
                      onChangePriority(item.value)
                    }
                    style={[
                      styles.priorityButton,
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
                      style={[
                        styles.priorityText,
                        {
                          color: selected
                            ? palette.texts.primaryButton
                            : palette.texts.primary,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* La fotografía sigue siendo opcional */}
          <TaskImageField
            imageUri={imageUri}
            onChangeImage={onChangeImage}
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title={loading ? "Guardando..." : submitLabel}
              onPress={validateAndSubmit}
              disabled={disabled || loading}
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
  prioritySection: {
    gap: 8,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "700",
  },
  buttonContainer: {
    height: 52,
  },
});