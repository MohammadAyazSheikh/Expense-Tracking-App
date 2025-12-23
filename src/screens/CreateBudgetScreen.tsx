import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SettingsGroup } from "../components/ui/SettingsGroup";
import { SettingsRow } from "../components/ui/SettingsRow";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFinanceStore } from "../store";
import { Category } from "../types";
import Toast from "react-native-toast-message";

export const CreateBudgetScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const categories = useFinanceStore((state) => state.categories);
  const addBudget = useFinanceStore((state) => state.addBudget);

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [rolloverEnabled, setRolloverEnabled] = useState(false);

  const handleCreate = () => {
    if (!amount || !selectedCategory) {
      Toast.show({
        type: "error",
        text1: "Required Fields",
        text2: "Please enter an amount and select a category.",
      });
      return;
    }

    addBudget({
      category: selectedCategory.name,
      limit: parseFloat(amount),
      spent: 0,
      period: period,
      color: selectedCategory.color,
      icon: selectedCategory.icon,
    });

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Budget created successfully!",
    });
    navigation.goBack();
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + "CC"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Button
            title=""
            icon={<Feather name="arrow-left" size={24} color="white" />}
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
          <Text variant="h2" style={styles.headerTitle}>
            Create Budget
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Budget Amount Card */}
        <Card style={styles.amountCard}>
          <Text variant="caption" style={styles.amountLabel}>
            Budget Limit
          </Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={theme.colors.mutedForeground}
              keyboardType="decimal-pad"
            />
          </View>
        </Card>

        {/* Category Selection */}
        <SettingsGroup title="Category">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  selectedCategory?.id === cat.id && {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.primary + "10",
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  variant="caption"
                  weight={selectedCategory?.id === cat.id ? "bold" : "regular"}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SettingsGroup>

        {/* Settings */}
        <SettingsGroup title="Preferences">
          <SettingsRow
            label="Period"
            rightElement={
              <View style={styles.periodPicker}>
                {(["weekly", "monthly", "yearly"] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPeriod(p)}
                    style={[
                      styles.periodOption,
                      period === p && { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: period === p ? "white" : theme.colors.foreground,
                      }}
                      weight={period === p ? "bold" : "regular"}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
          <SettingsRow
            label="Budget Alerts"
            description="Notify me when near limit"
            rightElement={
              <Switch value={alertsEnabled} onValueChange={setAlertsEnabled} />
            }
          />
          <SettingsRow
            label="Rollover Unused"
            description="Carry forward unspent amount"
            rightElement={
              <Switch
                value={rolloverEnabled}
                onValueChange={setRolloverEnabled}
              />
            }
          />
        </SettingsGroup>

        {/* Preview Card */}
        {selectedCategory && amount && (
          <Card style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: theme.colors.primary + "15" },
                ]}
              >
                <Text style={{ fontSize: 24 }}>{selectedCategory.icon}</Text>
              </View>
              <View>
                <Text weight="bold">{selectedCategory.name}</Text>
                <Text variant="caption">
                  ${parseFloat(amount).toFixed(2)} / {period}
                </Text>
              </View>
            </View>
          </Card>
        )}

        <Button
          title="Create Budget"
          onPress={handleCreate}
          style={styles.createButton}
          size="lg"
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
  },
  amountCard: {
    padding: theme.paddings.xl,
    alignItems: "center",
  },
  amountLabel: {
    marginBottom: theme.margins.sm,
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.xs,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.mutedForeground,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: "bold",
    color: theme.colors.foreground,
    minWidth: 100,
    textAlign: "center",
  },
  categoryList: {
    paddingHorizontal: theme.paddings.sm,
    paddingVertical: theme.paddings.md,
    gap: theme.margins.md,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: theme.colors.muted,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  periodPicker: {
    flexDirection: "row",
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.sm,
    padding: 2,
  },
  periodOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  previewCard: {
    backgroundColor: theme.colors.primary + "08",
    borderWidth: 1,
    borderColor: theme.colors.primary + "20",
    borderStyle: "dashed",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    marginTop: theme.margins.lg,
  },
}));
