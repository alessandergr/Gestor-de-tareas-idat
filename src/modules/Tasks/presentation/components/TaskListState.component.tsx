import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeContext } from "@/core/contexts/theme.context";

interface TaskListStateProps {
  isError: boolean;
  onRetry: () => void;
}

// Esta pantalla cambia dependiendo de si no hay tareas o hubo un error
export const TaskListState = ({
  isError,
  onRetry,
}: TaskListStateProps) => {
  const { palette } = useThemeContext();

  return (
    <View style={styles.container}>
      <Ionicons
        name={
          isError
            ? "cloud-offline-outline"
            : "clipboard-outline"
        }
        size={52}
        color={palette.colors.primary.default}
      />

      <Text
        style={[
          styles.title,
          { color: palette.texts.primary },
        ]}
      >
        {isError
          ? "No se pudieron cargar las tareas"
          : "No hay tareas todavía"}
      </Text>

      <Text
        style={[
          styles.message,
          { color: palette.texts.secondary },
        ]}
      >
        {isError
          ? "Revisa tu conexión y vuelve a intentarlo."
          : "Presiona el botón + para crear una tarea."}
      </Text>

      {/* El botón solo aparece cuando falló la carga de las tareas */}
      {isError && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            {
              borderColor: palette.colors.primary.default,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: palette.colors.primary.default },
            ]}
          >
            Reintentar
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 32,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});