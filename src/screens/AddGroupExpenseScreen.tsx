import React, { useEffect } from "react";
import { View, ScrollView, TextInput, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button, DropDownButton } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Header } from "../components/ui/Headers";
import { Input } from "../components/ui/Input";
import Checkbox from "../components/ui/Checkbox";
import { useFinanceStore } from "../store";
import Animated from "react-native-reanimated";
import {
  EnteringAnimation,
  ExitingAnimation,
  LayoutAnimation,
} from "../utils/Animation";

// Validation schema
const expenseSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  paidBy: z.string(),
  splitType: z.enum(["equal", "exact", "percentage"]),
  selectedMembers: z.array(z.string()).min(1, "Select at least one member"),
  customSplits: z.record(z.string()),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export const AddGroupExpenseScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "AddGroupExpense">>();
  const { groupId } = route.params;

  const group = useFinanceStore((state) =>
    state.groups.find((g) => g.id === groupId)
  );
  const addGroupExpense = useFinanceStore((state) => state.addGroupExpense);
  const updateGroup = useFinanceStore((state) => state.updateGroup);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: "",
      description: "",
      paidBy: "You",
      splitType: "equal",
      selectedMembers: group?.members || [],
      customSplits: {},
      notes: "",
    },
  });

  const amount = watch("amount");
  const splitType = watch("splitType");
  const selectedMembers = watch("selectedMembers");
  const customSplits = watch("customSplits");
  const paidBy = watch("paidBy");

  useEffect(() => {
    if (group && selectedMembers.length === 0) {
      setValue("selectedMembers", group.members);
    }
  }, [group, setValue]);

  if (!group) return null;

  const handleMemberToggle = (memberId: string) => {
    const currentSelected = selectedMembers;
    if (currentSelected.includes(memberId)) {
      setValue(
        "selectedMembers",
        currentSelected.filter((id) => id !== memberId)
      );
    } else {
      setValue("selectedMembers", [...currentSelected, memberId]);
    }
  };

  const calculateShare = (memberId: string) => {
    const numAmount = parseFloat(amount || "0");
    if (!amount || selectedMembers.length === 0) return 0;

    if (splitType === "equal") {
      return numAmount / selectedMembers.length;
    } else if (splitType === "exact") {
      return parseFloat(customSplits[memberId] || "0");
    } else if (splitType === "percentage") {
      const percentage = parseFloat(customSplits[memberId] || "0");
      return (percentage / 100) * numAmount;
    }
    return 0;
  };

  const onSubmit = (data: ExpenseFormData) => {
    const numAmount = parseFloat(data.amount);

    // Validate custom splits sum if needed (omitted for brevity, can add later)

    const splits = data.selectedMembers.map((memberId) => ({
      memberId,
      amount: calculateShare(memberId),
    }));

    addGroupExpense({
      groupId: group.id,
      amount: numAmount,
      description: data.description,
      paidBy: data.paidBy,
      date: new Date().toLocaleDateString(),
      splitType: data.splitType,
      splits,
    });

    // Update group totals
    const sharePerPerson = numAmount / data.selectedMembers.length; // Simplified for equal split logic in updateGroup for now
    // In a real app, you'd calculate exact debts based on splits

    if (data.paidBy === "You") {
      updateGroup(group.id, {
        totalExpenses: group.totalExpenses + numAmount,
        youAreOwed:
          group.youAreOwed +
          (numAmount - (splits.find((s) => s.memberId === "You")?.amount || 0)),
        lastActivity: "Just now",
      });
    } else {
      const yourSplit = splits.find((s) => s.memberId === "You")?.amount || 0;
      updateGroup(group.id, {
        totalExpenses: group.totalExpenses + numAmount,
        youOwe: group.youOwe + yourSplit,
        lastActivity: "Just now",
      });
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Expense added successfully!",
    });
    navigation.goBack();
  };

  const handlePaidBySelection = async () => {
    const options = group.members.map((m) => ({
      label: m,
      value: m,
    }));

    const result = await SheetManager.show("select-sheet", {
      payload: {
        options,
        title: "Paid By",
        selectedValue: paidBy,
        onSelect: (value) => setValue("paidBy", value),
      },
    });
    setValue("paidBy", result!);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Add Group Expense" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Input */}
        <Card style={styles.amountCard}>
          <Text
            variant="caption"
            style={{ color: theme.colors.mutedForeground }}
          >
            Amount
          </Text>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.currencySymbol}>$</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.amountInput}
                  value={value}
                  onChangeText={onChange}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.mutedForeground}
                  keyboardType="decimal-pad"
                />
              )}
            />
          </View>
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount.message}</Text>
          )}
        </Card>

        {/* Description */}
        <View>
          <Text weight="medium" style={styles.label}>
            <Feather name="file-text" size={14} /> Description
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="What was this expense for?"
                error={errors.description?.message}
              />
            )}
          />
        </View>

        {/* Paid By */}
        <View>
          <Text weight="medium" style={styles.label}>
            <Feather name="dollar-sign" size={14} /> Paid By
          </Text>
          <DropDownButton
            selectedValue={paidBy || "Who paid?"}
            onPress={handlePaidBySelection}
          />
        </View>

        {/* Split Type */}
        <View>
          <Text weight="medium" style={styles.label}>
            <Feather name="pie-chart" size={14} /> Split Type
          </Text>
          <View style={styles.tabsContainer}>
            {(["equal", "exact", "percentage"] as const).map((type) => (
              <Pressable
                key={type}
                style={[styles.tab, splitType === type && styles.activeTab]}
                onPress={() => setValue("splitType", type)}
              >
                <Text
                  style={[
                    styles.tabText,
                    splitType === type && styles.activeTabText,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Split With */}
        <View>
          <Text weight="medium" style={styles.label}>
            <Feather name="users" size={14} /> Split With
          </Text>
          <Card enableLayoutAnimation style={{ padding: theme.paddings.sm }}>
            {group.members.map((member, index) => (
              <Animated.View
                key={member}
                layout={LayoutAnimation}
                style={[styles.memberRow, index == 0 && { borderTopWidth: 0 }]}
              >
                <View style={[styles.memberInfo]}>
                  <Checkbox
                    checked={selectedMembers.includes(member)}
                    onPress={() => handleMemberToggle(member)}
                    size="lg"
                  />
                  <View style={styles.avatarSmall}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {member.charAt(0)}
                    </Text>
                  </View>
                  <Text>{member}</Text>
                </View>

                {splitType === "equal" ? (
                  <Text weight="bold" style={{ color: theme.colors.primary }}>
                    $
                    {selectedMembers.includes(member)
                      ? calculateShare(member).toFixed(2)
                      : "0.00"}
                  </Text>
                ) : (
                  <Input
                    value={(customSplits[member] as string) || ""}
                    onChangeText={(val) =>
                      setValue("customSplits", {
                        ...customSplits,
                        [member]: val,
                      })
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    editable={selectedMembers.includes(member)}
                    leftIcon={
                      splitType === "exact" && <Text variant="caption">$</Text>
                    }
                    rightIcon={
                      splitType === "percentage" && (
                        <Text variant="caption">%</Text>
                      )
                    }
                    style={styles.customInputWrapper}
                    inputStyle={styles.zeroPadding}
                    leftIconContainerStyle={styles.zeroPadding}
                    rightIconContainerStyle={styles.zeroPadding}
                  />
                )}
              </Animated.View>
            ))}
          </Card>
        </View>

        {/* Notes */}
        <View>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Notes (Optional)"
                value={value}
                onChangeText={onChange}
                placeholder="Add any additional notes..."
                multiline
                numberOfLines={3}
              />
            )}
          />
        </View>

        {/* Summary Card */}
        {amount && (
          <Card
            enableLayoutAnimation
            enableEnterAnimation
            style={styles.summaryCard}
          >
            <Text weight="bold" style={{ marginBottom: 12 }}>
              Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="caption">Total Amount</Text>
              <Text weight="bold">${parseFloat(amount).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="caption">Split Between</Text>
              <Text weight="bold">{selectedMembers.length} people</Text>
            </View>
            {splitType === "equal" && (
              <View style={styles.summaryRow}>
                <Text variant="caption">Each Person Pays</Text>
                <Text weight="bold" style={{ color: theme.colors.primary }}>
                  $
                  {(
                    parseFloat(amount) / Math.max(1, selectedMembers.length)
                  ).toFixed(2)}
                </Text>
              </View>
            )}
          </Card>
        )}

        <Button
          title="Add Expense"
          onPress={handleSubmit(onSubmit)}
          size="lg"
          style={{ marginBottom: 40 }}
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
  },
  amountCard: {
    alignItems: "center",
    padding: theme.paddings.lg,
    gap: theme.margins.xs,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.mutedForeground,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.foreground,
    minWidth: 100,
    textAlign: "center",
  },
  label: {
    marginBottom: theme.margins.xs,
    gap: 8,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 12,
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.paddings.md,
    backgroundColor: theme.colors.background,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.muted,
    padding: 4,
    borderRadius: theme.radius.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: theme.radius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.mutedForeground,
  },
  activeTabText: {
    color: "white",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryExtraLight,
    alignItems: "center",
    justifyContent: "center",
  },
  zeroPadding: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  customInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 8,
    borderRadius: 6,
    height: 32,
    width: 100,
  },
  customInput: {
    width: 50,
    textAlign: "right",
    fontSize: 14,
    color: theme.colors.foreground,
    padding: 0,
  },
  summaryCard: {
    padding: theme.paddings.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
}));
