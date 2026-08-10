import { Modal, StyleSheet, Text, View,} from "react-native";

import { useThemeContext } from "../contexts/theme.context";
import { CustomButton } from "./CustomButton.component";

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CustomModal = ({
  visible,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: CustomModalProps) => {
  const { palette } = useThemeContext();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Oscurece lo que está detrás del mensaje */}
      <View
        style={[
          styles.backdrop,
          {
            backgroundColor: palette.colors.overlay,
          },
        ]}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: palette.colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: palette.texts.primary },
            ]}
          >
            {title}
          </Text>

          {/* Acá sale el mensaje que queremos mostrar */}
          <Text
            style={[
              styles.message,
              { color: palette.texts.secondary },
            ]}
          >
            {message}
          </Text>

          {/* Los dos botones que salen abajo del mensaje */}
          <View style={styles.footer}>
            <CustomButton
              color="secondary"
              variant="outlined"
              title={cancelText}
              onPress={onCancel}
              disabled={loading}
            />

            <CustomButton
              color="primary"
              title={confirmText}
              onPress={onConfirm}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
});