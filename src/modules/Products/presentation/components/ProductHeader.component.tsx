import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeContext } from "@/core/contexts/theme.context";

interface ProductHeaderProps {
  title: string;
  onAddPress: () => void;
}

export const ProductHeader = ({
  title,
  onAddPress,
}: ProductHeaderProps) => {
  const { palette } = useThemeContext();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.subtitle,
            { color: palette.texts.secondary },
          ]}
        >
          Organiza tus actividades
        </Text>

        <Text
          style={[
            styles.title,
            { color: palette.texts.primary },
          ]}
        >
          {title}
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Agregar nueva tarea"
        onPress={onAddPress}
        style={({ pressed }) => [
          styles.addButton,
          {
            backgroundColor:
              palette.colors.primary.default,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons
          name="add"
          size={28}
          color={palette.texts.primaryButton}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  subtitle: {
    marginBottom: 3,
    fontSize: 14,
  },
  title: {
    fontSize: 29,
    fontWeight: "700",
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});