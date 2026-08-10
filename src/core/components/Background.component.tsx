import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeContext } from "../contexts/theme.context";

interface BackgroundProps { children: ReactNode;}

export const Background = ({ children }: BackgroundProps) => {
  const insets = useSafeAreaInsets();
  const { palette } = useThemeContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.colors.background,
          // Evita que el contenido choque con la barra del celular
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});