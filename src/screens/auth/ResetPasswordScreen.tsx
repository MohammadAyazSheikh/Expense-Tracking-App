import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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

type ScreenRouteProp = RouteProp<RootStackParamList, "ResetPassword">;

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRouteProp>();
  const { email, code } = route.params;
  const { resetPassword, isLoading, clearError, error } = useAuthStore();

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
      clearError();
      await resetPassword(email, data.password, code);
      navigation.popToTop();
      navigation.navigate("Auth");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Button
          title=""
          variant="ghost"
          icon={
            <Feather name="arrow-left" size={24} color={styles.icon.color} />
          }
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>

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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.paddings.md,
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
