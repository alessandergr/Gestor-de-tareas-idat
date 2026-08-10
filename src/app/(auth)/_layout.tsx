import { Stack } from "expo-router";

// Acá van las pantallas de login y registro
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rutas del inicio de sesión */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}