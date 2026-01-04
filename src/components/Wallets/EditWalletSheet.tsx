import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
  useSheetPayload,
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

const walletTypes = [
  { id: "cash", icon: "wallet", label: "Cash", color: "#2E7D32" },
  { id: "bank", icon: "bank", label: "Bank", color: "#1565C0" },
  { id: "card", icon: "credit-card", label: "Card", color: "#6A1B9A" },
  { id: "digital", icon: "smartphone", label: "Digital", color: "#0277BD" },
  { id: "crypto", icon: "bitcoin", label: "Crypto", color: "#F57F17" },
  { id: "savings", icon: "piggy-bank", label: "Savings", color: "#C62828" },
];

export const EditWalletSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { updateWallet, deleteWallet, wallets } = useFinanceStore();
  const payload = useSheetPayload("edit-wallet-sheet");
  const walletId = payload?.walletId;

  const [name, setName] = useState("");
  const [type, setType] = useState("cash");
  const [accountNumber, setAccountNumber] = useState("");
  const [includeInTotal, setIncludeInTotal] = useState(true);
  const [isDefault, setIsDefault] = useState(false);

  const wallet = wallets.find((w) => w.id === walletId);

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setType(wallet.type.toLowerCase());
      setAccountNumber(wallet.accountNumber || "");
      setIncludeInTotal(wallet.includeInTotal ?? true);
      setIsDefault(wallet.isDefault ?? false);
    }
  }, [wallet]);

  const handleSave = () => {
    if (!wallet) return;
    if (!name) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("wallets.fillRequired"),
      });
      return;
    }

    const selectedType = walletTypes.find((t) => t.id === type);

    updateWallet(wallet.id, {
      name,
      type,
      color: selectedType?.color || wallet.color,
      icon: selectedType?.icon || wallet.icon || "wallet",
      accountNumber,
      includeInTotal,
      isDefault,
    });

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: t("wallets.updatedSuccess"),
    });

    SheetManager.hide("edit-wallet-sheet");
  };

  const handleDelete = () => {
    Alert.alert(t("common.delete"), t("wallets.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          if (wallet) {
            deleteWallet(wallet.id);
            SheetManager.hide("edit-wallet-sheet");
            Toast.show({
              type: "success",
              text1: t("common.success"),
              text2: t("wallets.deletedSuccess"),
            });
          }
        },
      },
    ]);
  };

  if (!wallet) return null;

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      gestureEnabled={true}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => SheetManager.hide("edit-wallet-sheet")}
        >
          <Text style={styles.cancelButton}>{t("common.cancel")}</Text>
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>
          {t("wallets.editWallet")}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>{t("common.save")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Balance Card Read Only */}
        <Card style={styles.balanceCard}>
          <Text style={{ color: "white", opacity: 0.8 }}>
            {t("wallets.currentBalance")}
          </Text>
          <Text variant="h1" style={{ color: "white", marginVertical: 8 }}>
            ${wallet.balance.toFixed(2)}
          </Text>
          <Button
            title={t("wallets.adjustBalance")}
            variant="secondary"
            size="sm"
            style={{
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
            textStyle={{ color: "white" }}
            onPress={() => {
              // Placeholder for balance adjustment
              Toast.show({
                type: "info",
                text1: t("wallets.comingSoon"),
                text2: t("wallets.balanceAdjustmentFeature"),
              });
            }}
          />
        </Card>

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

        <Button
          title={t("wallets.deleteWallet")}
          variant="ghost"
          style={{ marginTop: theme.margins.md }}
          textStyle={{ color: theme.colors.destructive }}
          icon={
            <Icon
              type="Feather"
              name="trash-2"
              size={18}
              color={theme.colors.destructive}
            />
          }
          onPress={handleDelete}
        />
      </ScrollView>
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
  saveButton: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
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
}));
