import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, ScrollView } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Text } from "../components/ui/Text";
import { Button, DropDownButton } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { useTranslation } from "../hooks/useTranslation";
import Toast from "react-native-toast-message";
import { CategoryItem } from "../screens/AddExpenseScreen";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon } from "../components/ui/Icon";
import { alertService } from "../utils/alertService";
import { styles } from "./AddWalletScreen";
import { useWalletStore, useWalletTypeStore, useCurrencyStore } from "@/store";
import { SheetManager } from "react-native-actions-sheet";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeArea } from "@/components/ui/SafeArea";

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

export const EditWalletScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    params: { walletId },
  } = useRoute<RouteProp<RootStackParamList, "EditWallet">>();

  const { getWalletById, deleteWallet, updateWallet } = useWalletStore();
  const wallet = getWalletById(walletId);

  const { walletTypes, loadWalletTypes } = useWalletTypeStore();
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { loadExchangeRates, getRatesForCurrency } = useCurrencyStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: "",
      balance: "",
      walletType: walletTypes[0],
      currency: {
        id: "",
        code: "USD",
        decimalPlaces: 2,
        isActive: true,
        name: "US Dollar",
        symbol: "$",
        type: "fiat",
      },
      accountNumber: "",
      includeInTotal: true,
      isDefault: false,
    },
  });

  const selectedCurrency = watch("currency");
  const includeInTotal = watch("includeInTotal");
  const isDefault = watch("isDefault");
  const walletKey = watch("walletType");

  const { cryptoRates, fiatRates } = useMemo(() => {
    return getRatesForCurrency();
  }, []);

  useEffect(() => {
    loadWalletTypes();
    loadExchangeRates();
  }, []);

  useEffect(() => {
    if (wallet && walletTypes.length > 0) {
      // storeWallet has nested wallet, currency, and walletType objects
      const matchingWalletType = wallet.walletType;
      const matchingCurrency = wallet.currency;

      reset({
        name: wallet.wallet.name,
        balance: wallet.wallet.balance.toString(),
        walletType: matchingWalletType
          ? {
              id: matchingWalletType.id,
              key: matchingWalletType.key,
            }
          : walletTypes[0],
        currency: matchingCurrency
          ? {
              id: matchingCurrency.id,
              code: matchingCurrency.code,
              decimalPlaces: matchingCurrency.decimalPlaces,
              isActive: matchingCurrency.isActive,
              name: matchingCurrency.name,
              symbol: matchingCurrency.symbol,
              type: matchingCurrency.type,
            }
          : {
              id: "",
              code: "USD",
              decimalPlaces: 2,
              isActive: true,
              name: "US Dollar",
              symbol: "$",
              type: "fiat",
            },
        accountNumber: wallet.wallet.accountNumber || "",
        includeInTotal: wallet.wallet.includeInTotal ?? true,
        isDefault: wallet.wallet.isDefault ?? false,
      });
    }
  }, [wallet, walletTypes, reset, cryptoRates, fiatRates]);

  const onSubmit = (data: WalletFormValues) => {
    if (!wallet) return;

    const body = {
      name: data.name,
      balance: parseFloat(data.balance),
      walletTypeId: data.walletType.id,
      currencyId: data.currency.id,
      lastDigits: data?.accountNumber?.slice(-4) || null,
      accountNumber: data.accountNumber || null,
      includeInTotal: data.includeInTotal,
      isDefault: data.isDefault,
    };

    console.log({ body });
    updateWallet(wallet.wallet.id, body);

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: t("wallets.updatedSuccess"),
    });
  };

  const handleSelectCurrency = async () => {
    const result = await SheetManager.show("select-sheet", {
      payload: {
        selectedValue: selectedCurrency?.id,
        options: walletKey?.key === "crypto" ? cryptoRates : fiatRates,
        title: "Select Currency",
      },
    });

    if (result) setValue("currency", result?.originalItem);
  };

  const handleDelete = () => {
    alertService.show({
      title: t("common.delete"),
      message: t("wallets.deleteConfirm"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            if (wallet) {
              deleteWallet(wallet.wallet.id);

              Toast.show({
                type: "success",
                text1: t("common.success"),
                text2: t("wallets.deletedSuccess"),
              });

              setTimeout(() => {
                navigation.navigate("Wallets");
              }, 1000);
            }
          },
        },
      ],
    });
  };

  if (!wallet) return null;

  return (
    <SafeArea applyBottomInset>
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
              onPress={() => {
                setValue(
                  "currency",
                  item.key === "crypto"
                    ? cryptoRates[0].originalItem
                    : fiatRates[0].originalItem,
                );
                setValue("walletType", {
                  id: item.id,
                  key: item.key,
                });
              }}
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
    </SafeArea>
  );
};
