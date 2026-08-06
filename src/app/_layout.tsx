import { Stack } from "expo-router";
import {
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";

import { firebaseAuth } from "@/config/firebase/firebase.config";
import { ThemeProvider } from "@/core/contexts/theme.context";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return null;
  }

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