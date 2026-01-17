import React, { useCallback, useState } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SheetManager } from "react-native-actions-sheet";
import { Feather } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Header } from "../components/ui/Headers";
import { TabView } from "../components/ui/TabView";
import { GroupExpenseCard } from "./GroupDetailScreen";
import { useFinanceStore } from "../store";

export const SettleUpScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "SettleUp">>();
  const { groupId } = route.params;

  const groups = useFinanceStore((state) => state.groups);
  const selectedGroup = groupId ? groups.find((g) => g.id === groupId) : null;
  const updateGroup = useFinanceStore((state) => state.updateGroup);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "you-owe", title: "You Owe" },
    { key: "owed-to-you", title: "Owed to You" },
  ]);

  // Mock settlements for demonstration
  // Real implementation should fetch from store/backend
  const settlements = [
    {
      id: "1",
      from: "You",
      to: "Sarah",
      amount: 45.5,
      groupName: "Apartment Roommates",
    },
    {
      id: "2",
      from: "You",
      to: "Emma",
      amount: 85.0,
      groupName: "Trip to Bali",
    },
    {
      id: "3",
      from: "David",
      to: "You",
      amount: 22.3,
      groupName: "Office Lunch",
    },
  ].filter(
    (s) => !groupId || (selectedGroup && s.groupName === selectedGroup.name)
  );

  const youOwe = settlements.filter((s) => s.from === "You");
  const owedToYou = settlements.filter((s) => s.to === "You");

  const totalYouOwe = youOwe.reduce((sum, s) => sum + s.amount, 0);
  const totalOwedToYou = owedToYou.reduce((sum, s) => sum + s.amount, 0);

  const handleRecordPayment = async (settlement: any) => {
    await SheetManager.show("record-payment-sheet", {
      payload: {
        settlement,
        onConfirm: (amount, method) => {
          // Logic to record payment
          // For demo, we just update the local group logic if applicable
          if (settlement.from === "You" && selectedGroup) {
            updateGroup(selectedGroup.id, {
              youOwe: Math.max(0, selectedGroup.youOwe - amount),
              lastActivity: `Paid $${amount} to ${settlement.to}`,
            });
          }
        },
      },
    });
  };

  const YouOweTab = useCallback(
    () => (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
      >
        {youOwe.length > 0 ? (
          youOwe.map((item) => (
            <GroupExpenseCard
              key={item.id}
              title={item.to}
              description={item.groupName}
              amount={item.amount}
              amountColor={theme.colors.destructive}
              rightText="You owe"
              icon={
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.destructive },
                  ]}
                >
                  <Text weight="bold" style={styles.avatarText}>
                    {item.to.charAt(0)}
                  </Text>
                </View>
              }
              onPress={() => handleRecordPayment(item)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather
              name="check-circle"
              size={48}
              color={theme.colors.success}
              style={{ marginBottom: 16 }}
            />
            <Text weight="bold">All settled up!</Text>
            <Text variant="caption">You don't owe anyone money right now.</Text>
          </View>
        )}
      </ScrollView>
    ),
    [youOwe, theme]
  );

  const OwedToYouTab = useCallback(
    () => (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
      >
        {owedToYou.length > 0 ? (
          owedToYou.map((item) => (
            <GroupExpenseCard
              key={item.id}
              title={item.from}
              description={item.groupName}
              amount={item.amount}
              amountColor={theme.colors.success}
              rightText="Owes you"
              icon={
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.success },
                  ]}
                >
                  <Text weight="bold" style={styles.avatarText}>
                    {item.from.charAt(0)}
                  </Text>
                </View>
              }
              onPress={() => handleRecordPayment(item)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather
              name="dollar-sign"
              size={48}
              color={theme.colors.mutedForeground}
              style={{ marginBottom: 16 }}
            />
            <Text weight="bold">No pending payments</Text>
            <Text variant="caption">No one owes you money right now.</Text>
          </View>
        )}
      </ScrollView>
    ),
    [owedToYou, theme]
  );

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Settle Up" onBack={() => navigation.goBack()}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <Card variant="flat" style={styles.summaryCard}>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.8)" }}>
              You Owe
            </Text>
            <Text
              weight="bold"
              style={{ color: theme.colors.background, fontWeight: "bold" }}
            >
              ${totalYouOwe.toFixed(2)}
            </Text>
          </Card>
          <Card variant="flat" style={styles.summaryCard}>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.8)" }}>
              Owed to You
            </Text>
            <Text
              weight="bold"
              style={{ color: theme.colors.background, fontWeight: "bold" }}
            >
              ${totalOwedToYou.toFixed(2)}
            </Text>
          </Card>
        </View>
      </Header>

      <View style={styles.body}>
        <TabView
          routes={routes}
          screens={{
            "you-owe": YouOweTab,
            "owed-to-you": OwedToYouTab,
          }}
          onIndexChange={setIndex}
          initialIndex={0}
          style={{ flex: 1 }}
        />
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
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContent: {
    padding: theme.paddings.md,
    gap: theme.margins.md,
    paddingBottom: 40,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.background,
  },
}));
