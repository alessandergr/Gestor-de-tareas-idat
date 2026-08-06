import NetInfo from "@react-native-community/netinfo";
import { Stack } from "expo-router";
import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { useEffect, useState } from "react";

import { firebaseAuth } from "@/config/firebase/firebase.config";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { syncPendingTasks } from "@/modules/Products/data/services/task-sync.service";

export default function RootLayout() {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const runSync = () => {
      void syncPendingTasks(user.uid).catch(
        () => undefined,
      );
    };

    void NetInfo.fetch().then((state) => {
      if (
        state.isConnected &&
        state.isInternetReachable !== false
      ) {
        runSync();
      }
    });

    const unsubscribe =
      NetInfo.addEventListener((state) => {
        if (
          state.isConnected &&
          state.isInternetReachable !== false
        ) {
          runSync();
        }
      });

    return unsubscribe;
  }, [user]);

  if (isLoading) return null;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Protected guard={user === null}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={user !== null}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}