import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "../../store";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { SafeArea } from "@/components/ui/SafeArea";
import { ApiLoader } from "@/components/ui/ApiLoader";

export const ChangePasswordScreen = () => {
  const { isLoading, error, changePassword } = useAuthStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: any) => {
    try {
      await changePassword(data.password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeArea applyBottomInset scrollable style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text variant="h2">New Password</Text>
          <Text variant="body" style={styles.subtitle}>
            Create a new strong password for your account.
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
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="New Password"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Button
              title="Reset Password"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
              style={styles.button}
            />
          </View>
        </Card>
      </View>
      <ApiLoader isLoading={isLoading} />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
