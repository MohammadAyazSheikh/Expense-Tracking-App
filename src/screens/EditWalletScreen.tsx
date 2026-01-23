import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, ScrollView, Pressable } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { useTranslation } from "../hooks/useTranslation";
import { useFinanceStore } from "../store";
import Toast from "react-native-toast-message";
import { CategoryItem } from "../screens/AddExpenseScreen";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Header } from "../components/ui/Headers";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon } from "../components/ui/Icon";
import { alertService } from "../utils/alertService";
import { styles } from "./AddWalletScreen";

const walletTypes = [
  { id: "cash", icon: "wallet", label: "Cash", color: "#2E7D32" },
  { id: "bank", icon: "bank", label: "Bank", color: "#1565C0" },
  { id: "card", icon: "credit-card", label: "Card", color: "#6A1B9A" },
  { id: "digital", icon: "smartphone", label: "Digital", color: "#0277BD" },
  { id: "crypto", icon: "bitcoin", label: "Crypto", color: "#F57F17" },
  { id: "savings", icon: "piggy-bank", label: "Savings", color: "#C62828" },
];

const currencies = ["USD", "EUR", "GBP", "PKR", "INR", "AED"];

export const EditWalletScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "EditWallet">>();
  const { updateWallet, deleteWallet, wallets } = useFinanceStore();
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const wallet = wallets.find((w) => w.id === route?.params?.walletId);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      balance: "",
      type: "cash",
      currency: "USD",
      accountNumber: "",
      includeInTotal: true,
      isDefault: false,
    },
  });

  const type = watch("type");
  const currency = watch("currency");
  const includeInTotal = watch("includeInTotal");
  const isDefault = watch("isDefault");

  useEffect(() => {
    if (wallet) {
      reset({
        name: wallet.name,
        balance: wallet.balance.toString(),
        type: wallet.type.toLowerCase(),
        currency: wallet.currency || "USD",
        accountNumber: wallet.accountNumber || "",
        includeInTotal: wallet.includeInTotal ?? true,
        isDefault: wallet.isDefault ?? false,
      });
    }
  }, [wallet, reset]);

  const onSubmit = (data: any) => {
    if (!wallet) return;

    const selectedType = walletTypes.find((t) => t.id === data.type);

    updateWallet(wallet.id, {
      name: data.name,
      type: data.type,
      color: selectedType?.color || wallet.color,
      icon: selectedType?.icon || wallet.icon || "wallet",
      accountNumber: data.accountNumber,
      includeInTotal: data.includeInTotal,
      isDefault: data.isDefault,
    });

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: t("wallets.updatedSuccess"),
    });
  };

  const handleDelete = () => {
    alertService.show(t("common.delete"), t("wallets.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          if (wallet) {
            deleteWallet(wallet.id);

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
    ]);
  };

  if (!wallet) return null;
  return (
    <ScreenWrapper style={{ height: "100%" }}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        title={t("wallets.editWallet")}
      />
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
                name: t(`wallets.types.${item.id}` as any),
                color: item.color,
                icon: item.icon,
                iconFamily: "MaterialCommunityIcons",
              }}
              isSelected={type === item.id}
              onPress={() => setValue("type", item.id)}
            />
          ))}
        </View>

        {/* Basic Info */}
        <Card style={styles.formCard}>
          <Controller
            control={control}
            name="name"
            rules={{ required: t("wallets.fillRequired") }}
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("wallets.name")}
                placeholder="e.g. Main Account"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message as string}
              />
            )}
          />

          <Controller
            control={control}
            name="balance"
            rules={{ required: t("wallets.fillRequired") }}
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("wallets.initialBalance")}
                placeholder="0.00"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.balance?.message as string}
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
            )}
          />

          <View style={styles.row}>
            {/* Simplified currency selector for now */}
            <Text style={styles.label}>{t("wallets.currency")}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {currencies.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setValue("currency", c)}
                  style={[
                    styles.currencyChip,
                    currency === c && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: currency === c ? "white" : theme.colors.foreground,
                      fontSize: 12,
                    }}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {(type === "bank" || type === "card") && (
            <Controller
              control={control}
              name="accountNumber"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={t("wallets.accountNumber")}
                  placeholder="**** **** **** 1234"
                  value={value}
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
    </ScreenWrapper>
  );
};
