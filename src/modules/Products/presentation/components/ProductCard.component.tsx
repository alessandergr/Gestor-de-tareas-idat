import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeContext } from "@/core/contexts/theme.context";

interface ProductCardProps {
  title: string;
  description?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductCard = ({
  title,
  description,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  const { palette } = useThemeContext();

  const detail =
    description?.trim() || "Sin descripción";

  return (
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
      <View style={styles.content}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor:
                palette.colors.surfaceSecondary,
            },
          ]}
        >
          <Ionicons
            name="document-text-outline"
            size={24}
            color={palette.colors.primary.default}
          />
        </View>

        <View style={styles.textBox}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: palette.texts.primary },
            ]}
          >
            {title}
          </Text>

          <Text
            numberOfLines={2}
            style={[
              styles.description,
              { color: palette.texts.secondary },
            ]}
          >
            {detail}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: palette.colors.divider },
        ]}
      />

      <View style={styles.actions}>
        <Pressable
          style={styles.action}
          onPress={onEdit}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={palette.colors.primary.dark}
          />

          <Text
            style={[
              styles.actionText,
              { color: palette.colors.primary.dark },
            ]}
          >
            Editar
          </Text>
        </Pressable>

        <Pressable
          style={styles.action}
          onPress={onDelete}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={palette.colors.error}
          />

          <Text
            style={[
              styles.actionText,
              { color: palette.colors.error },
            ]}
          >
            Eliminar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 18,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  textBox: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 22,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
});