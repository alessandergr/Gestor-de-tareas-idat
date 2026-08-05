import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

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
          multiline && styles.multiline,
          {
            color: palette.texts.primary,
            backgroundColor: palette.colors.surface,
            borderColor: error
              ? palette.colors.error
              : palette.colors.border,
          },
          style,
        ]}
      />

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