import React, { useState } from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Text } from "../components/ui/Text";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useFinanceStore } from "../store";
import { TabView } from "../components/ui/TabView";
import { useTranslation } from "../hooks/useTranslation";
import { SheetManager } from "react-native-actions-sheet";
import { RootStackParamList } from "../navigation/types";
import Toast from "react-native-toast-message";
import { Header } from "../components/ui/Headers";
import { LineChart } from "react-native-gifted-charts";
import { MenuItem } from "../components/sheets/MenuSheet";
import { StackNavigationProp } from "@react-navigation/stack";
import { TransactionCard } from "../components/transactions/TransactionCard";
import { useNavigation } from "@react-navigation/native";
import { Transaction } from "@/types";
import { SafeArea } from "@/components/ui/SafeArea";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/libs/database";
import { Wallet } from "@/database/models/wallet";
import { Currencies } from "@/database/models/currency";
import { WalletTypes } from "@/database/models/wallet";
import { walletService } from "@/services/business/walletService";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ApiLoader } from "@/components/ui/ApiLoader";

type WalletDetailProps = {
  wallet: Wallet;
  walletType: WalletTypes | null;
  currency: Currencies | null;
};

const BaseWalletDetailScreen = ({
  wallet,
  walletType,
  currency,
}: WalletDetailProps) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { categories } = useFinanceStore();

  const [showBalance, setShowBalance] = useState(true);

  // Filter transactions for this wallet
  const walletTransactions: Transaction[] = [];

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const monthlyIncome = walletTransactions
    .filter(
      (t) =>
        t.type === "income" && new Date(t.date).getMonth() === currentMonth,
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = walletTransactions
    .filter(
      (t) =>
        t.type === "expense" && new Date(t.date).getMonth() === currentMonth,
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

  const handleDelete = async () => {
    if (wallet) {
      await walletService.delete(wallet.id);

      Toast.show({
        type: "success",
        text1: t("common.success"),
        text2: t("wallets.deletedSuccess"),
      });

      setTimeout(() => {
        navigation.navigate("Wallets");
      }, 1000);
    }
    // alertService.show({
    //   title: t("common.delete"),
    //   message: t("wallets.deleteConfirm"),
    //   buttons: [
    //     { text: t("common.cancel"), style: "cancel" },
    //     {
    //       text: t("common.delete"),
    //       style: "destructive",
    //       onPress: () => {
    //         if (wallet) {
    //           deleteWallet(wallet.id);

    //           Toast.show({
    //             type: "success",
    //             text1: t("common.success"),
    //             text2: t("wallets.deletedSuccess"),
    //           });

    //           setTimeout(() => {
    //             navigation.navigate("Wallets");
    //           }, 1000);
    //         }
    //       },
    //     },
    //   ],
    // });
  };

  const handleMenuAction = () => {
    const options: MenuItem[] = [
      {
        label: t("common.edit"),
        icon: "edit-2",
        iconType: "Feather",
        onPress: () =>
          navigation.navigate("EditWallet", { walletId: wallet.id }),
      },
      {
        label: t("wallets.downloadStatement"),
        icon: "download",
        iconType: "Feather",
        onPress: () =>
          navigation.navigate("WalletStatement", { walletId: wallet.id }),
      },
      {
        label: t("wallets.shareDetails"),
        icon: "share-2",
        iconType: "Feather",
        onPress: () => {
          Toast.show({
            type: "success",
            text1: t("wallets.shareStatement"),
            text2: t("wallets.shareStatementDesc"),
          });
        },
      },
      {
        label: t("common.delete"),
        icon: "trash-2",
        iconType: "Feather",
        variant: "destructive",
        onPress: () => {
          handleDelete();
        },
      },
    ];

    SheetManager.show("menu-sheet", {
      payload: { options, title: wallet.name },
    });
  };

  const TransactionList = ({
    type,
  }: {
    type: "all" | "income" | "expense";
  }) => {
    const filtered = walletTransactions.filter((t) =>
      type === "all" ? true : t.type === type,
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
      <View style={{ gap: theme.margins.sm, paddingBottom: 20 }}>
        {filtered.map((item, index) => (
          <TransactionCard
            key={`${item.id}-${item.type}-${index}`}
            transaction={item}
            category={categories.find((c) => c.name === item.category)}
            onPress={() => {
              const categoryObj = categories.find(
                (c) => c.name === item.category,
              );
              if (categoryObj) {
                navigation.navigate("TransactionDetail", {
                  id: item.id,
                  category: categoryObj,
                });
              }
            }}
          />
        ))}
      </View>
    );
  };

  const routes = [
    { key: "all", title: t("wallets.viewAll") },
    { key: "income", title: t("wallets.income") },
    { key: "expense", title: t("wallets.expense") },
  ];

  if (!wallet || !walletType || !currency) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <ApiLoader isLoading={true} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <SafeArea applyBottomInset style={styles.container} scrollable>
      {/*˝ Header Area */}
      <Header
        applySafeAreaPadding
        title={t("wallets.title")}
        showBack={true}
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={handleMenuAction}>
            <Icon type="Feather" name="more-vertical" size={24} color="white" />
          </Pressable>
        }
      >
        {/* Wallet Card */}
        <Card style={styles.walletCard}>
          <View style={styles.walletInfo}>
            <View
              style={[
                styles.walletIcon,
                { backgroundColor: walletType.color + "20" },
              ]}
            >
              <Icon
                type={walletType.iconFamily as any}
                name={walletType.icon}
                size={28}
                color={walletType.color}
              />
            </View>
            <View>
              <Text weight="semiBold" style={{ fontSize: 18 }}>
                {wallet.name}
              </Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                <Badge variant="secondary">{walletType.label}</Badge>
                <Badge variant="secondary">{currency.code || "USD"}</Badge>
              </View>
            </View>
          </View>

          <View style={{ marginTop: theme.margins.lg }}>
            <Text
              variant="caption"
              style={{ color: theme.colors.mutedForeground }}
            >
              {t("wallets.currentBalance")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <Text weight="bold" style={{ fontSize: 28 }}>
                {showBalance ? `$${wallet.balance.toFixed(2)}` : "****"}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Icon
                  type="Feather"
                  name={showBalance ? "eye-off" : "eye"}
                  size={22}
                  color={theme.colors.mutedForeground}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </Header>

      <View style={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: theme.colors.success + "15" },
              ]}
            >
              <Icon
                type="Feather"
                name="arrow-down-circle"
                size={20}
                color={theme.colors.accentForeground}
              />
            </View>
            <View>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                {t("wallets.income")}
              </Text>
              <Text weight="bold" style={{ color: theme.colors.success }}>
                +${monthlyIncome.toFixed(0)}
              </Text>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: theme.colors.destructive + "15" },
              ]}
            >
              <Icon
                type="Feather"
                name="arrow-up-circle"
                size={20}
                color={theme.colors.accentForeground}
              />
            </View>
            <View>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                {t("wallets.expense")}
              </Text>
              <Text weight="bold" style={{ color: theme.colors.destructive }}>
                -${monthlyExpense.toFixed(0)}
              </Text>
            </View>
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
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: "lightgray",
              pointerStripWidth: 2,
              pointerColor: "lightgray",
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: (items: any) => {
                return (
                  <View
                    style={{
                      height: 90,
                      width: 100,
                      justifyContent: "center",
                      marginTop: -30,
                      marginLeft: -40,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        marginBottom: 6,
                        textAlign: "center",
                      }}
                    >
                      ${items[0].value}
                    </Text>
                  </View>
                );
              },
            }}
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
              navigation.navigate("WalletStatement", { walletId: wallet.id })
            }
          />
          <Button
            title={t("wallets.transfer")}
            icon={
              <Icon type="Feather" name="refresh-cw" size={16} color="white" />
            }
            style={{ flex: 1 }}
            onPress={() => {
              navigation.navigate("Transfer");
            }}
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
    </SafeArea>
  );
};

const enhanceDetail = withObservables(
  ["route"],
  ({ route }: { route: any }) => {
    const walletId = route.params.walletId;
    const walletQuery = database
      .get<Wallet>("wallets")
      .findAndObserve(walletId);

    return {
      wallet: walletQuery,
      walletType: walletQuery.pipe(
        switchMap((wallet) =>
          wallet ? wallet.walletType.observe() : of(null),
        ),
      ),
      currency: walletQuery.pipe(
        switchMap((wallet) => (wallet ? wallet.currency.observe() : of(null))),
      ),
    };
  },
);

export default enhanceDetail(BaseWalletDetailScreen);

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.margins.md,
  },

  walletCard: {
    backgroundColor: theme.colors.card,
    padding: theme.paddings.lg,
    borderRadius: theme.radius.lg,
    marginVertical: theme.margins.lg,
    maxWidth: {
      md: 600,
    },
    alignSelf: {
      md: "center",
    },
    width: "100%",
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
    marginTop: theme.margins.sm,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  statCard: {
    flex: 1,
    padding: theme.paddings.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
}));
