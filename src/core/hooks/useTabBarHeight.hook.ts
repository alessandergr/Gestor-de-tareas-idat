import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// android: 24, altura_tab: 76, padding: 16 -> total: 116
// ios: 34, altura_tab: 50, padding: 16 -> total: 100

export const useTabBarHeight = () => {
  const insets = useSafeAreaInsets();
  const TAB_IOS_HEIGHT = 50;
  const TAB_ANDROID_HEIGHT = 76;
  const tabBarHeight = Platform.OS === "ios" ? TAB_IOS_HEIGHT : TAB_ANDROID_HEIGHT;
  
  return {
    tabBarHeight,
    bottomOffset: tabBarHeight + insets.bottom,
  };
};
