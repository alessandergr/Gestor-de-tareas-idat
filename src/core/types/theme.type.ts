export interface ColorVariant {
  light: string;
  default: string;
  dark: string;
}

// Todos los colores que puede usar la app
export type ColorsType = {
  primary: ColorVariant;
  secondary: ColorVariant;
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  divider: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  overlay: string;
};

// Colores que se usan específicamente en textos
export type TextsType = {
  primary: string;
  secondary: string;
  tertiary: string;
  disabled: string;
  inverse: string;
  primaryButton: string;
  secondaryButton: string;
  link: string;
  success: string;
  warning: string;
  error: string;
};

// Indica hacia dónde se mueve la sombra
export type ShadowOffset = {
  width: number;
  height: number;
};

export type ShadowVariant = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: ShadowOffset;
  elevation: number;
};

// Tenemos tres tamaños de sombra para reutilizarlos
export type ShadowsType = {
  sm: ShadowVariant;
  md: ShadowVariant;
  lg: ShadowVariant;
};

// Junta todo lo necesario para formar un tema
export type ThemeType = {
  colors: ColorsType;
  texts: TextsType;
  shadows: ShadowsType;
  schema: "light" | "dark";
};