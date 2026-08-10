import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeContext } from "@/core/contexts/theme.context";
import type { TaskPriority } from "../../domain/entities/task.entity";

interface TaskCardProps {
  title: string;
  description?: string;
  priority: TaskPriority;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Esta tarjeta muestra la información principal de una tarea
export const TaskCard = ({
  title,
  description,
  priority,
  onView,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const { palette } = useThemeContext();

  // Convertimos la prioridad guardada a un texto fácil de mostrar
  const priorityLabel = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
  }[priority];

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
            { backgroundColor: palette.colors.surfaceSecondary },
          ]}
        >
          <Ionicons
            name="checkbox-outline"
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
            {description?.trim() || "Sin descripción"}
          </Text>

          {/* Mostramos la prioridad que eligió el usuario */}
          <Text
            style={[
              styles.priority,
              { color: palette.colors.primary.default },
            ]}
          >
            Prioridad: {priorityLabel}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: palette.colors.divider },
        ]}
      />

      {/* Acciones disponibles para cada tarea */}
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={onView}>
          <Ionicons
            name="eye-outline"
            size={18}
            color={palette.colors.info}
          />
          <Text
            style={[
              styles.actionText,
              { color: palette.colors.info },
            ]}
          >
            Ver
          </Text>
        </Pressable>

        <Pressable style={styles.action} onPress={onEdit}>
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

        <Pressable style={styles.action} onPress={onDelete}>
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
  priority: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
  },
});