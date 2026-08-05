import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "@/core/components/IconButton.component";
import { useRouter } from "expo-router";

interface ProductFormHeader {
  title: string;
}

export const ProductFormHeader: FC<ProductFormHeader> = ({ title }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon={Ionicons}
        name="arrow-back-outline"
        style={styles.backButton}
        onPress={handleBack}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
