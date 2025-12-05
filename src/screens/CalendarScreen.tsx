import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Calendar, DateData } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { Icon, IconType } from "../components/ui/Icon";
import { useTranslation } from "../hooks/useTranslation";
import { useFinanceStore } from "../store";
import { Transaction } from "../types";

export const CalendarScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);

  const [selectedDate, setSelectedDate] = useState<string>("");

  // Group transactions by date and calculate totals
  const transactionsByDate = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};
    const totals: Record<
      string,
      { income: number; expense: number; net: number }
    > = {};

    transactions.forEach((transaction) => {
      const date = transaction.date;
      if (!grouped[date]) {
        grouped[date] = [];
        totals[date] = { income: 0, expense: 0, net: 0 };
      }
      grouped[date].push(transaction);

      if (transaction.type === "income") {
        totals[date].income += transaction.amount;
        totals[date].net += transaction.amount;
      } else {
        totals[date].expense += Math.abs(transaction.amount);
        totals[date].net += transaction.amount;
      }
    });

    return { grouped, totals };
  }, [transactions]);

  // Create marked dates for calendar
  const markedDates = useMemo(() => {
    const marked: any = {};

    Object.keys(transactionsByDate.totals).forEach((date) => {
      const { net } = transactionsByDate.totals[date];
      marked[date] = {
        marked: true,
        dotColor: net >= 0 ? theme.colors.success : theme.colors.destructive,
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
      };
    }

    return marked;
  }, [transactionsByDate.totals, selectedDate, theme]);

  const selectedDateTransactions = selectedDate
    ? transactionsByDate.grouped[selectedDate] || []
    : [];

  const selectedDateTotals = selectedDate
    ? transactionsByDate.totals[selectedDate] || {
        income: 0,
        expense: 0,
        net: 0,
      }
    : null;

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleAddTransaction = () => {
    navigation.navigate("AddExpense" as any, { prefilledDate: selectedDate });
  };

  const handleTransactionPress = (transactionId: string) => {
    navigation.navigate("TransactionDetail" as any, { id: transactionId });
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text variant="h2" style={styles.headerTitle}>
            {t("calendar.title", "Calendar")}
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerDescription}>
          {t("calendar.description", "View your transactions by date")}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Calendar */}
        <Card style={styles.calendarCard}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: theme.colors.card,
              calendarBackground: theme.colors.card,
              textSectionTitleColor: theme.colors.foreground,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.primaryForeground,
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.foreground,
              textDisabledColor: theme.colors.mutedForeground,
              dotColor: theme.colors.primary,
              selectedDotColor: theme.colors.primaryForeground,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.foreground,
              indicatorColor: theme.colors.primary,
              textDayFontWeight: "400",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
            }}
          />
        </Card>

        {/* Selected Date Summary */}
        {selectedDate && selectedDateTotals && (
          <>
            <Card style={styles.summaryCard}>
              <Text weight="semiBold" style={styles.summaryTitle}>
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text variant="caption" style={{ marginBottom: 4 }}>
                    {t("calendar.income", "Income")}
                  </Text>
                  <Text
                    weight="semiBold"
                    style={{ color: theme.colors.success }}
                  >
                    ${selectedDateTotals.income.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text variant="caption" style={{ marginBottom: 4 }}>
                    {t("calendar.expenses", "Expenses")}
                  </Text>
                  <Text
                    weight="semiBold"
                    style={{ color: theme.colors.destructive }}
                  >
                    ${selectedDateTotals.expense.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text variant="caption" style={{ marginBottom: 4 }}>
                    {t("calendar.net", "Net")}
                  </Text>
                  <Text
                    weight="semiBold"
                    style={{
                      color:
                        selectedDateTotals.net >= 0
                          ? theme.colors.success
                          : theme.colors.destructive,
                    }}
                  >
                    ${selectedDateTotals.net.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Add Transaction Button */}
            <Button
              title={t("calendar.addTransaction", "Add Transaction")}
              icon={<Ionicons name="add" size={20} color="white" />}
              onPress={handleAddTransaction}
            />

            {/* Transactions List */}
            {selectedDateTransactions.length > 0 ? (
              <View style={styles.transactionsList}>
                <Text weight="semiBold" style={styles.sectionTitle}>
                  {t("calendar.transactions", "Transactions")} (
                  {selectedDateTransactions.length})
                </Text>
                {selectedDateTransactions.map((transaction) => {
                  const category = categories.find(
                    (c) => c.name === transaction.category
                  );
                  return (
                    <TouchableOpacity
                      key={transaction.id}
                      onPress={() => handleTransactionPress(transaction.id)}
                    >
                      <Card style={styles.transactionCard}>
                        <View
                          style={[
                            styles.transactionIcon,
                            {
                              backgroundColor:
                                category?.color || theme.colors.muted,
                            },
                          ]}
                        >
                          <Icon
                            type={
                              (category?.iconFamily as IconType) || "Ionicons"
                            }
                            name={(category?.icon as any) || "help"}
                            size={20}
                            color="white"
                          />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text weight="medium" numberOfLines={1}>
                            {transaction.name}
                          </Text>
                          <View style={styles.transactionMeta}>
                            <Badge
                              variant="outline"
                              style={{
                                paddingVertical: 0,
                                paddingHorizontal: 6,
                              }}
                            >
                              {transaction.category}
                            </Badge>
                            <Text variant="caption">{transaction.time}</Text>
                          </View>
                        </View>
                        <View style={styles.transactionAmount}>
                          <Text
                            weight="semiBold"
                            style={{
                              color:
                                transaction.type === "income"
                                  ? theme.colors.success
                                  : theme.colors.foreground,
                            }}
                          >
                            {transaction.type === "income" ? "+" : ""}
                            {transaction.amount.toFixed(2)}
                          </Text>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Card style={styles.emptyState}>
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={theme.colors.mutedForeground}
                />
                <Text style={styles.emptyText}>
                  {t("calendar.noTransactions", "No transactions on this date")}
                </Text>
              </Card>
            )}
          </>
        )}

        {/* Empty state when no date selected */}
        {!selectedDate && (
          <Card style={styles.emptyState}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={theme.colors.mutedForeground}
            />
            <Text style={styles.emptyText}>
              {t("calendar.selectDate", "Select a date to view transactions")}
            </Text>
          </Card>
        )}
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
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.sm,
  },
  headerTitle: {
    color: "white",
  },
  headerDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: theme.fontSize.sm,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  calendarCard: {
    padding: theme.paddings.sm,
  },
  summaryCard: {
    padding: theme.paddings.lg,
  },
  summaryTitle: {
    fontSize: theme.fontSize.md,
    marginBottom: theme.margins.md,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    marginBottom: theme.margins.sm,
  },
  transactionsList: {
    gap: theme.margins.sm,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    padding: theme.paddings.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.xs,
    marginTop: 4,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  emptyState: {
    padding: theme.paddings.xl,
    alignItems: "center",
    gap: theme.margins.md,
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    fontSize: theme.fontSize.md,
  },
}));
