import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";

import { Background } from "@/core/components/Background.component";
import { useThemeContext } from "@/core/contexts/theme.context";

// Expo Router puede devolver uno o varios valores, acá usamos solo uno
const getParamValue = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

export const TaskDetailScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();
  const params = useLocalSearchParams();

  const imageUrl = getParamValue(params.imageUrl);
  const title = getParamValue(params.title);
  const description = getParamValue(params.description);
  const priority = getParamValue(params.priority);

  // Mostramos la prioridad con el texto que entiende el usuario
  const priorityLabel =
    priority === "high"
      ? "Alta"
      : priority === "low"
        ? "Baja"
        : "Media";

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={[
              styles.backButton,
              {
                backgroundColor:
                  palette.colors.surfaceSecondary,
              },
            ]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={palette.texts.primary}
            />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              { color: palette.texts.primary },
            ]}
          >
            Detalle de tarea
          </Text>
        </View>

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
          {/* Mostramos la foto si la tarea tiene evidencia */}
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.emptyImage,
                {
                  backgroundColor:
                    palette.colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="image-outline"
                size={38}
                color={palette.texts.secondary}
              />

              <Text
                style={[
                  styles.emptyText,
                  { color: palette.texts.secondary },
                ]}
              >
                Sin evidencia fotográfica
              </Text>
            </View>
          )}

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

          {/* También mostramos la prioridad elegida */}
          <Text
            style={[
              styles.label,
              styles.priorityLabel,
              { color: palette.texts.secondary },
            ]}
          >
            Prioridad
          </Text>

          <Text
            style={[
              styles.priority,
              { color: palette.colors.primary.default },
            ]}
          >
            {priorityLabel}
          </Text>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  headerTitle: {
    marginLeft: 14,
    fontSize: 24,
    fontWeight: "700",
  },
  card: {
    padding: 18,
    borderWidth: 1,
    borderRadius: 18,
  },
  image: {
    width: "100%",
    height: 190,
    marginBottom: 22,
    borderRadius: 14,
  },
  emptyImage: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    borderRadius: 14,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  title: {
    marginBottom: 22,
    fontSize: 22,
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  priorityLabel: {
    marginTop: 22,
  },
  priority: {
    fontSize: 16,
    fontWeight: "700",
  },
});