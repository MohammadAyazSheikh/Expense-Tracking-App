import { StyleSheet } from 'react-native-unistyles'
import { lightTheme, darkTheme } from './theme'
import { storage } from '../utils/storage'

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    initialTheme: () => {
      const theme = JSON.parse(storage.getString("app-settings-storage") || "data:{{effectiveTheme: 'light'}}")?.state?.effectiveTheme;
      return theme;
    }
  }
})