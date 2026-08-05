import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Background } from "@/core/components/Background.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { ProductFormHeader } from "../components/ProductFormHeader.component";

const readParam = (
  value: string | string[] | undefined,
) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export const TaskDetailScreen = () => {
  const { palette } = useThemeContext();
  const params = useLocalSearchParams();

  const title = readParam(params.title);
  const description = readParam(params.description);

  return (
    <Background>
      <ProductFormHeader title="Detalle de tarea" />

      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.colors.surface,
            borderColor: palette.colors.border,
            ...palette.shadows.sm,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: palette.texts.secondary },
          ]}
        >
          Título
        </Text>

        <Text
          style={[
            styles.title,
            { color: palette.texts.primary },
          ]}
        >
          {title || "Sin título"}
        </Text>

        <View
          style={[
            styles.divider,
            { backgroundColor: palette.colors.divider },
          ]}
        />

        <Text
          style={[
            styles.label,
            { color: palette.texts.secondary },
          ]}
        >
          Descripción
        </Text>

        <Text
          style={[
            styles.description,
            { color: palette.texts.primary },
          ]}
        >
          {description || "Sin descripción"}
        </Text>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  title: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
  },
});