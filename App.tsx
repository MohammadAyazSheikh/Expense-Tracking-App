import "./src/styles/unistyles";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppSettingsStore, useAuthStore } from "./src/store";
import Toast from "react-native-toast-message";
import ToastConfig from "./src/components/ui/ToastConfig";
import { CustomAlert } from "./src/components/ui/CustomAlert";

import { SheetProvider } from "react-native-actions-sheet";
import { Sheets } from "./src/sheets";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Linking } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/services/queries/query-client";

export default function App() {
  const { initialize, effectiveTheme } = useAppSettingsStore();
  const { confirmEmail } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // Handle deep links for email verification and password reset
    const handleDeepLink = async ({ url }: { url: string }) => {
      if (!url) return;
      try {
        // Parse the URL to extract tokens
        const urlObj = new URL(url);
        const fragment = urlObj.hash.substring(1); // Remove the '#'
        const params = new URLSearchParams(fragment);

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        // Check if we have tokens (email verification or password reset)
        if (access_token && refresh_token) {
          confirmEmail(access_token, refresh_token, type!);
        }
      } catch (error: any) {}
    };

    // Listen for incoming links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened with a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <SheetProvider>
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </SheetProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
