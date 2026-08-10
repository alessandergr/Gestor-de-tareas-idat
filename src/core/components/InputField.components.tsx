import { StyleSheet, Text, TextInput, type TextInputProps, View, } from "react-native";

import { useThemeContext } from "../contexts/theme.context";

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const InputField = ({
  label,
  error,
  style,
  multiline,
  ...props
}: InputFieldProps) => {
  const { palette } = useThemeContext();

  return (
    <View style={styles.container}>
      {/* Este es el nombre que sale arriba del campo */}
      {label ? (
        <Text
          style={[
            styles.label,
            { color: palette.texts.primary },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={palette.texts.tertiary}
        style={[
          styles.input,

          // Si es multiline lo hacemos más alto para escribir más texto
          multiline && styles.multiline,
          {
            color: palette.texts.primary,
            backgroundColor: palette.colors.surface,

            // Si algo está mal, ponemos el borde rojo
            borderColor: error
              ? palette.colors.error
              : palette.colors.border,
          },
          style,
        ]}
      />

      {/* El error sale justo debajo del campo */}
      {error ? (
        <Text
          style={[
            styles.error,
            { color: palette.texts.error },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 7,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: {
    height: 120,
    textAlignVertical: "top",
  },
  error: {
    marginLeft: 3,
    fontSize: 13,
  },
});