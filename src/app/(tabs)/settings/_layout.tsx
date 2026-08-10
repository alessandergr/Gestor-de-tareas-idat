import { Stack } from "expo-router";

// Navegación de la sección de perfil y ajustes
export default function SettingsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
    </Stack>
  );
}