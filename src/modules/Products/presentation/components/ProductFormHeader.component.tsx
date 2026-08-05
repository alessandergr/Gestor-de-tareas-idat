import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/core/components/IconButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";

interface ProductFormHeaderProps {
  title: string;
}

export const ProductFormHeader = ({
  title,
}: ProductFormHeaderProps) => {
  const router = useRouter();
  const { palette } = useThemeContext();

  return (
    <View style={styles.container}>
      <IconButton
        icon={Ionicons}
        name="arrow-back-outline"
        style={styles.backButton}
        onPress={() => router.back()}
      />

      <Text
        style={[
          styles.title,
          { color: palette.texts.primary },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
  },
});