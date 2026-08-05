import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from "react-native";

import { useThemeContext } from "../contexts/theme.context";

interface CustomButtonProps extends PressableProps {
  title: string;
  color?: "primary" | "error" | "success" | "secondary";
  variant?: "filled" | "outlined";
}

export const CustomButton = ({
  title,
  color = "primary",
  variant = "filled",
  disabled,
  ...props
}: CustomButtonProps) => {
  const { palette } = useThemeContext();

  const getColor = (pressed: boolean) => {
    const colors = {
      primary:
        palette.colors.primary[
          pressed ? "dark" : "default"
        ],
      secondary: palette.colors.border,
      error: palette.colors.error,
      success: palette.colors.success,
    };

    return colors[color];
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: disabled
            ? palette.colors.border
            : variant === "filled"
              ? getColor(pressed)
              : "transparent",
          borderColor: getColor(pressed),
          borderWidth: variant === "outlined" ? 1 : 0,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.title,
            {
              color:
                variant === "filled"
                  ? palette.texts.primaryButton
                  : getColor(pressed),
            },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
});