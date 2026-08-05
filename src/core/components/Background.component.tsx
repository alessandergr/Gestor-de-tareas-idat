import { FC, ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { useThemeContext } from "../contexts/theme.context";

interface BackgroundProps {
  children: ReactNode;
}

export const Background: FC<BackgroundProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { palette } = useThemeContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.colors.background,
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
