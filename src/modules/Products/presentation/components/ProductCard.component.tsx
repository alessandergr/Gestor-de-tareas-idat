import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeContext } from "@/core/contexts/theme.context";
import { IconButton } from "@/core/components/IconButton.component";

interface ProductCardProps {
  title: string;
  description?: string;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
}

export const ProductCard: FC<ProductCardProps> = ({
  title,
  description,
  onEdit,
  onDelete,
}) => {
  const { palette } = useThemeContext();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.colors.surface,
          ...palette.shadows.sm,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: palette.texts.primary }]}
        >
          {title}
        </Text>
        <View style={styles.actions}>
          <IconButton
            icon={Feather}
            name="edit-3"
            color="primary"
            onPress={onEdit}
          />
          <IconButton
            icon={MaterialIcons}
            name="delete-outline"
            color="error"
            onPress={onDelete}
          />
        </View>
      </View>
      <Text
        numberOfLines={4}
        style={[styles.description, { color: palette.texts.secondary }]}
      >
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  title: {
    maxWidth: "65%",
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
  },
});
