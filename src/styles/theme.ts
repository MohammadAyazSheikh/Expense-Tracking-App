import { Platform } from 'react-native';

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
    xxs: 10,
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
  },
  shadows: {
    xs: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
      },
      android: {
        elevation: 0.5,
      },
      web: {
        boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.03)',
      },
    }),
    sm: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    }),
    md: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    }),
    lg: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.30,
        shadowRadius: 6.27,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
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
    xxs: 10,
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
  },
  shadows: {
    xs: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
      },
      android: {
        elevation: 0.5,
      },
      web: {
        boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.03)',
      },
    }),
    sm: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    }),
    md: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    }),
    lg: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.30,
        shadowRadius: 6.27,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
} as const

type AppThemes = {
  light: typeof lightTheme,
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes { }
}
