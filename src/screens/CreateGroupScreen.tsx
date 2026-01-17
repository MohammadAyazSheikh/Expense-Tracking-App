import React, { useCallback } from "react";
import { View, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-toast-message";

import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SettingsGroup } from "../components/ui/SettingsGroup";
import { Header } from "../components/ui/Headers";
import { Input } from "../components/ui/Input";
import { Icon } from "../components/ui/Icon";
import { useFinanceStore } from "../store";
import { useTranslation } from "../hooks/useTranslation";
import { SettingsRow } from "../components/ui/SettingsRow";

const ICONS = ["🏠", "✈️", "🍔", "🛍️", "⚽", "🎓", "💼", "🎮", "🚗", "🍷"];

// Validation schema
const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  avatar: z.string(),
  memberIds: z.array(z.string()),
});

type GroupFormData = z.infer<typeof groupSchema>;

export const CreateGroupScreen = () => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const friends = useFinanceStore((state) => state.friends);
  const addGroup = useFinanceStore((state) => state.addGroup);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      avatar: "🏠",
      memberIds: [],
    },
  });

  const avatar = watch("avatar");
  const memberIds = watch("memberIds");

  const selectedMembers = friends.filter((f) => memberIds.includes(f.id));

  const handleMemberSelection = async () => {
    const memberOptions = friends.map((friend) => ({
      label: friend.name,
      value: friend.id,
      avatar: friend.avatar,
    }));

    const result = await SheetManager.show("multi-select-sheet", {
      payload: {
        options: memberOptions,
        title: "Select Members",
        selectedValues: memberIds,
      },
    });

    if (result) {
      setValue("memberIds", result as string[]);
    }
  };

  const removeMember = (id: string) => {
    setValue(
      "memberIds",
      memberIds.filter((memberId) => memberId !== id)
    );
  };

  const onSubmit = (data: GroupFormData) => {
    const memberNames = friends
      .filter((f) => data.memberIds.includes(f.id))
      .map((f) => f.name);

    addGroup({
      name: data.name,
      avatar: data.avatar,
      members: ["You", ...memberNames],
      totalExpenses: 0,
      youOwe: 0,
      youAreOwed: 0,
      lastActivity: "Just now",
    });

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: "Group created successfully!",
    });

    navigation.navigate("Groups");
  };

  const SelectUserCard = useCallback(() => {
    return (
      <Pressable onPress={handleMemberSelection} style={styles.emptyState}>
        <View style={styles.emptyIconWrapper}>
          <Icon
            type="Feather"
            name="users"
            size={32}
            color={theme.colors.mutedForeground}
          />
        </View>
        <Text
          variant="caption"
          style={{
            color: theme.colors.mutedForeground,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          No members selected
        </Text>
        <Text
          variant="caption"
          style={{
            color: theme.colors.mutedForeground,
            textAlign: "center",
          }}
        >
          Press here to select members
        </Text>
      </Pressable>
    );
  }, [handleMemberSelection]);
  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Create Group" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ gap: theme.margins.md, paddingBottom: 100 }}
      >
        <Card style={styles.inputCard}>
          {/* Avatar Picker */}
          <View style={styles.avatarPicker}>
            <View style={styles.mainAvatar}>
              <Text style={{ fontSize: 40 }}>{avatar}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconScroll}
            >
              {ICONS.map((icon) => (
                <Pressable
                  key={icon}
                  onPress={() => setValue("avatar", icon)}
                  style={[
                    styles.iconItem,
                    avatar === icon && {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.primaryExtraLight,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{icon}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Group Name Input */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Group Name"
                placeholder="e.g. Vacation 2024"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />
        </Card>

        {/* Add Members Section */}
        <SettingsGroup
          title="Add Members"
          rightElement={
            selectedMembers.length > 0 && (
              <Pressable onPress={handleMemberSelection}>
                <Icon
                  type="Feather"
                  name="plus"
                  size={18}
                  color={theme.colors.mutedForeground}
                />
              </Pressable>
            )
          }
        >
          {selectedMembers.length === 0 ? (
            <SelectUserCard />
          ) : (
            selectedMembers.map((member, index) => (
              <SettingsRow
                showSeparator={index != 0}
                key={member.id}
                label={member.name}
                icon={
                  <View style={styles.memberAvatar}>
                    <Text style={{ fontSize: 16 }}>{member.avatar}</Text>
                  </View>
                }
                showChevron={false}
                rightElement={
                  <Pressable onPress={() => removeMember(member.id)}>
                    <Icon
                      type="Feather"
                      name="x"
                      size={18}
                      color={theme.colors.mutedForeground}
                    />
                  </Pressable>
                }
              />
            ))
          )}
        </SettingsGroup>

        <Button
          title="Create Group"
          onPress={handleSubmit(onSubmit)}
          style={styles.createButton}
          size="lg"
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.paddings.md,
  },
  inputCard: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
    marginVertical: theme.margins.md,
  },
  avatarPicker: {
    alignItems: "center",
    gap: theme.margins.md,
  },
  mainAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryExtraLight,
  },
  iconScroll: {
    gap: theme.margins.sm,
    paddingVertical: 4,
  },
  iconItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  emptyState: {
    padding: theme.paddings.xl,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    marginTop: theme.margins.lg,
  },
}));
