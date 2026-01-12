import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-toast-message";

import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button, DropDownButton } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Header } from "../components/ui/Headers";
import { Input } from "../components/ui/Input";
import { Icon } from "../components/ui/Icon";
import { useFinanceStore } from "../store";
import { useTranslation } from "../hooks/useTranslation";
import { useFonts } from "../hooks/useFonts";

// Validation schema
const budgetSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  categoryId: z.string().min(1, "Category is required"),
  period: z.enum(["weekly", "monthly", "yearly"]),
  alertEnabled: z.boolean(),
  alertThreshold: z.string(),
  rollover: z.boolean(),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export const CreateBudgetScreen = () => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const categories = useFinanceStore((state) => state.categories);
  const addBudget = useFinanceStore((state) => state.addBudget);
  const { fonts } = useFonts();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      period: "monthly",
      alertEnabled: true,
      alertThreshold: "80",
      rollover: false,
    },
  });

  const categoryId = watch("categoryId");
  const period = watch("period");
  const alertEnabled = watch("alertEnabled");
  const alertThreshold = watch("alertThreshold");
  const amount = watch("amount");

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const periodOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  const alertThresholdOptions = [
    { label: "50% of budget", value: "50" },
    { label: "75% of budget", value: "75" },
    { label: "80% of budget", value: "80" },
    { label: "90% of budget", value: "90" },
  ];

  const handleCategorySelect = async () => {
    const categoryOptions = categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
      icon: cat.icon,
    }));

    const result = await SheetManager.show("select-sheet", {
      payload: {
        options: categoryOptions,
        title: "Select Category",
        selectedValue: categoryId,
      },
    });

    if (result) {
      setValue("categoryId", result as string);
    }
  };

  const handlePeriodSelect = async () => {
    const result = await SheetManager.show("select-sheet", {
      payload: {
        options: periodOptions,
        title: "Budget Period",
        selectedValue: period,
      },
    });

    if (result) {
      setValue("period", result as "weekly" | "monthly" | "yearly");
    }
  };

  const handleAlertThresholdSelect = async () => {
    const result = await SheetManager.show("select-sheet", {
      payload: {
        options: alertThresholdOptions,
        title: "Alert Threshold",
        selectedValue: alertThreshold,
      },
    });

    if (result) {
      setValue("alertThreshold", result as string);
    }
  };

  const onSubmit = (data: BudgetFormData) => {
    const category = categories.find((c) => c.id === data.categoryId);
    if (!category) return;

    addBudget({
      category: category.name,
      limit: parseFloat(data.amount),
      spent: 0,
      period: data.period,
      color: category.color,
      icon: category.icon,
    });

    Toast.show({
      type: "success",
      text1: t("common.success"),
      text2: "Budget created successfully!",
    });

    navigation.goBack();
  };

  const getPeriodLabel = () => {
    const option = periodOptions.find((p) => p.value === period);
    return option?.label || "Monthly";
  };

  const getAlertThresholdLabel = () => {
    const option = alertThresholdOptions.find(
      (a) => a.value === alertThreshold
    );
    return option?.label || "80% of budget";
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Create Budget" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Budget Amount Card */}
        <Card style={styles.amountCard}>
          <Text
            variant="caption"
            style={{ color: theme.colors.mutedForeground, marginBottom: 8 }}
          >
            Budget Limit
          </Text>
          <View style={styles.amountInputRow}>
            <Text weight="extraBold" style={styles.currencySymbol}>
              $
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                  inputStyle={{
                    fontFamily: fonts.extraBold,
                    fontSize: 36,
                    textAlign: "center",
                  }}
                  error={errors.amount?.message}
                />
              )}
            />
          </View>
        </Card>

        {/* Category Selection */}
        <View style={{ gap: 8 }}>
          <Text weight="semiBold" style={styles.sectionLabel}>
            <Icon
              type="Feather"
              name="target"
              size={16}
              color={theme.colors.foreground}
            />{" "}
            Category
          </Text>
          <DropDownButton
            selectedValue={selectedCategory?.name || "Select a category"}
            onPress={handleCategorySelect}
            leftIcon={
              selectedCategory ? (
                <Icon
                  size={20}
                  type={selectedCategory.iconFamily as any}
                  name={selectedCategory.icon}
                  color={selectedCategory.color}
                />
              ) : null
            }
            style={{
              borderColor: errors.categoryId
                ? theme.colors.destructive
                : theme.colors.border,
            }}
          />
          {errors.categoryId && (
            <Text
              variant="caption"
              style={{ color: theme.colors.destructive, marginTop: 4 }}
            >
              {errors.categoryId.message}
            </Text>
          )}
        </View>

        {/* Period Selection */}
        <View style={{ gap: 8 }}>
          <Text weight="semiBold" style={styles.sectionLabel}>
            <Icon
              type="Feather"
              name="calendar"
              size={16}
              color={theme.colors.foreground}
            />{" "}
            Budget Period
          </Text>
          <DropDownButton
            selectedValue={getPeriodLabel()}
            onPress={handlePeriodSelect}
          />
        </View>

        {/* Budget Alerts Card */}
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrapper}>
              <Icon
                type="Feather"
                name="bell"
                size={20}
                color={theme.colors.background}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text weight="medium">Budget Alerts</Text>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                Get notified when near limit
              </Text>
            </View>
            <Controller
              control={control}
              name="alertEnabled"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>

          {alertEnabled && (
            <View style={styles.alertThresholdSection}>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground, marginBottom: 8 }}
              >
                Alert when spending reaches
              </Text>
              <DropDownButton
                selectedValue={getAlertThresholdLabel()}
                onPress={handleAlertThresholdSelect}
              />
            </View>
          )}
        </Card>

        {/* Rollover Card */}
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View
              style={[
                styles.settingIconWrapper,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Icon
                type="Feather"
                name="trending-up"
                size={20}
                color={theme.colors.background}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text weight="medium">Rollover Unused Budget</Text>
              <Text
                variant="caption"
                style={{ color: theme.colors.mutedForeground }}
              >
                Carry forward unspent amount
              </Text>
            </View>
            <Controller
              control={control}
              name="rollover"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>
        </Card>

        {/* Preview Card */}
        {selectedCategory && amount && (
          <Card style={styles.previewCard}>
            <Text weight="semiBold" style={{ marginBottom: 12 }}>
              Preview
            </Text>
            <View style={styles.previewContent}>
              <View style={styles.previewIcon}>
                <Text style={{ fontSize: 28 }}>{selectedCategory.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text weight="semiBold">{selectedCategory.name}</Text>
                <Text
                  variant="caption"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  ${parseFloat(amount || "0").toFixed(2)} / {period}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Create Button */}
        <Button
          title="Create Budget"
          onPress={handleSubmit(onSubmit)}
          style={styles.createButton}
          size="lg"
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
  amountCard: {
    padding: theme.paddings.xl,
    alignItems: "center",
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme.colors.mutedForeground,
  },
  amountInput: {
    minWidth: 120,
    height: "auto",
    paddingVertical: 4,
  },
  sectionLabel: {
    fontSize: theme.fontSize.md,
    display: "flex",
    alignItems: "center",
  },
  settingsCard: {
    padding: theme.paddings.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  settingIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.warning + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  alertThresholdSection: {
    marginTop: theme.margins.md,
    paddingTop: theme.paddings.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  previewCard: {
    backgroundColor: theme.colors.primary + "08",
    borderWidth: 1,
    borderColor: theme.colors.primary + "20",
    padding: theme.paddings.md,
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    marginTop: theme.margins.md,
  },
}));
