import React, { useState } from "react";
import { useAuthStore } from "../store";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { Feather } from "@expo/vector-icons";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { View, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RootStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import {
  DAMPING,
  EnteringAnimation,
  ExitingAnimation,
  LayoutAnimation,
} from "../utils/Animation";

export const AuthScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { login, register, isLoading, error } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (activeTab === "login") {
        await login(data.email, data.password);
      } else {
        await register(data.email, data.password, data.name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenWrapper
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

            {activeTab === "signup" && (
              <Animated.View
                entering={EnteringAnimation}
                exiting={ExitingAnimation}
              >
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={onChange}
                      error={errors.name?.message as string}
                    />
                  )}
                />
              </Animated.View>
            )}

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Animated.View layout={LayoutAnimation}>
                  <Input
                    label="Email"
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message as string}
                  />
                </Animated.View>
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Animated.View layout={LayoutAnimation}>
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message as string}
                  />
                </Animated.View>
              )}
            />

            {activeTab === "login" && (
              <Animated.View
                entering={EnteringAnimation}
                exiting={ExitingAnimation}
                layout={LayoutAnimation}
              >
                <Button
                  title="Forgot password?"
                  variant="ghost"
                  size="sm"
                  textStyle={styles.txtForget}
                  onPress={() => {}}
                  style={{ alignSelf: "flex-end", paddingHorizontal: 0 }}
                />
              </Animated.View>
            )}

            <Animated.View layout={LayoutAnimation}>
              <Button
                title={activeTab === "login" ? "Login" : "Sign Up"}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                size="lg"
              />
            </Animated.View>
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
    </ScreenWrapper>
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
  txtForget: {
    fontSize: theme.fontSize.md,
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
