import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import ActionSheet, {
  Route,
  SheetProps,
  ScrollView,
  SheetManager,
  useSheetPayload,
  RouteScreenProps,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Switch } from "../ui/Switch";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store";
import Toast from "react-native-toast-message";
import { Wallet } from "../../types";

const quickAmounts = [50, 100, 200, 500];

// Wallet Selector Screen
const WalletSelectorScreen = ({
  params,
  router,
}: RouteScreenProps<"transfer-sheet", "wallet-selector">) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { wallets } = useFinanceStore();
  const { mode, excludeId } = params;

  const availableWallets = wallets.filter((w) => w.id !== excludeId);

  const handleSelect = (walletId: string) => {
    router.navigate("main", {
      payload: {
        selectedWalletId: walletId,
        mode,
      },
    });
  };

  const getWalletIcon = (wallet: Wallet) => {
    if (wallet.icon) return wallet.icon;
    const iconMap: Record<string, string> = {
      cash: "wallet",
      bank: "bank",
      card: "credit-card",
      digital: "smartphone",
      crypto: "bitcoin",
      savings: "piggy-bank",
    };
    return iconMap[wallet.type.toLowerCase()] || "wallet";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate("main")}>
          <Icon
            type="Feather"
            name="arrow-left"
            size={24}
            color={theme.colors.foreground}
          />
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>
          {t("wallets.selectWallet")}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ gap: theme.margins.md }}>
          {availableWallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.id}
              activeOpacity={0.7}
              onPress={() => handleSelect(wallet.id)}
            >
              <Card style={styles.walletCard}>
                <View style={styles.walletInfo}>
                  <View
                    style={[
                      styles.walletIcon,
                      {
                        backgroundColor:
                          (wallet.color || theme.colors.primary) + "20",
                      },
                    ]}
                  >
                    <Icon
                      type="MaterialCommunityIcons"
                      name={getWalletIcon(wallet) as any}
                      size={24}
                      color={wallet.color || theme.colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text weight="semiBold">{wallet.name}</Text>
                    <Text
                      variant="caption"
                      style={{ color: theme.colors.mutedForeground }}
                    >
                      ${wallet.balance.toFixed(2)}
                    </Text>
                  </View>
                  <Icon
                    type="Feather"
                    name="chevron-right"
                    size={20}
                    color={theme.colors.mutedForeground}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Main Transfer Screen
const TransferMainScreen = ({
  params,
  router,
}: RouteScreenProps<"transfer-sheet", "main">) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { wallets } = useFinanceStore();

  const [fromWalletId, setFromWalletId] = useState<string | null>(null);
  const [toWalletId, setToWalletId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (params?.selectedWalletId && params?.mode) {
      if (params.mode === "from") {
        setFromWalletId(params.selectedWalletId);
      } else {
        setToWalletId(params.selectedWalletId);
      }
    }
  }, [params]);

  const fromWallet = wallets.find((w) => w.id === fromWalletId);
  const toWallet = wallets.find((w) => w.id === toWalletId);

  const handleSwap = () => {
    const temp = fromWalletId;
    setFromWalletId(toWalletId);
    setToWalletId(temp);
  };

  const handleTransfer = () => {
    if (!fromWalletId || !toWalletId) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("wallets.selectBothWallets"),
      });
      return;
    }

    if (fromWalletId === toWalletId) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("wallets.sameWalletError"),
      });
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("wallets.enterValidAmount"),
      });
      return;
    }

    if (fromWallet && transferAmount > fromWallet.balance) {
      Toast.show({
        type: "error",
        text1: t("wallets.insufficientBalance"),
        text2: `${t("wallets.available")}: $${fromWallet.balance.toFixed(2)}`,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: `$${transferAmount.toFixed(2)} ${t("wallets.transferred")}`,
    });

    SheetManager.hide("transfer-sheet");
  };

  const WalletSelectorCard = ({
    label,
    wallet,
    onPress,
  }: {
    label: string;
    wallet?: Wallet;
    onPress: () => void;
  }) => (
    <Card style={styles.selectorCard} onPress={onPress}>
      <Text variant="caption" style={styles.selectorLabel}>
        {label}
      </Text>
      {wallet ? (
        <View style={styles.walletRow}>
          <View style={styles.walletInfo}>
            <View
              style={[
                styles.walletIconSmall,
                {
                  backgroundColor:
                    (wallet.color || theme.colors.primary) + "20",
                },
              ]}
            >
              <Icon
                type="Ionicons"
                name="wallet"
                size={20}
                color={wallet.color || theme.colors.primary}
              />
            </View>
            <View>
              <Text weight="medium">{wallet.name}</Text>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                {t("wallets.balance")}: ${wallet.balance.toFixed(2)}
              </Text>
            </View>
          </View>
          <Icon
            type="Feather"
            name="chevron-right"
            size={20}
            color={theme.colors.mutedForeground}
          />
        </View>
      ) : (
        <View style={styles.walletRow}>
          <Text style={{ color: theme.colors.mutedForeground }}>
            {t("wallets.selectWallet")}
          </Text>
          <Icon
            type="Feather"
            name="chevron-right"
            size={20}
            color={theme.colors.mutedForeground}
          />
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => SheetManager.hide("transfer-sheet")}>
          <Text style={styles.cancelButton}>{t("common.cancel")}</Text>
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>
          {t("wallets.transferMoney")}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* From/To Wallets */}
        <View style={styles.transferSection}>
          <WalletSelectorCard
            label={t("wallets.from")}
            wallet={fromWallet}
            onPress={() =>
              router.navigate("wallet-selector", {
                payload: { mode: "from", excludeId: toWalletId },
              })
            }
          />

          <View style={styles.swapButtonContainer}>
            <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
              <Icon
                type="Ionicons"
                name="swap-vertical"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          <WalletSelectorCard
            label={t("wallets.to")}
            wallet={toWallet}
            onPress={() =>
              router.navigate("wallet-selector", {
                payload: { mode: "to", excludeId: fromWalletId },
              })
            }
          />
        </View>

        {/* Amount */}
        <Card style={styles.amountCard}>
          <Text weight="semiBold" style={styles.label}>
            {t("wallets.amount")}
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Input
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.amountInput}
            />
          </View>
          {fromWallet && (
            <Text variant="caption" style={styles.availableText}>
              {t("wallets.available")}: ${fromWallet.balance.toFixed(2)}
            </Text>
          )}
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountGrid}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={styles.quickAmountBtn}
                onPress={() => setAmount(value.toString())}
              >
                <Text style={styles.quickAmountText}>${value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Note */}
        <Input
          label={t("wallets.note")}
          placeholder={t("wallets.noteHint")}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        {/* Recurring Transfer */}
        <Card style={styles.recurringCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text weight="medium">{t("wallets.recurringTransfer")}</Text>
              <Text variant="caption" style={styles.settingDesc}>
                {t("wallets.recurringDesc")}
              </Text>
            </View>
            <Switch value={isRecurring} onValueChange={setIsRecurring} />
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t("wallets.transfer")}
          onPress={handleTransfer}
          disabled={!fromWalletId || !toWalletId || !amount}
          icon={
            <Icon
              type="Ionicons"
              name="swap-vertical"
              size={20}
              color="white"
            />
          }
        />
      </View>
    </View>
  );
};

