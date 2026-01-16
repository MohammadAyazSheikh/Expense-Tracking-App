import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SettingsGroup } from "../components/ui/SettingsGroup";
import { useFinanceStore } from "../store";
import Toast from "react-native-toast-message";
import { Header } from "../components/ui/Headers";
import { Input } from "../components/ui/Input";
import { SettingsRow } from "../components/ui/SettingsRow";
import Checkbox from "../components/ui/Checkbox";

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
      <Header title="Create Group" onBack={() => navigation.goBack()}></Header>

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
          <Input
            label="Group Name"
            placeholder="e.g. Vacation 2024"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.colors.mutedForeground}
          />
        </Card>
        <SettingsGroup title="Add Members">
          {friends.map((friend) => (
            <SettingsRow
              key={friend.id}
              icon={<Text style={{ fontSize: 20 }}>{friend.avatar}</Text>}
              label={friend.name}
              onPress={() => toggleFriend(friend.id)}
              showChevron={false}
              rightElement={
                <Checkbox
                  checked={selectedFriends.includes(friend.id)}
                  onPress={() => toggleFriend(friend.id)}
                />
              }
            />
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
  createButton: {
    marginTop: theme.margins.lg,
  },
}));
