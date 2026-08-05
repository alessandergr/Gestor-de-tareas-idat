import { Icon } from "@expo/vector-icons/build/createIconSet";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useThemeContext } from "../contexts/theme.context";
import { ICON_CONTAINER_SIZES, ICON_SIZES } from "@/core/utils/constants.util";

interface FilledIconButtonProps<
  G extends string,
  FN extends string,
> extends TouchableOpacityProps {
  icon: Icon<G, FN>;
  name: G;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "error" | "success";
}

export const FilledIconButton = <G extends string, FN extends string>({
  icon: IconComponent,
  name,
  color = "primary",
  size = "md",
  style,
  ...touchableProps
}: FilledIconButtonProps<G, FN>) => {
  const { palette } = useThemeContext();

  const backgroundColor = {
    primary: palette.colors.primary.default,
    error: palette.colors.error,
    success: palette.colors.success,
  };

  return (
    <TouchableOpacity
      hitSlop={10}
      activeOpacity={0.7}
      {...touchableProps}
      style={[
        styles.container,
        ICON_CONTAINER_SIZES[size],
        { backgroundColor: backgroundColor[color] },
      ]}
    >
      <IconComponent name={name} size={ICON_SIZES[size]} color="#ffffff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },
});
