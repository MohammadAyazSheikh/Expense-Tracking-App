import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import * as z from "zod";
import { Text } from "../components/ui/Text";
import { Button, DropDownButton } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { useTranslation } from "../hooks/useTranslation";
import { useAppSettingsStore } from "../store";
import Toast from "react-native-toast-message";
import { CategoryItem } from "../screens/AddExpenseScreen";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useWalletTypeStore, useCurrencyStore } from "@/store";
import { SheetManager } from "react-native-actions-sheet";
import { SafeArea } from "@/components/ui/SafeArea";
import { zodResolver } from "@hookform/resolvers/zod";

const walletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z
    .string()
    .min(1, "Balance is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid balance format"),
  walletType: z.object({
    id: z.string(),
    key: z.string(),
  }),
  currency: z.object({
    id: z.string(),
    code: z.string(),
    decimalPlaces: z.number(),
    isActive: z.boolean(),
    name: z.string(),
    symbol: z.string(),
    type: z.string(),
  }),
  accountNumber: z.string().optional(),
  includeInTotal: z.boolean(),
  isDefault: z.boolean(),
});

type WalletFormValues = z.infer<typeof walletSchema>;

export const AddWalletScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { currency } = useAppSettingsStore();
  const { walletTypes, loadWalletTypes } = useWalletTypeStore();
  const { exchangeRates, loadExchangeRates, getRatesForCurrency } =
    useCurrencyStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: "",
      balance: "",
      walletType: walletTypes[0],
      currency: currency,
      accountNumber: "",
      includeInTotal: true,
      isDefault: false,
    },
  });

  const selectedCurrency = watch("currency");
  const includeInTotal = watch("includeInTotal");
  const isDefault = watch("isDefault");
  const walletKey = watch("walletType");

  const currencyOptions = useMemo(() => {
    // If wallet type is 'crypto', show crypto currencies
    // Otherwise show fiat currencies
    const isCryptoWallet = walletKey?.key === "crypto";

    return getRatesForCurrency()
      .filter((rate) => {
        const isRateCrypto = rate.sourceCurrency.type === "crypto";
        return isCryptoWallet ? isRateCrypto : !isRateCrypto;
      })
      .sort((a, b) =>
        a.sourceCurrency.code.localeCompare(b.sourceCurrency.code),
      )
      .map((rate) => ({
        label: `${rate.sourceCurrency.name}`,
        value: rate.sourceCurrency.id,
        rightIcon: (
          <Text variant="h3">{`1 ${rate.sourceCurrency.code} = ${rate.rate.toPrecision(3)} ${rate.targetCurrency.code}`}</Text>
        ),
        originalItem: rate.sourceCurrency,
      }));
  }, [exchangeRates, walletKey]);

  const onSubmit = (data: WalletFormValues) => {
    setTimeout(() => {
      navigation.goBack();
    }, 1000);

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: t("wallets.addedSuccess"),
    });
  };

  const handleSelectCurrency = async () => {
    const result = await SheetManager.show("select-sheet", {
      payload: {
        selectedValue: selectedCurrency?.id,
        options: currencyOptions,
        title: "Select Currency",
      },
    });

    if (result) setValue("currency", result?.originalItem);
  };

  useEffect(() => {
    loadWalletTypes();
    loadExchangeRates();
  }, []);

  return (
    <SafeArea applyBottomInset scrollable>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Wallet Type Grid */}
        <Text weight="semiBold" style={{ marginBottom: theme.margins.sm }}>
          {t("wallets.selectType")}
        </Text>
        <View style={styles.typeGrid}>
          {walletTypes.map((item) => (
            <CategoryItem
              key={`${item.id}-${item.label}`}
              item={{
                name: t(`wallets.types.${item.key}` as any, item.key),
                color: item.color,
                icon: item.icon,
                iconFamily: item.iconFamily as any,
              }}
              isSelected={walletKey?.key === item.key}
              onPress={() =>
                setValue("walletType", {
                  id: item.id,
                  key: item.key,
                })
              }
            />
          ))}
        </View>
        {errors.walletType?.key && (
          <Text style={{ color: theme.colors.destructive }}>
            {errors.walletType?.key.message}
          </Text>
        )}

        {/* Basic Info */}
        <Card style={styles.formCard}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("wallets.name")}
                placeholder="e.g. Main Account"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange, value } }) => (
              <DropDownButton
                label={t("wallets.currency")}
                selectedValue={value?.name}
                onPress={handleSelectCurrency}
                error={errors.currency?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="balance"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("wallets.initialBalance")}
                placeholder="0.00"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.balance?.message}
                leftIcon={
                  <Text weight="bold" style={{ marginRight: 4 }}>
                    {selectedCurrency?.code || "$"}
                  </Text>
                }
              />
            )}
          />

          {(walletKey?.key === "bank" || walletKey?.key === "card") && (
            <Controller
              control={control}
              name="accountNumber"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={t("wallets.accountNumber")}
                  placeholder="**** **** **** 1234"
                  value={value ?? ""}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                />
              )}
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
            <Switch
              value={includeInTotal}
              onValueChange={(val) => setValue("includeInTotal", val)}
            />
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
            <Switch
              value={isDefault}
              onValueChange={(val) => setValue("isDefault", val)}
            />
          </View>
        </Card>

        <Button title={t("common.save")} onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </SafeArea>
  );
};

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    gap: theme.margins.lg,
    padding: theme.paddings.md,
    paddingTop: theme.margins.lg,
    paddingBottom: theme.margins.xl,
  },
  typeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.margins.md,
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
  footer: {
    padding: theme.paddings.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}));
