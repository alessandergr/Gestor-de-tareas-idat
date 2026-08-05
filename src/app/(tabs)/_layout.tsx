import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useThemeContext } from "@/core/contexts/theme.context";

export default function TabsLayout() {
  const { palette } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:
          palette.colors.primary.default,
        tabBarInactiveTintColor:
          palette.texts.tertiary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 70,
          paddingTop: 7,
          paddingBottom: 9,
          backgroundColor: palette.colors.surface,
          borderTopColor: palette.colors.divider,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: "Tareas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="checkmark-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}