import React, { useEffect } from "react";
import { Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import "@/styles/unistyles";
import { Sheets } from "@/sheets";
import Toast from "react-native-toast-message";
import ToastConfig from "@/components/ui/ToastConfig";
import { SheetProvider } from "react-native-actions-sheet";
import { CustomAlert } from "@/components/ui/CustomAlert";
import queryClient from "@/services/queries/query-client";
import { RootNavigator } from "@/navigation/RootNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAppSettingsStore, useAuthStore } from "@/store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useNetworkSync } from "@/hooks/useNetworkSync";

export default function App() {
  const { initialize, effectiveTheme } = useAppSettingsStore();
  const { confirmEmail } = useAuthStore();
  // Auto-sync on network restore
  useNetworkSync();
  //initialize app settings
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
        const error = params.get("error");
        const error_code = params.get("error_code");
        const error_description = params.get("error_description");
        const type = params.get("type");

        // Check if we have tokens (email verification or password reset)
        confirmEmail({
          access_token,
          refresh_token,
          type: type!,
          error,
          error_code,
          error_description,
        });
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