const routes: Route[] = [
  {
    name: "main",
    component: TransferMainScreen,
  },
  {
    name: "wallet-selector",
    component: WalletSelectorScreen,
  },
];

export const TransferSheet = (props: SheetProps) => {
  return (
    <ActionSheet
      routes={routes}
      initialRoute="main"
      enableRouterBackNavigation={true}
      keyboardHandlerEnabled={true}
      gestureEnabled={true}
      containerStyle={{
        height: "85%", // Ensure height is set here for keyboard handling
      }}
    />
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    height: (rt.screen.height / 100) * 85,
    backgroundColor: theme.colors.background,
    borderTopEndRadius: theme.radius.xl,
    borderTopStartRadius: theme.radius.xl,
    paddingBottom: theme.paddings.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.paddings.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    color: theme.colors.foreground,
  },
  cancelButton: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.md,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
    paddingBottom: 40,
  },
  transferSection: {
    position: "relative",
  },
  selectorCard: {
    padding: theme.paddings.md,
  },
  selectorLabel: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.sm,
  },
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    flex: 1,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  walletIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  swapButtonContainer: {
    alignItems: "center",
    marginVertical: -theme.margins.md,
    zIndex: 10,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountCard: {
    padding: theme.paddings.lg,
  },
  label: {
    fontSize: theme.fontSize.md,
    marginBottom: theme.margins.md,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.margins.sm,
    marginBottom: theme.margins.sm,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme.colors.mutedForeground,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  availableText: {
    textAlign: "center",
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.md,
  },
  quickAmountGrid: {
    flexDirection: "row",
    gap: theme.margins.sm,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: theme.paddings.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  quickAmountText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  recurringCard: {
    padding: theme.paddings.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.margins.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingDesc: {
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  footer: {
    padding: theme.paddings.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  walletCard: {
    padding: theme.paddings.md,
  },
}));
