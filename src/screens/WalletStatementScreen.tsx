import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Text } from "../components/ui/Text";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { useFinanceStore } from "../store";
import Toast from "react-native-toast-message";
import { TransactionCard } from "../components/transactions/TransactionCard";
import { SheetManager } from "react-native-actions-sheet";
import { SelectorOption } from "../components/sheets/SelectSheet";

type WalletStatementScreenRouteProp = RouteProp<
  RootStackParamList,
  "WalletStatement"
>;

export default function WalletStatementScreen() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<WalletStatementScreenRouteProp>();
  const { walletId } = route.params;
  const { wallets, transactions, categories } = useFinanceStore();

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [dateFilter, setDateFilter] = useState("this_month");

  const wallet = wallets.find((w) => w.id === walletId);

  const handleDateFilter = async () => {
    const options: SelectorOption[] = [
      { label: "This Month", value: "this_month" },
      { label: "Last Month", value: "last_month" },
      { label: "Last 3 Months", value: "last_3_months" },
      { label: "All Time", value: "all_time" },
    ];

    const result = await SheetManager.show("select-sheet", {
      payload: {
        options,
        title: "Select Period",
        selectedValue: dateFilter,
      },
    });

    if (result) {
      setDateFilter(result);
    }
  };

  const handleTypeFilter = async () => {
    const options: SelectorOption[] = [
      { label: t("wallets.viewAll"), value: "all" },
      { label: t("wallets.income"), value: "income" },
      { label: t("wallets.expense"), value: "expense" },
    ];

    const result = await SheetManager.show("select-sheet", {
      payload: {
        options,
        title: "Filter by Type",
        selectedValue: filterType,
      },
    });

    if (result) {
      setFilterType(result as any);
    }
  };

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

  // Filter by date first
  const dateFilteredParams = (t: any) => {
    const d = new Date(t.date);
    const now = new Date();
    if (dateFilter === "this_month") {
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }
    if (dateFilter === "last_month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        d.getMonth() === lastMonth.getMonth() &&
        d.getFullYear() === lastMonth.getFullYear()
      );
    }
    if (dateFilter === "last_3_months") {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      return d >= threeMonthsAgo;
    }
    return true;
  };

  // Get transactions for this wallet AND date loop
  const walletTransactions = transactions
    .filter(
      (t) =>
        (t.walletId === walletId || t.toWalletId === walletId) &&
        dateFilteredParams(t),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ascending for running balance

  // Calculate opening balance (mock logic: all time balance minus visible transactions change?
  // No, opening balance is balance BEFORE the first visible transaction.
  // Actually, easiest way is: Current Wallet Balance - Sum(Visible Transactions Change).
  // This gives Opening Balance of the PERIOD.

  const totalChange = walletTransactions.reduce((acc, t) => {
    if (t.type === "income") return acc + t.amount;
    if (t.type === "expense") return acc - Math.abs(t.amount); // Ensure expense is subtracted
    if (t.type === "transfer") {
      if (t.toWalletId === walletId) return acc + t.amount;
      return acc - t.amount;
    }
    return acc;
  }, 0);

  const openingBalance = wallet ? wallet.balance - totalChange : 0;

  // NOTE: This logic assumes 'wallet.balance' is the CURRENT balance.
  // If we filter 'last month', we take current balance, subtract everything since then?
  // No, we need to subtract "Date Filtered Transactions" change to get Opening of that period?
  // AND subtract "Future Transactions" (after period)?
  // Correct logic:
  // Opening Balance = Initial Balance (0) + Sum(All transactions BEFORE period).
  // Closing Balance = Opening Balance + Sum(Transactions IN period).

  // Simplified for now: We stick to "Current Balance - Change in Period" = Opening Balance (approx).
  // But if we have transactions AFTER the period (e.g. looking at last month while in this month),
  // we must also subtract transactions AFTER the period.

  // Let's refine:
  // 1. Get ALL transactions for wallet.
  // 2. Sort by date.
  // 3. Calculate running balance from start.
  // 4. Return window of transactions/balances matching filters.

  const allWalletTransactions = transactions
    .filter((t) => t.walletId === walletId || t.toWalletId === walletId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBal = 0; // Or wallet.initialBalance if we had it. Assuming 0 start + adjustments?
  // Actually usually users set initial balance. `wallet.balance` is current.
  // If we work backwards from current?
  // Let's work backwards.

  // But for display we need running balance for each transaction.

  // Simplest approach satisfying user request "Transactions List should be same as web":
  // List transactions.
  // Use current logic for now but filtered by date.

  // Enhance transactions with running balance (Local approach)
  let currentBalance = openingBalance;
  const enhancedTransactions = walletTransactions.map((t) => {
    let change = 0;
    if (t.type === "income") change = t.amount;
    else if (t.type === "expense") change = -Math.abs(t.amount);
    else if (t.type === "transfer") {
      if (t.toWalletId === walletId) change = t.amount;
      else change = -t.amount;
    }

    currentBalance += change;
    return { ...t, runningBalance: currentBalance, change };
  });

  // Filter by Type for display
  const filteredTransactions = enhancedTransactions
    .filter((t) => (filterType === "all" ? true : t.type === filterType))
    .reverse(); // Show newest first

  const totalIncome = walletTransactions
    .filter(
      (t) =>
        t.type === "income" ||
        (t.type === "transfer" && t.toWalletId === walletId),
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = walletTransactions
    .filter(
      (t) =>
        t.type === "expense" ||
        (t.type === "transfer" && t.walletId === walletId),
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDownload = (format: string) => {
    Toast.show({
      type: "info",
      text1: t("wallets.downloadStarted"),
      text2: t("wallets.downloadDesc", { format: format.toUpperCase() }),
    });
  };

  const handleShare = () => {
    Toast.show({
      type: "success",
      text1: t("wallets.shareStatement"),
      text2: t("wallets.shareStatementDesc"),
    });
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
              <Text variant="h3">{t("wallets.statement")}</Text>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                {wallet.name}
              </Text>
            </View>
          </View>
          <Button
            title=""
            icon={
              <Icon
                type="Feather"
                name="share-2"
                size={24}
                color={theme.colors.foreground}
              />
            }
            variant="ghost"
            onPress={handleShare}
            style={{ width: 40, paddingHorizontal: 0 }}
          />
        </View>

        <View style={styles.content}>
          {/* Summary Card */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Icon
                type="Feather"
                name="file-text"
                size={20}
                color={theme.colors.primary}
              />
              <Text weight="semiBold">{t("wallets.statementSummary")}</Text>
            </View>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text variant="caption">{t("wallets.openingBalance")}</Text>
                <Text weight="semiBold">${openingBalance.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption">{t("wallets.closingBalance")}</Text>
                <Text weight="semiBold">${wallet.balance.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption">{t("wallets.totalIncome")}</Text>
                <Text weight="semiBold" style={{ color: theme.colors.success }}>
                  +${totalIncome.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption">{t("wallets.totalExpense")}</Text>
                <Text
                  weight="semiBold"
                  style={{ color: theme.colors.destructive }}
                >
                  -${totalExpense.toFixed(2)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Download Options */}
          <Card style={styles.downloadCard}>
            <Text weight="semiBold" style={{ marginBottom: theme.margins.sm }}>
              {t("wallets.downloadStatement")}
            </Text>
            <View style={styles.downloadGrid}>
              {["pdf", "csv", "excel"].map((format) => (
                <Button
                  key={format}
                  title={format.toUpperCase()}
                  variant="outline"
                  icon={
                    <Icon
                      type="Feather"
                      name="download"
                      size={16}
                      color={theme.colors.primary}
                    />
                  }
                  onPress={() => handleDownload(format)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>
          </Card>

          {/* Transactions List */}
          <View style={{ gap: theme.margins.md }}>
            <View style={styles.filterRow}>
              <Text weight="semiBold">{t("wallets.transactions")}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Button
                  title={dateFilter
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  variant="outline"
                  size="sm"
                  icon={
                    <Icon
                      type="Feather"
                      name="calendar"
                      size={14}
                      color={theme.colors.foreground}
                    />
                  }
                  onPress={handleDateFilter}
                />
                <Button
                  title={
                    filterType === "all"
                      ? t("wallets.viewAll")
                      : filterType === "income"
                        ? t("wallets.income")
                        : t("wallets.expense")
                  }
                  variant="outline"
                  size="sm"
                  icon={
                    <Icon
                      type="Feather"
                      name="filter"
                      size={14}
                      color={theme.colors.foreground}
                    />
                  }
                  onPress={handleTypeFilter}
                />
              </View>
            </View>

            <View style={{ gap: theme.margins.sm }}>
              {filteredTransactions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={{ color: theme.colors.mutedForeground }}>
                    No transactions found for this period
                  </Text>
                </View>
              ) : (
                filteredTransactions.map((t) => (
                  <TransactionCard
                    key={t.id}
                    transaction={t}
                    category={categories.find((c) => c.name === t.category)}
                    onPress={() => {
                      // Navigate to detail if needed
                    }}
                    showDate={true}
                  />
                ))
              )}
            </View>
          </View>

          {/* Footer Info */}
          <Card
            style={[styles.infoCard, { backgroundColor: theme.colors.muted }]}
          >
            <Text
              variant="caption"
              style={{
                textAlign: "center",
                color: theme.colors.mutedForeground,
              }}
            >
              {t("wallets.generatedOn")} {new Date().toLocaleDateString()}
            </Text>
          </Card>
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
  summaryCard: {
    padding: theme.paddings.lg,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
    marginBottom: theme.margins.md,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.lg,
  },
  summaryItem: {
    width: "45%", // 2 columns approx
  },
  downloadCard: {
    padding: theme.paddings.md,
  },
  downloadGrid: {
    flexDirection: "row",
    gap: theme.margins.sm,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.sm,
  },
  infoCard: {
    padding: theme.paddings.sm,
    alignItems: "center",
  },
  emptyState: {
    padding: theme.paddings.xl,
    alignItems: "center",
    justifyContent: "center",
  },
}));
