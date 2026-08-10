import { StatusBar } from "expo-status-bar";
import { createContext, type ReactNode, useContext, } from "react";
import { useTheme } from "../hooks/useTheme.hook";
import type { ThemeType } from "../types/theme.type";

type ThemeContextType = {
  palette: ThemeType;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

// Acá guardamos el tema para poder usarlo desde cualquier pantalla
const ThemeContext = createContext<ThemeContextType | null>(
  null,
);

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  // Traemos los colores actuales y la función para cambiar de tema
  const { palette, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider
      value={{ palette, toggleTheme }}
    >
      {/* También cambia el color de los iconos de la barra del celular */}
      <StatusBar
        style={
          palette.schema === "dark"
            ? "light"
            : "dark"
        }
      />

      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  // Si usamos el tema fuera del ThemeProvider, avisamos con un error
  if (!context) {
    throw new Error(
      "ThemeContext esta fuera de ThemeProvider",
    );
  }

  return context;
};