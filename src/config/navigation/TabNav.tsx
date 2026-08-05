import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

import { useThemeContext } from "@/core/contexts/theme.context";

export const TabNav = () => {
  const { palette } = useThemeContext();

  return (
    <NativeTabs
      disableIndicator
      tintColor={palette.colors.primary.default}
    >
      <NativeTabs.Trigger name="products">
        <Label>Tareas</Label>
        <Icon
          src={
            <VectorIcon
              family={AntDesign}
              name="unordered-list"
            />
          }
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Perfil</Label>
        <Icon
          src={
            <VectorIcon
              family={AntDesign}
              name="user"
            />
          }
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};