import React, { useState } from "react";
import { View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFinanceStore } from "../store";
import Toast from "react-native-toast-message";

const FRIEND_AVATARS = [
  "👨",
  "👩",
  "🧔",
  "👩‍🦰",
  "👨‍🦱",
  "👩‍🦳",
  "👱‍♂️",
  "👱‍♀️",
  "👲",
  "👳‍♂️",
];

export const FriendsScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const friends = useFinanceStore((state) => state.friends);
  const addFriend = useFinanceStore((state) => state.addFriend);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.email && f.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddFriend = () => {
    if (!newFriendName) {
      Toast.show({
        type: "error",
        text1: "Required Field",
        text2: "Please enter a name for your friend.",
      });
      return;
    }

    addFriend({
      name: newFriendName,
      email: newFriendEmail,
      avatar: FRIEND_AVATARS[Math.floor(Math.random() * FRIEND_AVATARS.length)],
    });

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `${newFriendName} added to friends!`,
    });

    setIsAdding(false);
    setNewFriendName("");
    setNewFriendEmail("");
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
            Friends
          </Text>
          <Button
            title=""
            icon={
              <Feather
                name={isAdding ? "x" : "user-plus"}
                size={22}
                color="white"
              />
            }
            variant="ghost"
            onPress={() => setIsAdding(!isAdding)}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {isAdding ? (
          <Card style={styles.addCard}>
            <Text weight="bold" style={{ marginBottom: 16 }}>
              Add New Friend
            </Text>
            <View style={{ gap: 12 }}>
              <View style={styles.inputContainer}>
                <Text variant="caption">Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={newFriendName}
                  onChangeText={setNewFriendName}
                  placeholderTextColor={theme.colors.mutedForeground}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text variant="caption">Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={newFriendEmail}
                  onChangeText={setNewFriendEmail}
                  placeholderTextColor={theme.colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <Button
                title="Save Friend"
                onPress={handleAddFriend}
                style={{ marginTop: 8 }}
                disabled={!newFriendName}
              />
            </View>
          </Card>
        ) : (
          <>
            <View style={styles.searchBar}>
              <Feather
                name="search"
                size={18}
                color={theme.colors.mutedForeground}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.mutedForeground}
              />
            </View>

            <Text variant="h3" style={styles.sectionTitle}>
              Your Friends
            </Text>

            <ScrollView
              contentContainerStyle={{
                gap: theme.margins.md,
                paddingBottom: 40,
              }}
            >
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <View key={friend.id} style={styles.friendRow}>
                    <View style={styles.friendAvatar}>
                      <Text style={{ fontSize: 24 }}>{friend.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text weight="bold">{friend.name}</Text>
                      {friend.email && (
                        <Text variant="caption">{friend.email}</Text>
                      )}
                    </View>
                    <TouchableOpacity style={styles.friendAction}>
                      <Feather
                        name="more-horizontal"
                        size={20}
                        color={theme.colors.mutedForeground}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Feather
                    name="users"
                    size={48}
                    color={theme.colors.mutedForeground}
                    style={{ marginBottom: 16, opacity: 0.5 }}
                  />
                  <Text weight="bold">No friends found</Text>
                  <Text
                    variant="caption"
                    style={{ textAlign: "center", marginTop: 8 }}
                  >
                    Add your friends to start splitting bills and managing
                    shared expenses.
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
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
    flex: 1,
  },
  addCard: {
    padding: theme.paddings.md,
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: theme.colors.foreground,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.paddings.md,
    ...theme.shadows.sm,
    marginBottom: theme.margins.md,
  },
  searchIcon: {
    marginRight: theme.margins.sm,
  },
  searchInput: {
    height: 44,
    flex: 1,
    color: theme.colors.foreground,
  },
  sectionTitle: {
    marginBottom: theme.margins.sm,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.paddings.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    gap: theme.margins.md,
    ...theme.shadows.sm,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  friendAction: {
    padding: 8,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.paddings.xl,
  },
}));
