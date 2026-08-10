import { ICON_SIZES } from "@/core/utils/constants.util";
import type { Icon } from "@expo/vector-icons/build/createIconSet";
import { Pressable, type PressableProps, StyleSheet, } from "react-native";

import { useThemeContext } from "../contexts/theme.context";

interface IconButtonProps<
  G extends string,
  FN extends string,
> extends PressableProps {
  icon: Icon<G, FN>;
  name: G;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "error";
}

export const IconButton = <
  G extends string,
  FN extends string,
>({
  name,
  style,
  size = "md",
  color = "primary",
  icon: IconComponent,
  ...pressableProps
}: IconButtonProps<G, FN>) => {
  const { palette } = useThemeContext();

  // Acá están los colores que puede recibir el icono
  const iconColor = {
    primary: palette.colors.primary.default,
    success: palette.colors.success,
    error: palette.colors.error,
  };

  return (
    <Pressable
      style={(state) => [
        typeof style === "function"
          ? style(state)
          : style,
        styles.container,
        {
          // Cuando lo tocamos se marca un poco el fondo
          backgroundColor: state.pressed
            ? palette.colors.overlay
            : undefined,
        },
      ]}
      {...pressableProps}
    >
      {/* Acá se dibuja el icono que mandamos al componente */}
      <IconComponent
        name={name}
        size={ICON_SIZES[size]}
        color={iconColor[color]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    padding: 8,
  },
});