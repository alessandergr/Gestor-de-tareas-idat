import { createContext, FC, ReactNode, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeType } from "../types/theme.type";
import { useTheme } from "../hooks/useTheme.hook";

type ThemeContextType = {
  palette: ThemeType;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { palette, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ palette, toggleTheme }}>
      <StatusBar style={palette.schema === "dark" ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemeContext esta fuera de ThemeProvider");
  }

  return context;
};
