import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";

import { TaskImageField } from "./TaskImageField.component";

interface ProductFormProps {
  title: string;
  description: string;
  imageUri: string;
  submitLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
  onChangeTitle: (title: string) => void;
  onChangeMessage: (description: string) => void;
  onChangeImage: (uri: string) => void;
}

interface FormErrors {
  title: string;
  description: string;
}

export const ProductForm = ({
  title,
  description,
  imageUri,
  submitLabel,
  onSubmit,
  disabled,
  loading,
  onChangeTitle,
  onChangeMessage,
  onChangeImage,
}: ProductFormProps) => {
  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    description: "",
  });

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
    };

    setErrors(nextErrors);

    if (nextErrors.title || nextErrors.description) {
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
              onChangeMessage(value);

              if (errors.description) {
                setErrors((current) => ({
                  ...current,
                  description: "",
                }));
              }
            }}
          />

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
  buttonContainer: {
    height: 52,
  },
});