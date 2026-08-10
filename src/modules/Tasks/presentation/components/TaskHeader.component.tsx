import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeContext } from "@/core/contexts/theme.context";

interface TaskHeaderProps {
  title?: string;
  count: number;
  onAddPress: () => void;
}

// Muestra el título de la lista y cuántas tareas tiene el usuario
export const TaskHeader = ({
  title = "Mis tareas",
  count,
  onAddPress,
}: TaskHeaderProps) => {
  const { palette } = useThemeContext();

  // Cambiamos entre singular y plural dependiendo de la cantidad
  const summary = count === 1 ? "1 tarea" : `${count} tareas`;

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={[
            styles.title,
            { color: palette.texts.primary },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.summary,
            { color: palette.texts.secondary },
          ]}
        >
          {summary}
        </Text>
      </View>

      {/* Este botón abre el formulario para crear una tarea nueva */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Agregar tarea"
        onPress={onAddPress}
        style={({ pressed }) => [
          styles.addButton,
          {
            backgroundColor: palette.colors.primary.default,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons
          name="add"
          size={26}
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
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  summary: {
    marginTop: 3,
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
});