import React from "react";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store";
import Animated from "react-native-reanimated";
import {
  EnteringAnimation,
  ExitingAnimation,
  LayoutAnimation,
} from "../../utils/Animation";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { login, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        user: {
          password: data.password,
          email: data.email,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <View style={{ gap: 16 }}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email"
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
          />
        )}
      />

      <Animated.View
        entering={EnteringAnimation}
        exiting={ExitingAnimation}
        layout={LayoutAnimation}
      >
        <Button
          title="Forgot password?"
          variant="ghost"
          size="sm"
          textStyle={{ fontSize: 14 }}
          onPress={() => navigation.navigate("ForgotPassword")}
          style={{ alignSelf: "flex-end", paddingHorizontal: 0 }}
        />
      </Animated.View>

      <Animated.View layout={LayoutAnimation}>
        <Button
          title="Login"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          size="lg"
        />
      </Animated.View>
    </View>
  );
};
