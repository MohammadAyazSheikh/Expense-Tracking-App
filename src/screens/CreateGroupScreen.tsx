import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SettingsGroup } from "../components/ui/SettingsGroup";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFinanceStore } from "../store";
import Toast from "react-native-toast-message";

const ICONS = ["🏠", "✈️", "🍔", "🛍️", "⚽", "🎓", "💼", "🎮", "🚗", "🍷"];

export const CreateGroupScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const friends = useFinanceStore((state) => state.friends);
  const addGroup = useFinanceStore((state) => state.addGroup);

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🏠");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const toggleFriend = (id: string) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter((f) => f !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const handleCreate = () => {
    if (!name) {
      Toast.show({
        type: "error",
        text1: "Required Field",
        text2: "Please enter a group name.",
      });
      return;
    }

    const memberNames = friends
      .filter((f) => selectedFriends.includes(f.id))
      .map((f) => f.name);

    addGroup({
      name,
      avatar: selectedAvatar,
      members: ["You", ...memberNames],
      totalExpenses: 0,
      youOwe: 0,
      youAreOwed: 0,
      lastActivity: "Just now",
    });

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Group created successfully!",
    });
    navigation.navigate("Groups");
  };

  return (
    <ScreenWrapper style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + "CC"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Button
            title=""
            icon={<Feather name="arrow-left" size={24} color="white" />}
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
          <Text variant="h2" style={styles.headerTitle}>
            Create Group
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ gap: theme.margins.md, paddingBottom: 100 }}
      >
        <Card style={styles.inputCard}>
          <View style={styles.avatarPicker}>
            <View style={styles.mainAvatar}>
              <Text style={{ fontSize: 40 }}>{selectedAvatar}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconScroll}
            >
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedAvatar(icon)}
                  style={[
                    styles.iconItem,
                    selectedAvatar === icon && {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.primary + "10",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.nameInputContainer}>
            <Text variant="caption" style={styles.inputLabel}>
              Group Name
            </Text>
            <TextInput
              style={styles.nameInput}
              placeholder="e.g. Vacation 2024"
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme.colors.mutedForeground}
            />
          </View>
        </Card>

        <SettingsGroup title="Add Members">
          {friends.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={styles.friendItem}
              onPress={() => toggleFriend(friend.id)}
            >
              <View style={styles.friendInfo}>
                <View style={styles.friendAvatar}>
                  <Text style={{ fontSize: 20 }}>{friend.avatar}</Text>
                </View>
                <Text weight="medium">{friend.name}</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedFriends.includes(friend.id) && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                {selectedFriends.includes(friend.id) && (
                  <Feather name="check" size={14} color="white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
          {friends.length === 0 && (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text variant="caption">
                No friends found. Add friends first.
              </Text>
            </View>
          )}
        </SettingsGroup>

        <Button
          title="Create Group"
          onPress={handleCreate}
          style={styles.createButton}
          size="lg"
          disabled={!name}
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
  header: {
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
  },
  inputCard: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
  },
  avatarPicker: {
    alignItems: "center",
    gap: theme.margins.md,
  },
  mainAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary + "20",
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
  nameInputContainer: {
    gap: theme.margins.xs,
  },
  inputLabel: {
    color: theme.colors.mutedForeground,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.foreground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 8,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.paddings.md,
    paddingHorizontal: theme.paddings.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "10",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    marginTop: theme.margins.lg,
  },
}));
