import React, { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import Fab from "@/components/ui/Fab";
import { LegendList } from "@legendapp/list";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Feather } from "@expo/vector-icons";
import { Icon } from "../components/ui/Icon";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Header } from "../components/ui/Headers";
import { SafeArea } from "@/components/ui/SafeArea";
import { storeWallet, useWalletStore } from "@/store/walletStore";

const recentTransfers = [
  { from: "Chase Checking", to: "Cash", amount: 200, date: "Today" },
  { from: "PayPal", to: "Chase Checking", amount: 150, date: "Yesterday" },
];

type walletCardProps = {
  data: storeWallet;
  onPress?: () => void;
  onLongPress?: () => void;
};

const WalletCard = ({ data, onPress, onLongPress }: walletCardProps) => {
  const { wallet, walletType } = data;

  return (
    <Card onPress={onPress} onLongPress={onLongPress} style={styles.walletCard}>
      <View style={styles.walletInfo}>
        <View
          style={[
            styles.walletIcon,
            { backgroundColor: walletType.color + "20" },
          ]}
        >
          <Icon
            type={walletType.iconFamily as any}
            name={walletType.icon as any}
            size={24}
            color={walletType.color}
          />
        </View>
        <View>
          <Text weight="semiBold">{wallet.name}</Text>
          {wallet.accountNumber && (
            <Text variant="caption">{wallet.accountNumber}</Text>
          )}
          <Badge
            variant="secondary"
            style={{ marginTop: 4 }}
            textStyle={{ textTransform: "capitalize" }}
          >
            {walletType.label}
          </Badge>
        </View>
      </View>
      <Text weight="bold" style={{ fontSize: 14 }}>
        {`${data.currency.code} ${wallet.balance.toFixed(2)}`}
      </Text>
    </Card>
  );
};

const AccountStateCard = ({
  title,
  value,
  type,
}: {
  title: string;
  value: string;
  type: "expenses" | "income";
}) => {
  styles.useVariants({ type });
  return (
    <Card style={styles.statCard}>
      <Text variant="caption" style={{ marginBottom: 4 }}>
        {title}
      </Text>
      <Text weight="bold" style={styles.statValue}>
        {value}
      </Text>
      <Text variant="caption">
        {type == "expenses" ? "Expenses" : "Income"}
      </Text>
    </Card>
  );
};

const RecentTransferCard = ({
  transfer,
}: {
  transfer: {
    from: string;
    to: string;
    amount: number;
    date: string;
  };
}) => {
  const { theme } = useUnistyles();
  return (
    <Card style={styles.transferItem}>
      <View style={styles.transferInfo}>
        <View style={styles.transferIcon}>
          <Feather
            name="refresh-cw"
            size={16}
            color={theme.colors.mutedForeground}
          />
        </View>
        <View>
          <Text weight="medium">{transfer.from}</Text>
          <Text variant="caption">to {transfer.to}</Text>
          <Text variant="caption">{transfer.date}</Text>
        </View>
      </View>
      <Text weight="semiBold">${transfer.amount}</Text>
    </Card>
  );
};

export const WalletsScreen = () => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { wallets: data, loadWallets } = useWalletStore();

  const totalBalance = useMemo(
    () => data.reduce((sum, wallet) => sum + wallet.wallet.balance, 0),
    [data],
  );

  const renderItems = useCallback(({ item }: { item: storeWallet }) => {
    return (
      <WalletCard
        data={item}
        onPress={() =>
          navigation.navigate("WalletDetail", {
            data: item,
          })
        }
        onLongPress={() =>
          navigation.navigate("EditWallet", {
            walletId: item.wallet.id,
          })
        }
      />
    );
  }, []);

  useEffect(() => {
    loadWallets();
  }, []);
  return (
    <SafeArea applyBottomInset style={styles.container}>
      <LegendList
        data={data}
        recycleItems
        renderItem={renderItems}
        keyExtractor={(item) => item.wallet.id}
        contentContainerStyle={{ paddingBottom: theme.paddings.xl }}
        showsVerticalScrollIndicator={false}
        ListFooterComponentStyle={{
          paddingHorizontal: theme.paddings.md,
          paddingBottom: theme.paddings.xl,
        }}
        ListHeaderComponentStyle={{
          marginBottom: theme.margins.md,
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: theme.margins.md }} />
        )}
        ListHeaderComponent={() => (
          <Header
            applySafeAreaPadding
            title="Wallets & Accounts"
            showBack={true}
            onBack={() => navigation.goBack()}
          >
            <View style={styles.balanceCard}>
              <Text variant="caption" style={styles.balanceLabel}>
                Total Balance
              </Text>
              <Text style={styles.balanceValue} weight="bold">
                ${totalBalance.toFixed(2)}
              </Text>
              <Badge
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderWidth: 0,
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  {data.length} Accounts
                </Text>
              </Badge>
            </View>
          </Header>
        )}
        ListFooterComponent={() => (
          <View>
            {/* Transfer Button */}
            <Button
              title={t("wallets.transfer")}
              icon={<Feather name="refresh-cw" size={20} color="white" />}
              size="lg"
              style={styles.transferButton}
              onPress={() => navigation.navigate("Transfer")}
            />

            {/* Recent Transfers */}
            <View>
              <Text variant="h3" style={{ marginBottom: theme.margins.sm }}>
                Recent Transfers
              </Text>
              <View style={{ gap: theme.margins.sm }}>
                {recentTransfers.map((transfer, index) => (
                  <RecentTransferCard
                    key={`${transfer.from}-${transfer.to}-${index}`}
                    transfer={transfer}
                  />
                ))}
              </View>
            </View>

            {/* Account Stats */}
            <View style={styles.statsGrid}>
              <AccountStateCard
                title="This Month"
                value="+$1,240"
                type="income"
              />
              <AccountStateCard
                title="This Month"
                value="-$890"
                type="expenses"
              />
            </View>
          </View>
        )}
      />
      <Fab onPress={() => navigation.navigate("AddWallet")} />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.margins.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  headerTitle: {
    color: "white",
  },
  balanceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  balanceValue: {
    color: "white",
    fontSize: 32,
    marginBottom: theme.margins.md,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.paddings.lg,
    marginHorizontal: theme.margins.md,
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  transferButton: {
    marginVertical: theme.margins.md,
  },
  transferItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.paddings.md,
  },
  transferInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  transferIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.margins.md,
    marginTop: theme.margins.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: theme.paddings.md,
  },

  statValue: {
    fontSize: 20,
    color: theme.colors.accent,
    marginBottom: 4,
    variants: {
      type: {
        income: {
          color: theme.colors.success,
        },
        expenses: {
          color: theme.colors.accent,
        },
      },
    },
  },
}));
