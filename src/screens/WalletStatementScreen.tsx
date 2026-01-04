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
  const { wallets, transactions } = useFinanceStore();

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );

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

  // Get transactions for this wallet
  const walletTransactions = transactions
    .filter((t) => t.walletId === walletId || t.toWalletId === walletId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ascending for running balance

  // Calculate opening balance (mock logic: current balance - sum of visible transactions)
  // In a real app, this would be based on the selected period
  const totalChange = walletTransactions.reduce((acc, t) => {
    if (t.type === "income") return acc + t.amount;
    if (t.type === "expense") return acc - Math.abs(t.amount); // Ensure expense is subtracted
    if (t.type === "transfer") {
      if (t.toWalletId === walletId) return acc + t.amount;
      return acc - t.amount;
    }
    return acc;
  }, 0);

  const openingBalance = wallet.balance - totalChange;

  // Enhance transactions with running balance
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

  // Filter for display
  const filteredTransactions = enhancedTransactions
    .filter((t) => (filterType === "all" ? true : t.type === filterType))
    .reverse(); // Show newest first

  const totalIncome = walletTransactions
    .filter(
      (t) =>
        t.type === "income" ||
        (t.type === "transfer" && t.toWalletId === walletId)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = walletTransactions
    .filter(
      (t) =>
        t.type === "expense" ||
        (t.type === "transfer" && t.walletId === walletId)
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
              <View>
                <Text variant="caption">{t("wallets.openingBalance")}</Text>
                <Text weight="semiBold">${openingBalance.toFixed(2)}</Text>
              </View>
              <View>
                <Text variant="caption">{t("wallets.closingBalance")}</Text>
                <Text weight="semiBold">${wallet.balance.toFixed(2)}</Text>
              </View>
              <View>
                <Text variant="caption">{t("wallets.totalIncome")}</Text>
                <Text weight="semiBold" style={{ color: theme.colors.success }}>
                  +${totalIncome.toFixed(2)}
                </Text>
              </View>
              <View>
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
          <View>
            <View style={styles.filterRow}>
              <Text weight="semiBold">{t("wallets.transactions")}</Text>
              {/* Simple filter toggles could go here */}
            </View>

            <Card style={styles.tableCard}>
              <View
                style={[
                  styles.tableHeader,
                  { backgroundColor: theme.colors.muted },
                ]}
              >
                <Text variant="caption" style={{ flex: 2 }}>
                  Date
                </Text>
                <Text variant="caption" style={{ flex: 3 }}>
                  Description
                </Text>
                <Text variant="caption" style={{ flex: 2, textAlign: "right" }}>
                  Amount
                </Text>
              </View>
              {filteredTransactions.map((t, index) => (
                <View
                  key={t.id}
                  style={[
                    styles.tableRow,
                    index !== filteredTransactions.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={{ flex: 2, color: theme.colors.mutedForeground }}
                  >
                    {new Date(t.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <Text variant="caption" numberOfLines={1} style={{ flex: 3 }}>
                    {t.description || t.category}
                  </Text>
                  <View style={{ flex: 2, alignItems: "flex-end" }}>
                    <Text
                      variant="caption"
                      weight="semiBold"
                      style={{
                        color:
                          t.change > 0
                            ? theme.colors.success
                            : theme.colors.destructive,
                      }}
                    >
                      {t.change > 0 ? "+" : ""}
                      {t.change.toFixed(2)}
                    </Text>
                    <Text
                      variant="caption"
                      style={{
                        fontSize: 10,
                        color: theme.colors.mutedForeground,
                      }}
                    >
                      ${t.runningBalance.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
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
    marginBottom: theme.margins.sm,
  },
  tableCard: {
    padding: 0,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    padding: theme.paddings.sm,
  },
  tableRow: {
    flexDirection: "row",
    padding: theme.paddings.sm,
    alignItems: "center",
  },
  infoCard: {
    padding: theme.paddings.sm,
    alignItems: "center",
  },
}));
