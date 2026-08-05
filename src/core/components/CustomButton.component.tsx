import { FC } from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { useThemeContext } from "../contexts/theme.context";

interface CustomButtonProps extends PressableProps {
  title: string;
  color?: "primary" | "error" | "success" | "secondary";
  variant?: "filled" | "outlined";
}

export const CustomButton: FC<CustomButtonProps> = ({
  title,
  color = "primary",
  variant = "filled",
  ...props
}) => {
  const { palette } = useThemeContext();

  const getColor = (pressed: boolean) => {
    return {
      primary: palette.colors.primary[pressed ? "dark" : "default"],
      secondary: palette.colors.border,
      error: palette.colors.error,
      success: palette.colors.success,
    };
  };

  const getOutlinedStyle = (pressed: boolean) => {
    return {
      borderColor: getColor(pressed)[color],
      borderWidth: 1,
    };
  };

  const textColorStyle = (pressed: boolean) => {
    if (variant === "filled") return { color: palette.colors.surface };
    else return { color: getColor(pressed)[color] };
  };

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: props.disabled
            ? palette.colors.border
            : variant === "filled"
              ? getColor(pressed)[color]
              : undefined,
        },
        { ...(variant === "outlined" ? getOutlinedStyle(pressed) : undefined) },
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.title, textColorStyle(pressed)]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
