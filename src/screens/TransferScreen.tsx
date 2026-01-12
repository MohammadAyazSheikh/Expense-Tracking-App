import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { SheetManager } from "react-native-actions-sheet";
import { Calendar } from "react-native-calendars";
import Toast from "react-native-toast-message";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Text } from "../components/ui/Text";
import { Button, DropDownButton } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { Icon } from "../components/ui/Icon";
import { Header } from "../components/ui/Headers";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import ModalWrapper from "../components/ui/ModalWrapper";

import { useTranslation } from "../hooks/useTranslation";
import { useFinanceStore } from "../store";
import { Wallet } from "../types";

const quickAmounts = [50, 100, 200, 500];

export const TransferScreen = () => {
  const rotate = useSharedValue(0);
  const navigation = useNavigation();
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { wallets } = useFinanceStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fromWalletId: "",
      toWalletId: "",
      amount: "",
      note: "",
      date: new Date().toISOString().split("T")[0],
      isRecurring: false,
      recurringFrequency: "monthly",
    },
  });

  const fromWalletId = watch("fromWalletId");
  const toWalletId = watch("toWalletId");
  const amount = watch("amount");
  const date = watch("date");
  const isRecurring = watch("isRecurring");

  const fromWallet = wallets.find((w) => w.id === fromWalletId);
  const toWallet = wallets.find((w) => w.id === toWalletId);

  const swapButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: rotate.value + "deg" }],
    };
  });
  const handleSwap = () => {
    setValue("fromWalletId", toWalletId);
    setValue("toWalletId", fromWalletId);
    rotate.value = withTiming(rotate.value + 180);
  };

  const openWalletSelector = async (mode: "from" | "to") => {
    const excludeId = mode === "from" ? toWalletId : fromWalletId;
    const result = await SheetManager.show("wallet-selector-sheet", {
      payload: {
        excludeId,
        title: mode === "from" ? t("wallets.from") : t("wallets.to"),
      },
    });
    if (result) {
      setValue(mode === "from" ? "fromWalletId" : "toWalletId", result);
    }
  };

  const onSubmit = (data: any) => {
    if (!data.fromWalletId || !data.toWalletId) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("wallets.selectBothWallets"),
      });
      return;
    }

    if (data.fromWalletId === data.toWalletId) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("wallets.sameWalletError"),
      });
      return;
    }

    const transferAmount = parseFloat(data.amount);
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

    // Here we would typically dispatch a transfer action to the store
    // For now, mocking the success toast
    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: `$${transferAmount.toFixed(2)} ${t("wallets.transferred")}`,
    });

    navigation.goBack();
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
                type="MaterialCommunityIcons"
                name={(wallet.icon as any) || "wallet"}
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
  const openDateSheet = async () => {
    const result = await SheetManager.show("date-picker-sheet", {
      payload: { date: date },
    });
    if (result) {
      setValue("date", result);
    }
  };
  return (
    <ScreenWrapper style={styles.container}>
      <Header
        title={t("wallets.transferMoney")}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* From/To Wallets */}
        <View style={styles.transferSection}>
          <WalletSelectorCard
            label={t("wallets.from")}
            wallet={fromWallet}
            onPress={() => openWalletSelector("from")}
          />

          <Animated.View style={[styles.swapButtonContainer, swapButtonStyle]}>
            <Pressable style={styles.swapButton} onPress={handleSwap}>
              <Icon
                type="Ionicons"
                name="swap-vertical"
                size={20}
                color={theme.colors.background}
              />
            </Pressable>
          </Animated.View>

          <WalletSelectorCard
            label={t("wallets.to")}
            wallet={toWallet}
            onPress={() => openWalletSelector("to")}
          />
        </View>

        {/* Amount */}
        <Card style={styles.amountCard}>
          <Text weight="semiBold" style={styles.label}>
            {t("wallets.amount")}
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  style={styles.amountInput}
                  containerStyle={{ borderWidth: 0 }}
                />
              )}
            />
          </View>
          {fromWallet && (
            <Text variant="caption" style={styles.availableText}>
              {t("wallets.available")}: ${fromWallet.balance.toFixed(2)}
            </Text>
          )}
          <View style={styles.quickAmountGrid}>
            {quickAmounts.map((val) => (
              <TouchableOpacity
                key={val}
                style={styles.quickAmountBtn}
                onPress={() => setValue("amount", val.toString())}
              >
                <Text style={styles.quickAmountText}>${val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Date */}
        <Card style={styles.dateCard} onPress={openDateSheet}>
          <DropDownButton
            leftIcon={
              <Icon
                type="Feather"
                name="calendar"
                size={20}
                color={theme.colors.mutedForeground}
              />
            }
            label="Date"
            selectedValue={date}
            onPress={openDateSheet}
          />
        </Card>

        {/* Note */}
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <Input
              style={{ minHeight: 70 }}
              label={t("wallets.note")}
              placeholder={t("wallets.noteHint")}
              value={value}
              onChangeText={onChange}
              multiline
            />
          )}
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
            <Controller
              control={control}
              name="isRecurring"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>
          {isRecurring && (
            <View style={{ marginTop: theme.margins.md }}>
              <Text
                variant="caption"
                style={{
                  marginBottom: theme.margins.xs,
                  color: theme.colors.mutedForeground,
                }}
              >
                Frequency
              </Text>
              <Controller
                control={control}
                name="recurringFrequency"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    onPress={async () => {
                      const result = await SheetManager.show("select-sheet", {
                        payload: {
                          options: [
                            { label: "Daily", value: "daily" },
                            { label: "Weekly", value: "weekly" },
                            { label: "Bi-Weekly", value: "biweekly" },
                            { label: "Monthly", value: "monthly" },
                          ],
                          title: "Select Frequency",
                          selectedValue: value,
                          onSelect: (val) => onChange(val),
                        },
                      });
                      // Fallback if result is returned directly
                      if (result) {
                        onChange(result);
                      }
                    }}
                  >
                    <View style={styles.frequencySelector}>
                      <Text style={{ textTransform: "capitalize" }}>
                        {value}
                      </Text>
                      <Icon
                        type="Feather"
                        name="chevron-down"
                        size={20}
                        color={theme.colors.mutedForeground}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </Card>

        <Button
          title={t("wallets.transfer")}
          onPress={handleSubmit(onSubmit)}
          disabled={!fromWalletId || !toWalletId || !amount}
          style={{ marginTop: theme.margins.lg }}
          icon={
            <Icon
              type="Ionicons"
              name="swap-vertical"
              size={20}
              color="white"
            />
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
    paddingBottom: theme.paddings.xl,
  },
  transferSection: {
    position: "relative",
    marginVertical: theme.margins.sm,
  },
  selectorCard: {
    padding: theme.paddings.md,
  },
  frequencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.paddings.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
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
    backgroundColor: theme.colors.success,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
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
    paddingVertical: 0,
    height: 50,
    minWidth: 70,
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
  dateCard: {
    padding: theme.paddings.md,
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
}));
