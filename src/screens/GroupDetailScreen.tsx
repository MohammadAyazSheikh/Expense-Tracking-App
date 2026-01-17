import React, { useCallback, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SheetManager } from "react-native-actions-sheet";
import { Feather } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Header } from "../components/ui/Headers";
import { TabView } from "../components/ui/TabView";
import { useAuthStore, useFinanceStore } from "../store";
import { Badge } from "../components/ui/Badge";
import { FriendsCard } from "./FriendsScreen";

type GroupExpenseCardProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  amount?: number;
  amountColor?: string;
  rightText?: string;
  badgeText?: string;
  onPress?: () => void;
};

const GroupExpenseCard = ({
  title,
  description,
  amount,
  amountColor,
  rightText,
  icon,
  badgeText,
  onPress,
}: GroupExpenseCardProps) => {
  const { theme } = useUnistyles();

  return (
    <Card onPress={onPress} style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        {icon || (
          <View style={[styles.iconContainer]}>
            <Feather
              name="file-text"
              size={18}
              color={theme.colors.background}
            />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text weight="bold">{title}</Text>
          {description && <Text variant="caption">{description}</Text>}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          {amount && (
            <Text
              weight="bold"
              style={[
                { fontSize: 18 },
                amountColor ? { color: amountColor } : {},
              ]}
            >
              ${amount.toFixed(2)}
            </Text>
          )}
          {rightText && <Text variant="caption">{rightText}</Text>}
        </View>
      </View>
      {badgeText && (
        <Badge style={{ marginTop: 10 }} variant="outline">
          {badgeText}
        </Badge>
      )}
    </Card>
  );
};

export const GroupDetailScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "GroupDetail">>();
  const { id } = route.params;
  const { user } = useAuthStore();
  const {
    groups,
    updateGroup,
    friends,
    groupExpenses: allExpenses,
  } = useFinanceStore();

  const group = groups.find((g) => g.id === id);
  const groupExpenses = allExpenses.filter((e) => e.groupId === id);

  const [routes] = useState([
    { key: "expenses", title: "Expenses" },
    { key: "balances", title: "Balances" },
    { key: "members", title: "Members" },
  ]);

  const handleAddMember = async () => {
    if (!group) return;

    const availableFriends = friends.filter(
      (f) => !group.members.includes(f.name) && f.name !== "You"
    );

    const memberOptions = availableFriends.map((friend) => ({
      label: friend.name,
      value: friend.id,
      avatar: friend.avatar,
    }));

    if (memberOptions.length === 0) {
      // Show proper feedback
      return;
    }

    const result = await SheetManager.show("multi-select-sheet", {
      payload: {
        options: memberOptions,
        title: "Add Members",
        selectedValues: [], // We are adding NEW members
      },
    });

    if (result) {
      const newMemberIds = result as string[];
      const newMemberNames = friends
        .filter((f) => newMemberIds.includes(f.id))
        .map((f) => f.name);

      const updatedMembers = [...group.members, ...newMemberNames];
      updateGroup(group.id, { members: updatedMembers });
    }
  };

  const ExpensesTab = useCallback(
    () => (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
      >
        {groupExpenses.length > 0 ? (
          groupExpenses.map((expense) => {
            const myShare = expense.splits.find((s) => s.memberId === user?.id);
            const badgeText = `Your share: $${myShare?.amount || 23.5}`;
            return (
              <GroupExpenseCard
                key={expense.id}
                title={expense.description}
                description={expense.paidBy}
                amount={expense.amount}
                rightText={expense.splitType}
                badgeText={badgeText}
                onPress={() => {}}
              />
            );
          })
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
    ),
    [groupExpenses, group, theme]
  );

  const BalancesTab = useCallback(
    () => (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
      >
        {/* Suggested Settlements */}
        <Card style={styles.suggestionsCard}>
          <Text weight="semiBold" style={{ marginBottom: 12 }}>
            Suggested Settlements
          </Text>
          <View style={{ gap: 12 }}>
            {group && group.youOwe > 0 && (
              <View style={styles.settlementRow}>
                <View style={styles.settlementAvatars}>
                  <View
                    style={[
                      styles.avatarSmall,
                      { backgroundColor: theme.colors.primary + "10" },
                    ]}
                  >
                    <Text style={{ fontSize: 10 }}>Y</Text>
                  </View>
                  <Feather
                    name="arrow-right"
                    size={12}
                    color={theme.colors.mutedForeground}
                  />
                  <View
                    style={[
                      styles.avatarSmall,
                      { backgroundColor: theme.colors.success + "10" },
                    ]}
                  >
                    <Text style={{ fontSize: 10 }}>S</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="bold">${group.youOwe.toFixed(2)}</Text>
                  <Text variant="caption">You → Sarah</Text>
                </View>
              </View>
            )}
            {/* Mocking another settlement if needed or empty state */}
            {(!group || group.youOwe <= 0) && (
              <Text variant="caption">No pending settlements.</Text>
            )}
          </View>
        </Card>

        <Text weight="semiBold" style={{ marginTop: 8, marginBottom: 4 }}>
          Individual Balances
        </Text>
        {group?.members.map((member) => {
          const balance =
            member === "You"
              ? group.youAreOwed - group.youOwe
              : member === "Sarah"
              ? 120
              : -74.5;

          return (
            <GroupExpenseCard
              key={member}
              title={member}
              description={balance >= 0 ? "is owed money" : "owes money"}
              amount={balance >= 0 ? balance : -balance}
              rightText={balance >= 0 ? "You → Sarah" : "Sarah → You"}
              amountColor={
                balance >= 0 ? theme.colors.success : theme.colors.destructive
              }
              icon={
                <View
                  style={[
                    styles.avatar,
                    { width: 40, height: 40, borderRadius: 20 },
                  ]}
                >
                  <Text>{member.charAt(0)}</Text>
                </View>
              }
            />
          );
        })}
      </ScrollView>
    ),
    [group, theme]
  );

  const MembersTab = useCallback(
    () => (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
      >
        {group?.members.map((member) => (
          <FriendsCard
            key={member}
            friend={{ name: member, id: member, avatar: member.charAt(0) }}
            onPress={() => {}}
          />
        ))}

        <TouchableOpacity
          style={styles.addMemberButton}
          onPress={handleAddMember}
        >
          <Feather name="plus" size={16} color={theme.colors.primary} />
          <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
            Add Member
          </Text>
        </TouchableOpacity>
      </ScrollView>
    ),
    [group, theme]
  );

  if (!group) return null;

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Group Details" onBack={() => navigation.goBack()}>
        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.groupInfo}>
            <View style={styles.groupAvatar}>
              <Text style={{ fontSize: 40 }}>{group.avatar}</Text>
            </View>
            <View>
              <Text variant="h2" style={{ color: "white" }}>
                {group.name}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                {group.members.length} members
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Card variant="flat" style={styles.summaryCard}>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                Total Expenses
              </Text>
              <Text variant="h3" style={{ color: "white" }}>
                ${group.totalExpenses.toLocaleString()}
              </Text>
            </Card>
            <Card variant="flat" style={styles.summaryCard}>
              <Text
                variant="caption"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Your Share
              </Text>
              <Text variant="h3" style={{ color: "white" }}>
                ${(group.totalExpenses / group.members.length).toFixed(2)}
              </Text>
            </Card>
          </View>
        </View>
      </Header>

      <View style={styles.body}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Add Expense"
            icon={
              <Feather name="plus" size={16} color={theme.colors.foreground} />
            }
            style={styles.actionButton}
            variant="outline"
            textStyle={{ color: theme.colors.foreground }}
            onPress={() =>
              navigation.navigate("AddGroupExpense", { groupId: group.id })
            }
          />
          <Button
            title="Settle Up"
            icon={
              <Feather
                name="dollar-sign"
                size={16}
                color={theme.colors.foreground}
              />
            }
            style={styles.actionButton}
            variant="outline"
            textStyle={{ color: theme.colors.foreground }}
            onPress={() =>
              navigation.navigate("SettleUp", { groupId: group.id })
            }
          />
        </View>

        <TabView
          routes={routes}
          screens={{
            expenses: ExpensesTab,
            balances: BalancesTab,
            members: MembersTab,
          }}
          style={{ flex: 1 }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContent: {
    paddingTop: theme.paddings.md,
    gap: theme.margins.lg,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  groupAvatar: {
    borderRadius: 2000,
    width: rt.screen.width * 0.18,
    aspectRatio: 1,
    padding: theme.paddings.xs,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: theme.paddings.md,
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.paddings.md,
  },
  quickActions: {
    flexDirection: "row",
    gap: theme.margins.md,
    paddingHorizontal: theme.paddings.md,
    marginBottom: theme.margins.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 0,
    ...theme.shadows.sm,
  },
  tabContent: {
    padding: theme.paddings.md,
    gap: theme.margins.md,
    paddingBottom: 80,
  },
  expenseCard: {
    padding: theme.paddings.md,
  },
  expenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryLight,
  },
  emptyState: {
    padding: theme.paddings.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionsCard: {
    padding: theme.paddings.md,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.primary + "30",
    borderWidth: 1,
  },
  settlementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    padding: theme.paddings.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
  },
  settlementAvatars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  addMemberButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.paddings.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderStyle: "dashed",
    marginTop: theme.margins.sm,
    gap: 8,
  },
}));
