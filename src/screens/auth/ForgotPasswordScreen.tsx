import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../store";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { SafeArea } from "@/components/ui/SafeArea";
import { ApiLoader } from "@/components/ui/ApiLoader";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordScreen = () => {
  const { isLoading, forgotPassword } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    try {
      await forgotPassword(formData.email);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeArea style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text variant="body" style={styles.subtitle}>
            Enter your email address and we'll send you a reset link.
          </Text>
        </View>

        <Card>
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
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
      <ApiLoader isLoading={isLoading} />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
