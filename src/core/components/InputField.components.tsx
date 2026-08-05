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
}

export const InputField = ({ label, ...props }: InputFieldProps) => {
  const { palette } = useThemeContext();

  const renderInput = () => {
    return (
      <TextInput
        {...props}
        style={[
          styles.input,
          {
            borderColor: palette.colors.border,
            height: props.multiline ? 250 : undefined,
          },
        ]}
      />
    );
  };

  if (label && label.length > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        {renderInput()}
      </View>
    );
  }

  return renderInput();
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
