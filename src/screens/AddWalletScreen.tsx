import React from "react";
import { useForm, Controller } from "react-hook-form";
import { View, ScrollView, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";

const walletTypes = [
  { id: "cash", icon: "wallet", label: "Cash", color: "#2E7D32" },
  { id: "bank", icon: "bank", label: "Bank", color: "#1565C0" },
  { id: "card", icon: "credit-card", label: "Card", color: "#6A1B9A" },
  { id: "digital", icon: "smartphone", label: "Digital", color: "#0277BD" },
  { id: "crypto", icon: "bitcoin", label: "Crypto", color: "#F57F17" },
  { id: "savings", icon: "piggy-bank", label: "Savings", color: "#C62828" },
];

const currencies = ["USD", "EUR", "GBP", "PKR", "INR", "AED"];

export const AddWalletScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { addWallet } = useFinanceStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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

  const onSubmit = (data: any) => {
    const selectedType = walletTypes.find((t) => t.id === data.type);

    addWallet({
      name: data.name,
      balance: parseFloat(data.balance),
      type: data.type,
      color: selectedType?.color || theme.colors.primary,
      icon: selectedType?.icon || "wallet",
      accountNumber: data.accountNumber,
      currency: data.currency,
      includeInTotal: data.includeInTotal,
      isDefault: data.isDefault,
    });

    setTimeout(() => {
      navigation.goBack();
    }, 1000);

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: t("wallets.addedSuccess"),
    });
  };

  return (
    <ScreenWrapper style={{ height: "100%" }}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        title={t("wallets.addWallet")}
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
      </ScrollView>
    </ScreenWrapper>
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
  row: {
    flexDirection: "row",
    gap: theme.margins.md,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
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
    justifyContent: "center",
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
