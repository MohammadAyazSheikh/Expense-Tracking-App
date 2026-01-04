import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Switch } from "../ui/Switch";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store";
import Toast from "react-native-toast-message";

const walletTypes = [
  { id: "cash", icon: "wallet", label: "Cash", color: "#2E7D32" },
  { id: "bank", icon: "bank", label: "Bank", color: "#1565C0" },
  { id: "card", icon: "credit-card", label: "Card", color: "#6A1B9A" },
  { id: "digital", icon: "smartphone", label: "Digital", color: "#0277BD" },
  { id: "crypto", icon: "bitcoin", label: "Crypto", color: "#F57F17" },
  { id: "savings", icon: "piggy-bank", label: "Savings", color: "#C62828" },
];

const currencies = ["USD", "EUR", "GBP", "PKR", "INR", "AED"];

export const AddWalletSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { addWallet } = useFinanceStore();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("cash");
  const [currency, setCurrency] = useState("USD");
  const [accountNumber, setAccountNumber] = useState("");
  const [includeInTotal, setIncludeInTotal] = useState(true);
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    if (!name || !balance) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("wallets.fillRequired"),
      });
      return;
    }

    const selectedType = walletTypes.find((t) => t.id === type);

    addWallet({
      name,
      balance: parseFloat(balance),
      type,
      color: selectedType?.color || theme.colors.primary,
      icon: selectedType?.icon || "wallet",
      accountNumber,
      currency,
      includeInTotal,
      isDefault,
    });

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: t("wallets.addedSuccess"),
    });

    SheetManager.hide("add-wallet-sheet");
  };

  const handleReset = () => {
    setName("");
    setBalance("");
    setType("cash");
    setAccountNumber("");
    setIncludeInTotal(true);
    setIsDefault(false);
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      gestureEnabled={true}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => SheetManager.hide("add-wallet-sheet")}>
          <Text style={styles.cancelButton}>{t("common.cancel")}</Text>
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>
          {t("wallets.addWallet")}
        </Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButton}>{t("common.reset")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Wallet Type Grid */}
        <Text weight="semiBold" style={{ marginBottom: theme.margins.sm }}>
          {t("wallets.selectType")}
        </Text>
        <View style={styles.typeGrid}>
          {walletTypes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.typeCard,
                type === item.id && {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primary + "10",
                },
              ]}
              onPress={() => setType(item.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.color + "20" },
                ]}
              >
                <Icon
                  type="MaterialCommunityIcons"
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <Text variant="caption" style={{ marginTop: 4 }}>
                {t(`wallets.types.${item.id}` as any)}
              </Text>
              {type === item.id && (
                <View style={styles.checkBadge}>
                  <Icon type="Feather" name="check" size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Basic Info */}
        <Card style={styles.formCard}>
          <Input
            label={t("wallets.name")}
            placeholder="e.g. Main Account"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input
                label={t("wallets.initialBalance")}
                placeholder="0.00"
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
                leftIcon={
                  <Text weight="bold" style={{ marginRight: 4 }}>
                    {currencies.find((c) => c === currency)
                      ? currency === "USD"
                        ? "$"
                        : currency === "EUR"
                        ? "€"
                        : currency === "GBP"
                        ? "£"
                        : currency
                      : "$"}
                  </Text>
                }
              />
            </View>
            <View style={{ width: 100 }}>
              {/* Simplified currency selector for now */}
              <Text style={styles.label}>{t("wallets.currency")}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {currencies.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCurrency(c)}
                    style={[
                      styles.currencyChip,
                      currency === c && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          currency === c ? "white" : theme.colors.foreground,
                        fontSize: 12,
                      }}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {(type === "bank" || type === "card") && (
            <Input
              label={t("wallets.accountNumber")}
              placeholder="**** **** **** 1234"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="number-pad"
            />
          )}
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text weight="medium">{t("wallets.includeInTotal")}</Text>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                {t("wallets.includeDesc")}
              </Text>
            </View>
            <Switch value={includeInTotal} onValueChange={setIncludeInTotal} />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View>
              <Text weight="medium">{t("wallets.setAsDefault")}</Text>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                {t("wallets.defaultDesc")}
              </Text>
            </View>
            <Switch value={isDefault} onValueChange={setIsDefault} />
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t("common.save")} onPress={handleSave} />
      </View>
    </ActionSheet>
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
  resetButton: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
    paddingBottom: 40,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.md,
  },
  typeCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    position: "relative",
    overflow: "hidden",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: {
    padding: theme.paddings.md,
    gap: theme.margins.md,
  },
  row: {
    flexDirection: "row",
    gap: theme.margins.md,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: theme.colors.foreground,
  },
  currencyChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 36,
    alignItems: "center",
  },
  settingsCard: {
    padding: theme.paddings.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.paddings.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.margins.sm,
  },
  footer: {
    padding: theme.paddings.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}));
