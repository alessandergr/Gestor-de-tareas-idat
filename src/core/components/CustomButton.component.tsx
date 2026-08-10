import { Pressable, type PressableProps, StyleSheet, Text, } from "react-native";

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

  // Aqui el color según el tipo de botón
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
          // Filled tiene fondo, outlined solo tiene borde
          backgroundColor: disabled
            ? palette.colors.border
            : variant === "filled"
              ? getColor(pressed)
              : "transparent",

          borderColor: getColor(pressed),
          borderWidth: variant === "outlined" ? 1 : 0,

          // Baja un poco la opacidad cuando lo presionamos
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.title,
            {
              // El texto también cambia dependiendo del tipo de botón
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