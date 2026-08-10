import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useThemeContext } from "@/core/contexts/theme.context";

export default function TabsLayout() {
  // Traemos los colores del tema actual
  const { palette } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        // Quitamos la barra superior que pone Expo por defecto
        headerShown: false,

        // Color del icono cuando estamos en esa pestaña
        tabBarActiveTintColor: palette.colors.primary.default,

        // Color de las pestañas que no están seleccionadas
        tabBarInactiveTintColor: palette.texts.tertiary,

        // Esconde las pestañas cuando aparece el teclado
        tabBarHideOnKeyboard: true,

        // Diseño de la barra que aparece abajo
        tabBarStyle: {
          height: 70,
          paddingTop: 7,
          paddingBottom: 9,
          backgroundColor: palette.colors.surface,
          borderTopColor: palette.colors.divider,
        },

        // Estilo del texto que sale debajo de cada icono
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Primera pestaña: lista de tareas */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tareas",

          // Icono que aparece abajo para entrar a tareas
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="list-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* Segunda pestaña: perfil del usuario */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Perfil",

          // Icono del perfil
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