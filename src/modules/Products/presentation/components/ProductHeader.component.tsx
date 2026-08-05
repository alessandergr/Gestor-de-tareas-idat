import { FilledIconButton } from "@/core/components/FilledIconButton";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { FC } from "react";

interface ProductHeaderProps {
  title: string;
  onAddPress: () => void;
}

export const ProductHeader: FC<ProductHeaderProps> = ({
  title,
  onAddPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FilledIconButton icon={Feather} name="plus" onPress={onAddPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
