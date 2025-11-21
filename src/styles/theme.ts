export const lightTheme = {
  colors: {
    background: 'hsl(240, 20%, 98%)',
    foreground: 'hsl(240, 10%, 15%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(240, 10%, 15%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(240, 10%, 15%)',
    primary: 'hsl(255, 70%, 65%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    primaryLight: 'hsl(255, 80%, 75%)',
    primaryDark: 'hsl(255, 60%, 55%)',
    secondary: 'hsl(160, 70%, 60%)',
    secondaryForeground: 'hsl(0, 0%, 100%)',
    muted: 'hsl(240, 15%, 96%)',
    mutedForeground: 'hsl(240, 5%, 45%)',
    accent: 'hsl(10, 80%, 65%)',
    accentForeground: 'hsl(0, 0%, 100%)',
    success: 'hsl(145, 70%, 55%)',
    successForeground: 'hsl(0, 0%, 100%)',
    warning: 'hsl(35, 90%, 60%)',
    warningForeground: 'hsl(0, 0%, 100%)',
    destructive: 'hsl(0, 75%, 60%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    border: 'hsl(240, 15%, 90%)',
    input: 'hsl(240, 15%, 95%)',
    ring: 'hsl(255, 70%, 65%)',
  },
  margins: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  paddings: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  }
} as const

export const darkTheme = {
  colors: {
    background: 'hsl(240, 12%, 10%)',
    foreground: 'hsl(240, 5%, 95%)',
    card: 'hsl(240, 10%, 12%)',
    cardForeground: 'hsl(240, 5%, 95%)',
    popover: 'hsl(240, 10%, 12%)',
    popoverForeground: 'hsl(240, 5%, 95%)',
    primary: 'hsl(255, 70%, 65%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    primaryLight: 'hsl(255, 80%, 75%)',
    primaryDark: 'hsl(255, 60%, 55%)',
    secondary: 'hsl(160, 70%, 60%)',
    secondaryForeground: 'hsl(0, 0%, 100%)',
    muted: 'hsl(240, 10%, 15%)',
    mutedForeground: 'hsl(240, 5%, 60%)',
    accent: 'hsl(10, 80%, 65%)',
    accentForeground: 'hsl(0, 0%, 100%)',
    success: 'hsl(145, 70%, 55%)',
    successForeground: 'hsl(0, 0%, 100%)',
    warning: 'hsl(35, 90%, 60%)',
    warningForeground: 'hsl(0, 0%, 100%)',
    destructive: 'hsl(0, 75%, 60%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    border: 'hsl(240, 10%, 18%)',
    input: 'hsl(240, 10%, 15%)',
    ring: 'hsl(255, 70%, 65%)',
  },
  margins: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  paddings: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  }
} as const

type AppThemes = {
  light: typeof lightTheme,
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}
