import {
  Icon,
  Label,
  VectorIcon,
  NativeTabs,
} from "expo-router/unstable-native-tabs";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useThemeContext } from "@/core/contexts/theme.context";

export const TabNav = () => {
  const { palette } = useThemeContext();
  return (
    <NativeTabs disableIndicator tintColor={palette.colors.primary.dark}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={<VectorIcon family={AntDesign} name="unordered-list" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon src={<VectorIcon family={AntDesign} name="setting" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};
