import "./src/styles/unistyles";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppSettingsStore } from "./src/store";
import Toast from "react-native-toast-message";
import ToastConfig from "./src/components/ui/ToastConfig";
import { CustomAlert } from "./src/components/ui/CustomAlert";

import { SheetProvider } from "react-native-actions-sheet";
import { Sheets } from "./src/sheets";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function App() {
  const { initialize, effectiveTheme } = useAppSettingsStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <SheetProvider>
          <Sheets />
          <NavigationContainer>
            <StatusBar
              style={effectiveTheme == "dark" ? "dark" : "light"}
              backgroundColor={effectiveTheme == "dark" ? "white" : "black"}
            />
            <RootNavigator />
            <Toast config={ToastConfig} />
            <CustomAlert />
          </NavigationContainer>
        </SheetProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
