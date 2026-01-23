import React, { useEffect, useCallback, useState } from "react";
import { View } from "react-native";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../../store";
import { supabase } from "../../utils/supabase";
import Animated, { FadeInDown } from "react-native-reanimated";
import { DAMPING } from "../../utils/animation";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { ApiLoader } from "@/components/ui/ApiLoader";

export const EmailVerificationPendingScreen = () => {
  const { theme } = useUnistyles();
  const { logout, user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user?.email!,
      });

      if (error) throw error;

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Verification email resent!",
      });
    } catch (error) {
      console.error("Error resending email:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to resend email",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <Animated.View
        entering={FadeInDown.springify().damping(DAMPING).duration(1000)}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Feather name="mail" size={64} color={theme.colors.primary} />
        </View>

        <Text variant="h2" align="center">
          Verify Your Email
        </Text>

        <Text variant="body" align="center" style={styles.description}>
          We've sent a verification link to
        </Text>

        <Text variant="body" align="center" weight="bold" style={styles.email}>
          {user?.email}
        </Text>

        <Text variant="caption" align="center" style={styles.instruction}>
          Please check your inbox and click the verification link to continue.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Resend Verification Email"
            variant="outline"
            onPress={handleResendEmail}
          />

          <Button title="Logout" variant="destructive" onPress={handleLogout} />
        </View>
      </Animated.View>
      <ApiLoader isLoading={loading} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.paddings.xl,
    gap: theme.margins.lg,
  },
  iconContainer: {
    marginBottom: theme.margins.md,
  },
  description: {
    color: theme.colors.mutedForeground,
  },
  email: {
    color: theme.colors.primary,
  },
  instruction: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.xl,
  },
  buttonContainer: {
    width: "100%",
    gap: theme.margins.md,
    marginTop: theme.margins.xl,
  },
}));
