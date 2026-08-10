import NetInfo from "@react-native-community/netinfo";
import { Stack } from "expo-router";
import { onAuthStateChanged, type User, } from "firebase/auth";
import { useEffect, useState } from "react";

import { firebaseAuth } from "@/config/firebase/firebase.config";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { syncPendingTasks } from "@/modules/Tasks/data/services/task-sync.service";

export default function RootLayout() {
  // Guarda al usuario que tiene la sesión iniciada
  const [user, setUser] = useState<User | null>(null);

  // Evita mostrar pantallas antes de saber si hay una sesión
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase avisa cada vez que inicia o cierra una sesión
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      },
    );

    // Dejamos de escuchar cuando este componente se cierre
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Sin usuario no hay tareas que sincronizar
    if (!user) return;

    // Intenta subir las tareas que quedaron pendientes
    const runSync = () => {
      void syncPendingTasks(user.uid).catch(
        () => undefined,
      );
    };

    // Revisamos si ya hay internet cuando entra el usuario
    void NetInfo.fetch().then((state) => {
      if (
        state.isConnected &&
        state.isInternetReachable !== false
      ) {
        runSync();
      }
    });

    // También escuchamos cuando vuelve la conexión a internet
    const unsubscribe = NetInfo.addEventListener(
      (state) => {
        if (
          state.isConnected &&
          state.isInternetReachable !== false
        ) {
          runSync();
        }
      },
    );

    return unsubscribe;
  }, [user]);

  // Esperamos a que Firebase revise la sesión
  if (isLoading) return null;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        {/* Sin sesión solo puede entrar a login y registro */}
        <Stack.Protected guard={user === null}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* Con sesión ya puede entrar a la aplicación */}
        <Stack.Protected guard={user !== null}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}