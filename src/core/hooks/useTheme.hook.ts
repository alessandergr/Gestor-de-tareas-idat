import { useState } from "react";
import { Palette } from "@/config/theme/palette";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const palette = Palette[theme];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return {
    palette,
    toggleTheme,
  };
};
