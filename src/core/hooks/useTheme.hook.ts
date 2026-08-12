import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { Palette } from "@/config/theme/palette";

type ThemeName = "light" | "dark";

const THEME_STORAGE_KEY = "app-theme";

export const useTheme = () => {
  const [theme, setTheme] =
    useState<ThemeName>("light");

  // Al abrir la app buscamos el último tema que usó la persona.
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme =
          await AsyncStorage.getItem(
            THEME_STORAGE_KEY,
          );

        if (
          savedTheme === "light" ||
          savedTheme === "dark"
        ) {
          setTheme(savedTheme);
        }
      } catch {
        // Si no se puede leer, simplemente dejamos el tema claro.
      }
    };

    void loadSavedTheme();
  }, []);

  const palette = Palette[theme];

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme: ThemeName =
        currentTheme === "dark"
          ? "light"
          : "dark";

      // Guardamos la elección para la próxima vez que abra la app.
      void AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        nextTheme,
      );

      return nextTheme;
    });
  };

  return {
    palette,
    toggleTheme,
  };
};