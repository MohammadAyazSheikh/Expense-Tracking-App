import { StyleSheet } from 'react-native-unistyles'
import { lightTheme, darkTheme } from './theme'
import { storage } from '../utils/storage'

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const

StyleSheet.configure({
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    initialTheme: "light"
    // initialTheme: () => {
    //   const theme = JSON.parse(storage.getString("app-settings-storage") || "data:{{effectiveTheme: 'light'}}")?.state?.effectiveTheme;
    //   return theme;
    // }
  }
})

type AppBreakpoints = typeof breakpoints

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints { }
}