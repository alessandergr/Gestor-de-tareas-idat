export interface ColorVariant {
  light: string;
  default: string;
  dark: string;
}

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

export type ShadowsType = {
  sm: ShadowVariant;
  md: ShadowVariant;
  lg: ShadowVariant;
}

export type ShadowVariant = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: ShadowOffset;
  elevation: number;
}

export type ShadowOffset = {
  width: number;
  height: number;
}

export type ThemeType = {
  colors: ColorsType;
  texts: TextsType;
  shadows: ShadowsType;
  schema: string;
};
