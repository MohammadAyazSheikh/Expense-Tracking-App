import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "../components/ui/Text";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../store";
import * as ImagePicker from "expo-image-picker";
import { useCreateProfile } from "../services/createProfile";
import { ApiLoader } from "@/components/ui/ApiLoader";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileSetupScreen = () => {
  const { theme } = useUnistyles();
  const { user, updateUser } = useAuthStore();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  // TanStack Query mutation
  const { mutate, isPending } = useCreateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setAvatarBase64(result.assets[0].base64!);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;

    mutate(
      {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUri: avatarUri!,
        base64: avatarBase64!,
      },
      {
        onSuccess: (profile) => {
          // Update user in auth store
          updateUser({
            ...user,
            firstName: profile.first_name,
            lastName: profile.last_name,
            avatar: profile.avatar_url!,
            fullName: profile.first_name + " " + profile.last_name,
          });
        },
      },
    );
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.content}>
        <Text variant="h2" align="center">
          Complete Your Profile
        </Text>

        <Text variant="body" align="center" style={styles.description}>
          Let's get to know you better
        </Text>

        {/* Avatar Picker */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather
                name="camera"
                size={32}
                color={theme.colors.mutedForeground}
              />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Feather name="edit-2" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <Text variant="caption" align="center" style={styles.avatarHint}>
          Tap to add profile picture
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <Input
                label="First Name"
                placeholder="Your first name"
                autoCapitalize="words"
                value={value}
                onChangeText={onChange}
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Last Name"
                placeholder="Your last name"
                autoCapitalize="words"
                value={value}
                onChangeText={onChange}
                error={errors.lastName?.message}
              />
            )}
          />

          <Button
            title="Continue"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            size="lg"
          />
        </View>
      </View>
      <ApiLoader isLoading={isPending} message="Updating profile..." />
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
    padding: theme.paddings.xl,
    gap: theme.margins.md,
  },
  description: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.lg,
  },
  avatarContainer: {
    alignSelf: "center",
    marginVertical: theme.margins.xl,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  avatarHint: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.lg,
  },
  form: {
    gap: theme.margins.md,
  },
}));
