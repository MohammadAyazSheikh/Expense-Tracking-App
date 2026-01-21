import React, { useState } from "react";
import { useAuthStore } from "../store";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { Feather } from "@expo/vector-icons";
import { Button } from "../components/ui/Button";
import { View, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { ApiLoader } from "../components/ui/ApiLoader";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";
import {
  DAMPING,
  EnteringAnimation,
  ExitingAnimation,
  LayoutAnimation,
} from "../utils/Animation";
import { SafeArea } from "@/components/ui/SafeArea";

export const AuthScreen = () => {
  const { theme } = useUnistyles();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { isLoading, error } = useAuthStore();

  return (
    <SafeArea
      applyVerticalInsets
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      scrollable
    >
      <Animated.View
        entering={FadeInDown.springify()
          .damping(DAMPING)
          .duration(1000)
          .delay(100)}
        exiting={FadeOut.springify().damping(DAMPING).duration(500)}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Feather name="credit-card" size={32} color="white" />
        </View>
        <View>
          <Text variant="h2">HisaabBee</Text>
        </View>
        <View>
          <Text variant="caption">Manage your finances smartly</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.springify()
          .damping(DAMPING)
          .duration(1000)
          .delay(200)}
        exiting={FadeOut.springify().damping(DAMPING).duration(500)}
        layout={LayoutAnimation}
        style={styles.contentContainer}
      >
        <Card>
          <View style={styles.tabs}>
            <AuthTab
              title="Login"
              isActive={activeTab === "login"}
              onPress={() => setActiveTab("login")}
            />
            <AuthTab
              title="Sign Up"
              isActive={activeTab === "signup"}
              onPress={() => setActiveTab("signup")}
            />
          </View>

          <Animated.View
            entering={EnteringAnimation}
            exiting={ExitingAnimation}
            layout={EnteringAnimation}
            style={styles.form}
          >
            {error && (
              <Animated.View
                entering={EnteringAnimation}
                exiting={ExitingAnimation}
                layout={EnteringAnimation}
              >
                <Text
                  style={{
                    color: theme.colors.destructive,
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
              </Animated.View>
            )}

            {activeTab === "login" ? <LoginForm /> : <SignupForm />}
          </Animated.View>

          <Animated.View layout={LayoutAnimation} style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text variant="caption">Or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialGrid}>
              <Button
                title="Google"
                variant="outline"
                style={styles.socialButton}
                onPress={() => {}}
              />
              <Button
                title="Apple"
                variant="outline"
                style={styles.socialButton}
                onPress={() => {}}
              />
            </View>
          </Animated.View>
        </Card>
      </Animated.View>

      <Animated.View layout={LayoutAnimation} style={styles.footer}>
        <Text variant="caption" align="center">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </Animated.View>

      <ApiLoader
        isLoading={isLoading}
        message={activeTab === "login" ? "Logging in..." : "Sending OTP..."}
      />
    </SafeArea>
  );
};

const AuthTab = ({
  title,
  isActive,
  onPress,
}: {
  title: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  styles.useVariants({
    active: isActive,
  });

  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Text weight={isActive ? "bold" : "medium"}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainerStyle: {
    paddingTop: theme.paddings.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.margins.xl,
  },
  contentContainer: {
    width: "100%",
    padding: theme.paddings.md,
    maxWidth: {
      md: "70%",
      lg: "60%",
      xl: "50%",
    },
    alignSelf: "center",
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.margins.md,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: theme.colors.muted,
    padding: 4,
    borderRadius: theme.radius.md,
    marginBottom: theme.margins.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.paddings.sm,
    alignItems: "center",
    borderRadius: theme.radius.sm,
    variants: {
      active: {
        true: {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.foreground,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
      },
    },
  },
  form: {
    gap: theme.margins.md,
  },
  socialSection: {
    marginTop: theme.margins.xl,
    gap: theme.margins.md,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  socialGrid: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    marginTop: theme.margins.lg,
    alignItems: "center",
  },
}));
