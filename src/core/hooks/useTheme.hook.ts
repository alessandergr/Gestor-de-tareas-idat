import { useState } from "react";

import { Palette } from "@/config/theme/palette";

export const useTheme = () => {
  // Guarda si estamos usando el modo claro u oscuro
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Con el tema elegido sacamos sus colores, textos y sombras
  const palette = Palette[theme];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return {
    palette,
    toggleTheme,
  };
};