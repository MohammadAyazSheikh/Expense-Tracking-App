import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFinanceStore } from "../store";

export const GroupDetailScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "GroupDetail">>();
  const { id } = route.params;

  const group = useFinanceStore((state) =>
    state.groups.find((g) => g.id === id)
  );
  const allExpenses = useFinanceStore((state) => state.groupExpenses);
  const groupExpenses = allExpenses.filter((e) => e.groupId === id);

  const [activeTab, setActiveTab] = useState<
    "expenses" | "balances" | "members"
  >("expenses");

  if (!group) return null;

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
          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <Text style={{ fontSize: 20 }}>{group.avatar}</Text>
            </View>
            <Text variant="h3" style={styles.headerTitle}>
              {group.name}
            </Text>
          </View>
          <Button
            title=""
            icon={<Feather name="settings" size={20} color="white" />}
            variant="ghost"
            onPress={() => {}}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <Card style={styles.summaryCardSmall}>
            <Text variant="caption" style={styles.summaryLabel}>
              Total Expenses
            </Text>
            <Text style={styles.summaryCardValue} weight="bold">
              ${group.totalExpenses.toLocaleString()}
            </Text>
          </Card>
          <Card style={styles.summaryCardSmall}>
            <Text variant="caption" style={styles.summaryLabel}>
              Your Share
            </Text>
            <Text style={styles.summaryCardValue} weight="bold">
              ${(group.totalExpenses / group.members.length).toFixed(2)}
            </Text>
          </Card>
        </View>

        {/* Quick Actions at Top */}
        <View style={styles.quickActionsRow}>
          <Button
            title="Add Expense"
            icon={<Feather name="plus" size={16} color="white" />}
            onPress={() =>
              navigation.navigate("AddGroupExpense", { groupId: group.id })
            }
            style={{ flex: 1, height: 48 }}
          />
          <Button
            title="Settle Up"
            variant="outline"
            icon={
              <Feather
                name="dollar-sign"
                size={16}
                color={theme.colors.primary}
              />
            }
            onPress={() =>
              navigation.navigate("SettleUp", { groupId: group.id })
            }
            style={{ flex: 1, height: 48 }}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {["expenses", "balances", "members"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {activeTab === "expenses" ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: theme.margins.md,
              paddingBottom: 40,
            }}
          >
            {groupExpenses.length > 0 ? (
              groupExpenses.map((expense) => (
                <Card key={expense.id} style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <View style={styles.expenseIcon}>
                      <Feather
                        name="file-text"
                        size={18}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text weight="bold">{expense.description}</Text>
                      <Text variant="caption">
                        Paid by {expense.paidBy} • {expense.date}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text weight="bold" style={{ fontSize: 18 }}>
                        ${expense.amount.toFixed(2)}
                      </Text>
                      <Text variant="caption" style={{ fontSize: 10 }}>
                        Split {group.members.length} ways
                      </Text>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather
                  name="file-text"
                  size={48}
                  color={theme.colors.mutedForeground}
                  style={{ marginBottom: 16 }}
                />
                <Text weight="bold">No expenses yet</Text>
                <Text
                  variant="caption"
                  style={{ textAlign: "center", marginTop: 8 }}
                >
                  Add an expense to start splitting with the group.
                </Text>
              </View>
            )}
          </ScrollView>
        ) : activeTab === "balances" ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: theme.margins.md,
              paddingBottom: 40,
            }}
          >
            {/* Suggested Settlements - Visual like web */}
            <Card
              style={[
                styles.balanceCard,
                {
                  backgroundColor: theme.colors.primary + "05",
                  borderColor: theme.colors.primary + "20",
                  borderWidth: 1,
                },
              ]}
            >
              <Text weight="bold" style={{ marginBottom: 16 }}>
                Suggested Settlements
              </Text>
              <View style={{ gap: 12 }}>
                {group.youOwe > 0 && (
                  <View style={styles.suggestedSettlementRow}>
                    <View style={styles.settlementAvatars}>
                      <View
                        style={[
                          styles.smallAvatar,
                          { backgroundColor: theme.colors.primary + "10" },
                        ]}
                      >
                        <Text style={{ fontSize: 10 }}>Y</Text>
                      </View>
                      <Feather
                        name="arrow-right"
                        size={14}
                        color={theme.colors.mutedForeground}
                      />
                      <View
                        style={[
                          styles.smallAvatar,
                          { backgroundColor: theme.colors.success + "10" },
                        ]}
                      >
                        <Text style={{ fontSize: 10 }}>S</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text weight="bold" style={{ fontSize: 14 }}>
                        ${group.youOwe.toFixed(2)}
                      </Text>
                      <Text variant="caption">You → Sarah</Text>
                    </View>
                  </View>
                )}
                {group.youAreOwed > 0 && (
                  <View style={styles.suggestedSettlementRow}>
                    <View style={styles.settlementAvatars}>
                      <View
                        style={[
                          styles.smallAvatar,
                          { backgroundColor: theme.colors.primary + "10" },
                        ]}
                      >
                        <Text style={{ fontSize: 10 }}>M</Text>
                      </View>
                      <Feather
                        name="arrow-right"
                        size={14}
                        color={theme.colors.mutedForeground}
                      />
                      <View
                        style={[
                          styles.smallAvatar,
                          { backgroundColor: theme.colors.success + "10" },
                        ]}
                      >
                        <Text style={{ fontSize: 10 }}>Y</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text weight="bold" style={{ fontSize: 14 }}>
                        ${group.youAreOwed.toFixed(2)}
                      </Text>
                      <Text variant="caption">Mike → You</Text>
                    </View>
                  </View>
                )}
              </View>
            </Card>

            <Text weight="bold" style={{ marginTop: 8 }}>
              Individual Balances
            </Text>
            {group.members.map((member) => {
              const balance =
                member === "You"
                  ? group.youAreOwed - group.youOwe
                  : member === "Sarah"
                  ? 120.0
                  : -74.5; // Mock data for demo
              return (
                <Card key={member} style={styles.balanceCardSmall}>
                  <View style={styles.memberRow}>
                    <View style={styles.memberInfo}>
                      <View style={styles.memberAvatar}>
                        <Text style={{ fontSize: 14 }}>{member.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text weight="bold">{member}</Text>
                        <Text variant="caption">
                          {balance >= 0 ? "is owed money" : "owes money"}
                        </Text>
                      </View>
                    </View>
                    <Text
                      weight="bold"
                      style={{
                        color:
                          balance >= 0
                            ? theme.colors.success
                            : theme.colors.destructive,
                      }}
                    >
                      {balance >= 0 ? "+" : ""}${Math.abs(balance).toFixed(2)}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.margins.md, paddingBottom: 40 }}
          >
            {group.members.map((member) => (
              <Card key={member} style={styles.expenseCard}>
                <View style={[styles.memberRow, { borderBottomWidth: 0 }]}>
                  <View style={styles.memberInfo}>
                    <View
                      style={[
                        styles.memberAvatar,
                        { width: 44, height: 44, borderRadius: 22 },
                      ]}
                    >
                      <Text style={{ fontSize: 18 }}>{member.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text weight="bold">{member}</Text>
                      <Text variant="caption">Member</Text>
                    </View>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={theme.colors.mutedForeground}
                  />
                </View>
              </Card>
            ))}
            <Button
              title="Add Member"
              variant="outline"
              icon={
                <Feather name="plus" size={16} color={theme.colors.primary} />
              }
              onPress={() => {}}
              style={{ marginTop: 8 }}
            />
          </ScrollView>
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("AddGroupExpense", { groupId: group.id })
        }
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.paddings.lg,
    paddingHorizontal: theme.paddings.lg,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.margins.lg,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
  },
  summaryCards: {
    flexDirection: "row",
    gap: theme.margins.md,
    marginBottom: theme.margins.lg,
  },
  summaryCardSmall: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
  },
  summaryLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  summaryCardValue: {
    color: "white",
    fontSize: 20,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: theme.margins.md,
    marginBottom: theme.margins.lg,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "white",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "white",
  },
  content: {
    flex: 1,
    padding: theme.paddings.md,
    marginTop: -theme.margins.sm,
  },
  expenseCard: {
    padding: theme.paddings.md,
  },
  expenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    padding: theme.paddings.md,
  },
  balanceCardSmall: {
    padding: theme.paddings.md,
  },
  suggestedSettlementRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: 12,
    borderRadius: 8,
  },
  settlementAvatars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.paddings.xl,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
}));
