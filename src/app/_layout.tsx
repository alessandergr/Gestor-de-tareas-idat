import NetInfo, {
  type NetInfoState,
} from "@react-native-community/netinfo";
import { Stack } from "expo-router";
import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  useEffect,
  useState,
} from "react";

import { firebaseAuth } from "@/config/firebase/firebase.config";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { syncPendingTasks } from "@/modules/Tasks/data/services/task-sync.service";

// Dejamos esta comprobación en una función
// para no repetirla varias veces.
const hasInternet = (
  state: NetInfoState,
): boolean => {
  return (
    state.isConnected === true &&
    state.isInternetReachable !== false
  );
};

export default function RootLayout() {
  // Usuario que tiene la sesión abierta.
  const [user, setUser] =
    useState<User | null>(null);

  // Mientras Firebase revisa si existe sesión,
  // no mostramos todavía las pantallas.
  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    // Firebase avisa cuando inicia o cierra sesión.
    const unsubscribe =
      onAuthStateChanged(
        firebaseAuth,
        (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        },
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Sin usuario no tenemos tareas que sincronizar.
    if (!user) return;

    let wasConnected = false;

    const runSync = async () => {
      try {
        await syncPendingTasks(
          user.uid,
        );
      } catch {
        // Si falla internet no borramos nada.
        // SQLite conserva las tareas pendientes
        // y se volverá a intentar después.
      }
    };

    const handleConnection = (
      state: NetInfoState,
    ) => {
      const connected =
        hasInternet(state);

      // Solo sincronizamos cuando realmente
      // pasamos de no tener internet a tenerlo.
      //
      // Así NetInfo no manda el mismo proceso
      // varias veces porque actualizó su estado.
      if (
        connected &&
        !wasConnected
      ) {
        void runSync();
      }

      wasConnected = connected;
    };

    // Revisamos cómo está la red al entrar.
    void NetInfo.fetch().then(
      handleConnection,
    );

    // Luego escuchamos si la red cambia.
    const unsubscribe =
      NetInfo.addEventListener(
        handleConnection,
      );

    return unsubscribe;
  }, [user]);

  // Esperamos a que Firebase revise la sesión.
  if (isLoading) return null;

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />

        {/* Sin sesión: Login y Registro */}
        <Stack.Protected
          guard={user === null}
        >
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* Con sesión: Tareas y Perfil */}
        <Stack.Protected
          guard={user !== null}
        >
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}