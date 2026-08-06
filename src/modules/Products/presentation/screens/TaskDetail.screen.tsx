import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Background } from "@/core/components/Background.component";
import { useThemeContext } from "@/core/contexts/theme.context";

interface DetailParams {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export const TaskDetailScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();

  const params =
    useLocalSearchParams() as unknown as DetailParams;

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.content}
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
              name="arrow-back"
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
              backgroundColor:
                palette.colors.surface,
              borderColor: palette.colors.border,
              ...palette.shadows.sm,
            },
          ]}
        >
          {params.imageUrl ? (
            <Image
              source={{ uri: params.imageUrl }}
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
                  {
                    color:
                      palette.texts.secondary,
                  },
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
            {params.title ?? "Sin título"}
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
            {params.description ??
              "Sin descripción"}
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
});