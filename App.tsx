import './src/styles/unistyles';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppSettingsStore } from './src/store';

export default function App() {
  const { initialize, effectiveTheme } = useAppSettingsStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={effectiveTheme == "dark" ? "dark" : "light"} backgroundColor={effectiveTheme == "dark" ? "white" : "black"} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
