import React, { useMemo } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Header } from "../components/ui/Headers";
import { Card } from "../components/ui/Card";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { useFinanceStore } from "../store";
import { TransactionCard } from "../components/transactions/TransactionCard";
import { Badge } from "../components/ui/Badge";

type FriendDetailRouteProp = RouteProp<RootStackParamList, "FriendDetail">;

export const FriendDetailScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<any>();
  const route = useRoute<FriendDetailRouteProp>();
  const { friendId } = route.params || { friendId: "1" }; // Fallback for dev

  const friends = useFinanceStore((state) => state.friends);
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);

  const friend = friends.find((f) => f.id === friendId);

  // Calculate balance and find transactions involving this friend
  // For MVP, assuming we have a way to link transactions to friends (e.g. splits)
  // Since our transaction model is simple, we'll mock the filter or use a specific property if available
  // Or just show some mock activity for now if no "shared with" field exists in Transaction

  const friendTransactions = useMemo(() => {
    // Mock filtering logic based on description or notes for MVP demo
    // In real app, we check splits
    return transactions
      .filter(
        (t) =>
          t.note?.includes(friend?.name || "") ||
          t.description?.includes(friend?.name || ""),
      )
      .slice(0, 5);
  }, [transactions, friend]);

  // Mock balance for now as it's not in Friend model directly (Friend has no balance field in types/index.ts yet, or does it?)
  // Checking types/index.ts: Friend { id, name, email, phone, avatar }
  // Web app has balance in mock data.
  // We should probably compute it or add it to store. For now, random mock or check Group connection.
  const balance = 120.5; // Positive = owes you
  const balanceStatus =
    balance > 0 ? "owesYou" : balance < 0 ? "youOwe" : "settled";

  if (!friend) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="Friend Details" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text>Friend not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Header
        title={friend.name}
        onBack={() => navigation.goBack()}
        right={
          <Button
            title=""
            icon={<Feather name="more-vertical" size={20} color="white" />}
            variant="ghost"
            onPress={() => {}}
            style={{ width: 40, paddingHorizontal: 0 }}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={{ fontSize: 40 }}>{friend.avatar}</Text>
          </View>
          <Text variant="h2" style={{ marginTop: 12 }}>
            {friend.name}
          </Text>
          {friend.email && (
            <Text variant="caption" style={{ marginTop: 4 }}>
              {friend.email}
            </Text>
          )}
          {friend.phone && <Text variant="caption">{friend.phone}</Text>}

          <View style={styles.balanceContainer}>
            {balanceStatus === "settled" ? (
              <Badge variant="secondary" size="lg">
                <Text variant="caption">All Settled Up</Text>
              </Badge>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text variant="caption" style={{ marginBottom: 4 }}>
                  {balanceStatus === "owesYou" ? "Owes you" : "You owe"}
                </Text>
                <Text
                  variant="h1"
                  style={{
                    color:
                      balanceStatus === "owesYou"
                        ? theme.colors.success
                        : theme.colors.destructive,
                  }}
                >
                  ${Math.abs(balance).toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Settle Up"
              variant="primary"
              icon={<Feather name="check" size={18} color="white" />}
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate("SettleUp", { friendId: friend.id })
              } // Assuming SettleUp accepts friendId
            />
            <Button
              title="Remind"
              variant="outline"
              icon={
                <Feather name="bell" size={18} color={theme.colors.primary} />
              }
              style={{ flex: 1 }}
              disabled={
                balanceStatus === "settled" || balanceStatus === "youOwe"
              }
            />
          </View>
        </Card>

        {/* Recent Activity */}
        <Text variant="h3" style={styles.sectionTitle}>
          Shared Activity
        </Text>
        <View style={styles.activityList}>
          {friendTransactions.length > 0 ? (
            friendTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                category={categories.find((c) => c.name === tx.category)}
                onPress={() =>
                  navigation.navigate("TransactionDetail", { id: tx.id })
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text variant="caption">No recent shared activity</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
  },
  profileCard: {
    alignItems: "center",
    padding: theme.paddings.xl,
    marginTop: theme.margins.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.margins.sm,
  },
  balanceContainer: {
    marginVertical: theme.margins.lg,
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.margins.md,
    width: "100%",
  },
  sectionTitle: {
    marginBottom: theme.margins.xs,
  },
  activityList: {
    gap: theme.margins.sm,
  },
  emptyState: {
    padding: theme.paddings.lg,
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
  },
}));
