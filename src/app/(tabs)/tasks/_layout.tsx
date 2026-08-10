import { Stack } from "expo-router";

// Acá están las rutas para ver, crear, editar y revisar tareas
export default function TaskStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="detail" />
    </Stack>
  );
}