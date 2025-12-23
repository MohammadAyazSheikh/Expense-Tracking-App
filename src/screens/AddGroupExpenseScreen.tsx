import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SettingsGroup } from "../components/ui/SettingsGroup";
import { SettingsRow } from "../components/ui/SettingsRow";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFinanceStore } from "../store";
import Toast from "react-native-toast-message";

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

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("You");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    group?.members || []
  );
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [splitType, setSplitType] = useState<"equal" | "exact" | "percentage">(
    "equal"
  );

  if (!group) return null;

  const handleAddExpense = () => {
    if (!amount || !description) {
      Toast.show({
        type: "error",
        text1: "Required Fields",
        text2: "Please enter an amount and description.",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    const sharePerPerson = numAmount / group.members.length;

    addGroupExpense({
      groupId: group.id,
      amount: numAmount,
      description,
      paidBy,
      date: new Date().toLocaleDateString(),
      splitType,
      splits: group.members.map((member) => ({
        memberId: member,
        amount: sharePerPerson,
      })),
    });

    // Simple balance update logic
    if (paidBy === "You") {
      updateGroup(group.id, {
        totalExpenses: group.totalExpenses + numAmount,
        youAreOwed: group.youAreOwed + (numAmount - sharePerPerson),
        lastActivity: "Just now",
      });
    } else {
      updateGroup(group.id, {
        totalExpenses: group.totalExpenses + numAmount,
        youOwe: group.youOwe + sharePerPerson,
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
            Add Expense
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Card style={styles.amountCard}>
          <View style={styles.inputRow}>
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
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What was it for?"
            placeholderTextColor={theme.colors.mutedForeground}
          />
        </Card>

        <SettingsGroup title="Expense Details">
          <SettingsRow
            label="Paid By"
            rightElement={
              <View style={styles.picker}>
                <Text weight="medium">{paidBy}</Text>
                <Feather
                  name="chevron-down"
                  size={16}
                  color={theme.colors.mutedForeground}
                />
              </View>
            }
            onPress={() => {
              // Simple toggle for now
              setPaidBy(paidBy === "You" ? group.members[1] || "Sarah" : "You");
            }}
          />
        </SettingsGroup>
        <SettingsGroup title="Split Type">
          <View style={styles.tabsContainer}>
            {["equal", "exact", "percentage"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.tabButton,
                  splitType === type && styles.activeTabButton,
                ]}
                onPress={() => setSplitType(type as any)}
              >
                <Text
                  variant="caption"
                  weight="semiBold"
                  style={{
                    color:
                      splitType === type ? "white" : theme.colors.foreground,
                    fontSize: 12,
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingsGroup>

        <SettingsGroup title="Split With">
          {group.members.map((member) => (
            <View key={member} style={styles.memberSplitRow}>
              <TouchableOpacity
                style={styles.memberSelect}
                onPress={() => {
                  setSelectedMembers((prev) =>
                    prev.includes(member)
                      ? prev.filter((m) => m !== member)
                      : [...prev, member]
                  );
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedMembers.includes(member) && styles.checkboxActive,
                  ]}
                >
                  {selectedMembers.includes(member) && (
                    <Feather name="check" size={12} color="white" />
                  )}
                </View>
                <View style={styles.memberAvatarSmall}>
                  <Text style={{ fontSize: 12 }}>{member.charAt(0)}</Text>
                </View>
                <Text weight="medium">{member}</Text>
              </TouchableOpacity>

              {splitType === "equal" ? (
                <Text weight="bold" style={{ color: theme.colors.primary }}>
                  $
                  {selectedMembers.includes(member) && amount
                    ? (parseFloat(amount) / selectedMembers.length).toFixed(2)
                    : "0.00"}
                </Text>
              ) : (
                <View style={styles.customSplitInput}>
                  {splitType === "exact" && <Text variant="caption">$</Text>}
                  <TextInput
                    style={styles.smallInput}
                    value={customSplits[member] || ""}
                    onChangeText={(val) =>
                      setCustomSplits((prev) => ({ ...prev, [member]: val }))
                    }
                    placeholder="0"
                    keyboardType="decimal-pad"
                    editable={selectedMembers.includes(member)}
                  />
                  {splitType === "percentage" && (
                    <Text variant="caption">%</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </SettingsGroup>

        {amount && (
          <Card style={styles.summaryCard}>
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
                  ${(parseFloat(amount) / selectedMembers.length).toFixed(2)}
                </Text>
              </View>
            )}
          </Card>
        )}

        <Button
          title="Add Expense"
          onPress={handleAddExpense}
          style={styles.addButton}
          size="lg"
          disabled={!amount || !description}
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
    gap: theme.margins.md,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.mutedForeground,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.foreground,
    minWidth: 120,
    textAlign: "center",
  },
  descriptionInput: {
    fontSize: 18,
    color: theme.colors.foreground,
    textAlign: "center",
    width: "100%",
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 4,
    backgroundColor: theme.colors.muted,
    borderRadius: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  memberSplitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "15",
  },
  memberSelect: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  memberAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  customSplitInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  smallInput: {
    width: 60,
    height: 32,
    textAlign: "right",
    fontSize: 14,
    color: theme.colors.foreground,
  },
  summaryCard: {
    padding: theme.paddings.md,
    backgroundColor: theme.colors.primary + "05",
    borderColor: theme.colors.primary + "20",
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  addButton: {
    marginTop: theme.margins.lg,
    marginBottom: 40,
  },
}));
