import type { ThemeType } from "@/core/types/theme.type";

import { darkColor, lightColor } from "./colors";
import { darkShadow, lightShadow } from "./shadows";
import { darkText, lightText } from "./texts";

// Junta colores, textos y sombras de cada tema
export const lightTheme: ThemeType = {
  colors: lightColor,
  texts: lightText,
  shadows: lightShadow,
  schema: "light",
};

export const darkTheme: ThemeType = {
  colors: darkColor,
  texts: darkText,
  shadows: darkShadow,
  schema: "dark",
};

// Permite elegir entre tema claro y oscuro
export const Palette = {
  dark: darkTheme,
  light: lightTheme,
};