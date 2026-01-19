import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import { RootStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { SafeArea } from "../../components/ui/SafeArea";

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { sendOTP, isLoading, clearError, error } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      clearError();
      await sendOTP(data.email, "forgot_password");
      navigation.navigate("OTPVerification", {
        email: data.email,
        type: "forgot_password",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeArea style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text variant="h2">Reset Password</Text>
          <Text variant="body" style={styles.subtitle}>
            Enter your email address and we'll send you a verification code.
          </Text>
        </View>

        <Card>
          <View style={styles.form}>
            {error && (
              <Text style={styles.errorText} align="center">
                {error}
              </Text>
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
                <Input
                  label="Email Address"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />

            <Button
              title="Send Code"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
              style={styles.button}
            />
          </View>
        </Card>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    width: 40,
    paddingHorizontal: 0,
  },
  icon: {
    color: theme.colors.foreground,
  },
  content: {
    padding: theme.paddings.lg,
  },
  titleContainer: {
    marginBottom: theme.margins.xl,
  },
  subtitle: {
    color: theme.colors.mutedForeground,
    marginTop: theme.margins.sm,
  },
  form: {
    gap: theme.margins.lg,
  },
  button: {
    marginTop: theme.margins.sm,
  },
  errorText: {
    color: theme.colors.destructive,
  },
}));
