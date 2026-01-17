import React, { useState, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { useFinanceStore } from "../store";
import { SheetManager } from "react-native-actions-sheet";
import { Header } from "../components/ui/Headers";
import { Badge } from "../components/ui/Badge";
import { SearchBar } from "../components/ui/searchbar";
import { Friend } from "../types";

type Props = {
  onPress: () => void;
  friend: Friend;
};

const FriendsCard = ({ friend, onPress }: Props) => {
  const { theme } = useUnistyles();
  return (
    <Pressable key={friend.id} onPress={onPress}>
      <Card style={styles.friendRow}>
        <View style={styles.friendAvatar}>
          <Text style={{ fontSize: 24 }}>{friend.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.friendHeader}>
            <Text weight="bold">{friend.name}</Text>
            <Feather
              name="chevron-right"
              size={20}
              color={theme.colors.mutedForeground}
            />
          </View>
          {friend.email && (
            <View style={styles.emailRow}>
              <Feather
                name="mail"
                size={12}
                color={theme.colors.mutedForeground}
              />
              <Text variant="caption">{friend.email}</Text>
            </View>
          )}
          {/* Mock Balance Badge */}
          <Badge variant={"success"} style={styles.badge}>
            Settled up
          </Badge>
        </View>
      </Card>
    </Pressable>
  );
};

export const FriendsScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const friends = useFinanceStore((state) => state.friends);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.email && f.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const { totalOwedToYou, totalYouOwe } = useMemo(() => {
    // Determine totals from friends balances
    // Mocking for now to match UI layout requirement
    return { totalOwedToYou: 120.0, totalYouOwe: 45.5 };
  }, [friends]);

  const handleAddFriend = () => {
    SheetManager.show("add-friend-sheet");
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header
        title="Friends"
        onBack={() => navigation.goBack()}
        right={
          <Button
            title="Add Friend"
            variant="secondary"
            size="sm"
            icon={<Feather name="plus" size={16} color="white" />}
            onPress={handleAddFriend}
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            textStyle={{ color: "white" }}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text variant="caption" style={styles.summaryLabel}>
              Owed to You
            </Text>
            <Text variant="h2" style={{ color: theme.colors.success }}>
              ${totalOwedToYou.toFixed(2)}
            </Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text variant="caption" style={styles.summaryLabel}>
              You Owe
            </Text>
            <Text variant="h2" style={{ color: theme.colors.destructive }}>
              ${totalYouOwe.toFixed(2)}
            </Text>
          </Card>
        </View>
      </Header>

      <View style={styles.content}>
        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statsIcon}>
              <Feather name="users" size={20} color={theme.colors.background} />
            </View>
            <View>
              <Text weight="semiBold">{friends.length} Friends</Text>
              <Text variant="caption">2 with pending balances</Text>
            </View>
          </View>
        </Card>

        {/* Search */}
        <SearchBar
          elevated
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <FriendsCard
                key={friend.id}
                friend={friend}
                onPress={() =>
                  navigation.navigate("FriendDetail", { friendId: friend.id })
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather
                name="user-plus"
                size={48}
                color={theme.colors.mutedForeground}
                style={{ marginBottom: 16, opacity: 0.5 }}
              />
              <Text weight="bold">No friends found</Text>
              <Text
                variant="caption"
                style={{ textAlign: "center", marginTop: 8 }}
              >
                Add friends to start splitting expenses
              </Text>
              <Button
                title="Add Friend"
                onPress={handleAddFriend}
                style={{ marginTop: 24 }}
                icon={<Feather name="plus" size={18} color="white" />}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.margins.md,
    marginTop: theme.margins.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: theme.paddings.md,
    borderWidth: 0,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  content: {
    flex: 1,
    padding: theme.paddings.md,
  },
  statsCard: {
    marginBottom: theme.margins.md,
    padding: theme.paddings.md,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    gap: theme.margins.md,
    paddingBottom: 40,
  },
  friendRow: {
    flexDirection: "row",
    padding: theme.paddings.md,
    gap: theme.margins.md,
    alignItems: "center",
  },
  friendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryExtraLight,
    alignItems: "center",
    justifyContent: "center",
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.paddings.xl,
  },
}));
