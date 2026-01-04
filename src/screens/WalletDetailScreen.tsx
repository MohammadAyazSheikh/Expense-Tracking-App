import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Text } from "../components/ui/Text";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { TabView } from "../components/ui/TabView";
import { useTranslation } from "../hooks/useTranslation";
import { SheetManager } from "react-native-actions-sheet";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { useFinanceStore } from "../store";
import { LineChart } from "react-native-gifted-charts";
import Toast from "react-native-toast-message";

type WalletDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "WalletDetail"
>;

export default function WalletDetailScreen() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<WalletDetailScreenRouteProp>();
  const { walletId } = route.params;
  const { wallets, transactions } = useFinanceStore();

  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const wallet = wallets.find((w) => w.id === walletId);

  if (!wallet) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text>Wallet not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScreenWrapper>
    );
  }

  // Filter transactions for this wallet
  const walletTransactions = transactions
    .filter((t) => t.walletId === walletId || t.toWalletId === walletId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const monthlyIncome = walletTransactions
    .filter(
      (t) => t.type === "income" && new Date(t.date).getMonth() === currentMonth
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = walletTransactions
    .filter(
      (t) =>
        t.type === "expense" && new Date(t.date).getMonth() === currentMonth
    )
    .reduce((sum, t) => sum + t.amount, 0);

  // Balance history mock data (in real app, calculate from transactions)
  const balanceData = [
    { value: wallet.balance - 500 },
    { value: wallet.balance - 200 },
    { value: wallet.balance + 1000 },
    { value: wallet.balance - 300 },
    { value: wallet.balance + 500 },
    { value: wallet.balance },
  ];

  const handleMenuAction = () => {
    // In a real app, use a dropdown or action sheet
    // For now showing Edit sheet
    SheetManager.show("edit-wallet-sheet", {
      payload: { walletId: wallet.id },
    });
  };

  const TransactionList = ({
    type,
  }: {
    type: "all" | "income" | "expense";
  }) => {
    const filtered = walletTransactions.filter((t) =>
      type === "all" ? true : t.type === type
    );

    if (filtered.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.colors.mutedForeground }}>
            No {type} transactions
          </Text>
        </View>
      );
    }

    return (
      <View style={{ gap: theme.margins.sm }}>
        {filtered.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            onPress={() =>
              navigation.navigate("TransactionDetail", {
                transactionId: transaction.id,
              })
            }
          >
            <Card style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        transaction.type === "income"
                          ? theme.colors.success + "20"
                          : theme.colors.destructive + "20",
                    },
                  ]}
                >
                  <Icon
                    type="Feather"
                    name={
                      transaction.type === "income"
                        ? "arrow-down-left"
                        : "arrow-up-right"
                    }
                    size={20}
                    color={
                      transaction.type === "income"
                        ? theme.colors.success
                        : theme.colors.destructive
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="medium">
                    {transaction.description || transaction.category}
                  </Text>
                  <Text
                    variant="caption"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    weight="bold"
                    style={{
                      color:
                        transaction.type === "income"
                          ? theme.colors.success
                          : theme.colors.foreground,
                    }}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                  <Badge variant="secondary" style={{ paddingVertical: 2 }}>
                    <Text style={{ fontSize: 10 }}>{transaction.category}</Text>
                  </Badge>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const routes = [
    { key: "all", title: t("wallets.viewAll") },
    { key: "income", title: t("wallets.income") },
    { key: "expense", title: t("wallets.expense") },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    return <TransactionList type={route.key as any} />;
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Button
              title=""
              icon={
                <Icon
                  type="Feather"
                  name="arrow-left"
                  size={24}
                  color={theme.colors.foreground}
                />
              }
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={{ width: 40, paddingHorizontal: 0 }}
            />
            <View>
              <Text variant="h3">{wallet.name}</Text>
              {wallet.accountNumber && (
                <Text
                  variant="caption"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  {wallet.accountNumber}
                </Text>
              )}
            </View>
          </View>
          <Button
            title=""
            icon={
              <Icon
                type="Feather"
                name="more-vertical"
                size={24}
                color={theme.colors.foreground}
              />
            }
            variant="ghost"
            onPress={handleMenuAction}
            style={{ width: 40, paddingHorizontal: 0 }}
          />
        </View>

        <View style={styles.content}>
          {/* Balance Card */}
          <Card style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={{ color: "white", opacity: 0.8 }}>
                {t("wallets.currentBalance")}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Icon
                  type="Feather"
                  name={showBalance ? "eye" : "eye-off"}
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <Text variant="h1" style={styles.balanceText}>
              {showBalance ? `$${wallet.balance.toFixed(2)}` : "••••••"}
            </Text>
            <View style={styles.badgeRow}>
              <Badge
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderWidth: 0,
                }}
              >
                <Text style={{ color: "white", textTransform: "capitalize" }}>
                  {wallet.type}
                </Text>
              </Badge>
              <Badge
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderWidth: 0,
                }}
              >
                <Text style={{ color: "white" }}>
                  {wallet.currency || "USD"}
                </Text>
              </Badge>
            </View>
          </Card>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: theme.colors.success + "20" },
                ]}
              >
                <Icon
                  type="Feather"
                  name="trending-up"
                  size={16}
                  color={theme.colors.success}
                />
              </View>
              <Text variant="caption">{t("wallets.income")}</Text>
              <Text weight="bold" style={{ color: theme.colors.success }}>
                +${monthlyIncome.toFixed(2)}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: theme.colors.destructive + "20" },
                ]}
              >
                <Icon
                  type="Feather"
                  name="trending-down"
                  size={16}
                  color={theme.colors.destructive}
                />
              </View>
              <Text variant="caption">{t("wallets.expense")}</Text>
              <Text weight="bold" style={{ color: theme.colors.destructive }}>
                -${monthlyExpense.toFixed(2)}
              </Text>
            </Card>
          </View>

          {/* Chart */}
          <Card style={styles.chartCard}>
            <Text weight="semiBold" style={{ marginBottom: theme.margins.md }}>
              {t("wallets.balanceTrend")}
            </Text>
            <LineChart
              data={balanceData}
              height={150}
              width={300} // Adjust based on screen width
              color={theme.colors.primary}
              thickness={2}
              hideRules
              hideYAxisText
              hideAxesAndRules
              curved
              startFillColor={theme.colors.primary + "20"}
              endFillColor={theme.colors.primary + "00"}
              startOpacity={0.2}
              endOpacity={0}
              areaChart
            />
          </Card>

          {/* Actions */}
          <View style={styles.actionRow}>
            <Button
              title={t("wallets.downloadStatement")}
              variant="outline"
              icon={
                <Icon
                  type="Feather"
                  name="download"
                  size={16}
                  color={theme.colors.primary}
                />
              }
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate("WalletStatement", { walletId })
              }
            />
            <Button
              title={t("wallets.transfer")}
              icon={
                <Icon
                  type="Feather"
                  name="refresh-cw"
                  size={16}
                  color="white"
                />
              }
              style={{ flex: 1 }}
              onPress={() => SheetManager.show("transfer-sheet")}
            />
          </View>

          {/* Transactions */}
          <View>
            <Text variant="h3" style={{ marginBottom: theme.margins.md }}>
              {t("wallets.transactions")}
            </Text>
            <TabView
              routes={routes}
              screens={{
                all: () => <TransactionList type="all" />,
                income: () => <TransactionList type="income" />,
                expense: () => <TransactionList type="expense" />,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.margins.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.paddings.md,
    paddingVertical: theme.paddings.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    borderRadius: theme.radius.xl,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.sm,
  },
  balanceText: {
    color: "white",
    marginBottom: theme.margins.md,
  },
  badgeRow: {
    flexDirection: "row",
    gap: theme.margins.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  statCard: {
    flex: 1,
    padding: theme.paddings.md,
    gap: theme.margins.xs,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.margins.xs,
  },
  chartCard: {
    padding: theme.paddings.md,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  emptyState: {
    padding: theme.paddings.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionCard: {
    padding: theme.paddings.md,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
}));
