import React from "react";
import { View, TouchableOpacity } from "react-native";
import ActionSheet, {
  SheetProps,
  ScrollView,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Card } from "../ui/Card";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store";
import { Wallet } from "../../types";

type WalletSelectorPayload = {
  excludeId?: string;
  // onSelect: (walletId: string) => void;
  title?: string;
};

export const WalletSelectorSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { wallets } = useFinanceStore();
  const payload = useSheetPayload(
    "wallet-selector-sheet"
  ) as WalletSelectorPayload;

  const availableWallets = wallets.filter((w) => w.id !== payload?.excludeId);

  const handleSelect = (walletId: string) => {
    // if (payload?.onSelect) {
    //   payload.onSelect(walletId);
    // }
    SheetManager.hide(props.sheetId, { payload: walletId });
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
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Placeholder for center alignment */}
          <Text variant="h3" style={styles.title}>
            {payload?.title || t("wallets.selectWallet")}
          </Text>
          <TouchableOpacity onPress={() => SheetManager.hide(props.sheetId)}>
            <Icon
              name="x"
              type="Feather"
              size={24}
              color={theme.colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={{ gap: theme.margins.md }}>
            {availableWallets.map((wallet) => (
              <Card
                key={wallet.id}
                style={styles.walletCard}
                onPress={() => {
                  handleSelect(wallet.id);
                }}
              >
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
            ))}
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingBottom: theme.paddings.xl,
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
  content: {
    padding: theme.paddings.md,
  },
  walletCard: {
    padding: theme.paddings.md,
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
}));
