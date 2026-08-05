import { ThemeType } from "../types/theme.type";
import { darkColor, lightColor } from "./colors";
import { darkShadow, lightShadow } from "./shadows";
import { darkText, lightText } from "./texts";

export const lightTheme: ThemeType = {
  colors: lightColor,
  texts: lightText,
  shadows: lightShadow,
  schema: "light"
};

export const darkTheme: ThemeType = {
  colors: darkColor,
  texts: darkText,
  shadows: darkShadow,
  schema: "dark",
};

export const Palette = {
  dark: darkTheme,
  light: lightTheme,
}