import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SheetManager } from "react-native-actions-sheet";
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
import { SafeArea } from "@/components/ui/SafeArea";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/libs/database";
import { Wallet } from "@/database/models/wallet";
import { WalletTypes } from "@/database/models/wallet";
import { Currencies } from "@/database/models/currency";
import { walletService } from "@/services/business/walletService";

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
  currency: z
    .object({
      id: z.string(),
      code: z.string(),
      decimalPlaces: z.number(),
      isActive: z.boolean(),
      name: z.string(),
      symbol: z.string(),
      type: z.string(),
    })
    .optional(),
  accountNumber: z.string().optional(),
  includeInTotal: z.boolean(),
  isDefault: z.boolean(),
});

type WalletFormValues = z.infer<typeof walletSchema>;

type EditWalletProps = {
  wallet: Wallet;
  walletTypes: WalletTypes[];
};

const BaseEditWalletScreen = ({ wallet, walletTypes }: EditWalletProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useUnistyles();
  const { t } = useTranslation();

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
      currency: undefined,
      accountNumber: "",
      includeInTotal: true,
      isDefault: false,
    },
  });

  const selectedCurrency = watch("currency");
  const includeInTotal = watch("includeInTotal");
  const isDefault = watch("isDefault");
  const walletKey = watch("walletType");

  useEffect(() => {
    if (wallet && walletTypes.length > 0) {
      const loadRelations = async () => {
        const wt = await wallet.walletType.fetch();
        const c = await wallet.currency.fetch();

        reset({
          name: wallet.name,
          balance: wallet.balance.toString(),
          walletType: wt
            ? {
                id: wt.id,
                key: wt.key,
              }
            : walletTypes[0],
          currency: c
            ? {
                id: c.id,
                code: c.code,
                decimalPlaces: c.decimalPlaces,
                isActive: c.isActive,
                name: c.name,
                symbol: c.symbol,
                type: c.type,
              }
            : undefined,
          accountNumber: wallet.accountNumber || "",
          includeInTotal: wallet.includeInTotal ?? true,
          isDefault: wallet.isDefault ?? false,
        });
      };
      loadRelations();
    }
  }, [wallet, walletTypes, reset]);

  const onSubmit = (data: WalletFormValues) => {
    if (!wallet) return;

    if (!data.currency) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: "Please select currency",
      });
      return;
    }

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

    walletService.update(wallet.id, body, wallet.userId); // userId from wallet or auth store

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: t("wallets.updatedSuccess"),
    });
  };

  const handleSelectCurrency = async () => {
    const options = await database
      .get<Currencies>("currencies")
      .query()
      .fetch();
    // Filter based on wallet type (crypto/fiat)
    const type = walletKey?.key === "crypto" ? "crypto" : "fiat";
    const filtered = options
      .filter((c) => c.type === type)
      .map((c) => ({
        value: c.id,
        id: c.id,
        name: c.name,
        code: c.code,
        label: c.name,
        originalItem: {
          id: c.id,
          code: c.code,
          decimalPlaces: c.decimalPlaces,
          isActive: c.isActive,
          name: c.name,
          symbol: c.symbol,
          type: c.type,
        },
      }));

    const result = await SheetManager.show("select-sheet", {
      payload: {
        selectedValue: selectedCurrency?.id,
        options: filtered,
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
          onPress: async () => {
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
                  undefined, // Clear currency when type changes
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
                selectedValue={value?.name ?? ""}
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

const enhance = withObservables(
  ["route"],
  ({ route }: { route: RouteProp<RootStackParamList, "EditWallet"> }) => ({
    wallet: database
      .get<Wallet>("wallets")
      .findAndObserve(route.params.walletId),
    walletTypes: database.get<WalletTypes>("wallet_types").query().observe(),
  }),
);

export const EditWalletScreen = enhance(BaseEditWalletScreen);
