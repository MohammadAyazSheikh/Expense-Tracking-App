import React, { useState, useMemo, useCallback } from "react";
import { View, TouchableOpacity, SectionList } from "react-native";
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
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import {
  DAMPING,
  EnteringAnimation,
  ExitingAnimation,
  LayoutAnimation,
} from "../utils/Animation";
import { useFonts } from "../hooks/useFonts";

export const EnteringListAnimation = FadeInDown.springify().damping(DAMPING);
export const ExitingListAnimation = FadeOut.springify().damping(DAMPING);

// Custom Day Component
const CustomDay = ({
  date,
  state,
  marking,
  onPress,
  theme,
  isSelected,
}: {
  date: DateData;
  state: any;
  marking: any;
  onPress: (date: DateData) => void;
  theme: any;
  isSelected: boolean;
}) => {
  const { maxAmount, maxType } = marking || {};
  const isToday = date.dateString === new Date().toISOString().split("T")[0];

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={[
        styles.customDayContainer,
        isSelected && styles.selectedDayContainer,
      ]}
    >
      <Text
        style={[
          styles.dayText,
          state === "disabled" && styles.disabledDayText,
          isSelected && styles.selectedDayText,
          !isSelected && isToday && styles.todayText,
        ]}
      >
        {date.day}
      </Text>
      {maxAmount !== undefined && (
        <Text
          style={[
            styles.dayAmountText,
            isSelected
              ? styles.selectedDayAmountText
              : maxType === "income"
              ? styles.incomeAmountText
              : styles.expenseAmountText,
          ]}
          numberOfLines={1}
        >
          {maxAmount}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const CalendarScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { fonts } = useFonts();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Process Data
  const { transactionsByDate, markedDates } = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};
    const totals: Record<
      string,
      { income: number; expense: number; net: number }
    > = {};
    const marked: any = {};

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

    Object.keys(totals).forEach((date) => {
      const { income, expense, net } = totals[date];
      const maxType = income > expense ? "income" : "expense";
      const maxAmount = income > expense ? income : expense;

      marked[date] = {
        net,
        maxAmount: maxAmount > 0 ? maxAmount.toFixed(0) : undefined,
        maxType,
      };
    });

    return { transactionsByDate: grouped, markedDates: marked };
  }, [transactions]);

  const selectedDateTransactions = selectedDate
    ? transactionsByDate[selectedDate] || []
    : [];

  const selectedDateTotals = useMemo(() => {
    if (!selectedDate) return null;
    let income = 0;
    let expense = 0;
    selectedDateTransactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, net: income - expense };
  }, [selectedDate, selectedDateTransactions]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleAddTransaction = () => {
    navigation.navigate("MainTab", {
      screen: "AddExpense",
      params: { date: selectedDate },
    });
  };

  const renderTransaction = useCallback(
    ({ item, index }: { item: Transaction; index: number }) => {
      const category = categories.find((c) => c.name === item.category);
      return (
        <Animated.View
          layout={LayoutAnimation}
          entering={EnteringAnimation.delay(index * 100)}
          exiting={ExitingAnimation.delay(index * 100)}
        >
          <Card
            style={styles.transactionCard}
            onPress={() =>
              navigation.navigate("TransactionDetail" as any, { id: item.id })
            }
          >
            <View
              style={[
                styles.transactionIcon,
                {
                  backgroundColor: category?.color || theme.colors.muted,
                },
              ]}
            >
              <Icon
                type={(category?.iconFamily as IconType) || "Ionicons"}
                name={(category?.icon as any) || "help"}
                size={20}
                color="white"
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text weight="medium" numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.transactionMeta}>
                <Badge
                  variant="outline"
                  style={styles.categoryBadge} // Extracted style
                >
                  {item.category}
                </Badge>
                <Text variant="caption">{item.time}</Text>
              </View>
            </View>
            <View style={styles.transactionAmount}>
              <Text
                weight="semiBold"
                style={
                  item.type === "income"
                    ? styles.incomeText
                    : styles.expenseText
                }
              >
                {item.type === "income" ? "+" : ""}
                {item.amount.toFixed(2)}
              </Text>
            </View>
          </Card>
        </Animated.View>
      );
    },
    [categories, navigation, theme]
  );

  const renderSectionHeader = useCallback(() => {
    if (!selectedDate || !selectedDateTotals) return null;

    return (
      <Animated.View
        layout={LayoutAnimation}
        style={styles.sectionHeaderContainer}
      >
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
              <Text variant="caption" style={styles.summaryLabel}>
                {t("calendar.income", "Income")}
              </Text>
              <Text weight="semiBold" style={styles.incomeText}>
                ${selectedDateTotals.income.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={styles.summaryLabel}>
                {t("calendar.expenses", "Expenses")}
              </Text>
              <Text weight="semiBold" style={styles.expenseText}>
                ${Math.abs(selectedDateTotals.expense).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={styles.summaryLabel}>
                {t("calendar.net", "Net")}
              </Text>
              <Text
                weight="semiBold"
                style={
                  selectedDateTotals.net >= 0
                    ? styles.incomeText
                    : styles.expenseText
                }
              >
                ${selectedDateTotals.net.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  }, [selectedDate, selectedDateTotals, t, theme]);

  return (
    <ScreenWrapper style={styles.container}>
      {/* Fixed Layout Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text variant="h2" style={styles.headerTitle}>
            {t("calendar.title", "Calendar")}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <SectionList
        sections={[
          {
            title: "Transactions",
            data: selectedDateTransactions,
          },
        ]}
        keyExtractor={(item: any) => item.id}
        renderItem={renderTransaction}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Card style={styles.calendarCard}>
            <Calendar
              current={selectedDate}
              onDayPress={handleDayPress}
              dayComponent={(props) => {
                const { date, state, marking, onPress } = props;
                if (!date) return <View />;
                return (
                  <CustomDay
                    date={date}
                    state={state || ""}
                    marking={markedDates[date.dateString]}
                    onPress={onPress || handleDayPress}
                    theme={theme}
                    isSelected={date.dateString === selectedDate}
                  />
                );
              }}
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
                textDayFontFamily: fonts.regular,
                textMonthFontFamily: fonts.regular,
                textDayHeaderFontFamily: fonts.regular,
              }}
            />
          </Card>
        }
        ListEmptyComponent={
          <Animated.View
            entering={EnteringAnimation}
            exiting={ExitingAnimation}
            style={styles.emptyState}
          >
            <Ionicons
              name="file-tray-outline"
              size={48}
              color={theme.colors.mutedForeground}
            />
            <Text style={styles.emptyText}>
              {t("calendar.noTransactions", "No transactions on this date")}
            </Text>
          </Animated.View>
        }
      />

      {/* Floating Add Button */}
      <Animated.View entering={EnteringAnimation} style={styles.fabContainer}>
        <Button
          title={t("calendar.addTransaction", "Add Transaction")}
          icon={<Ionicons name="add" size={20} color="white" />}
          onPress={handleAddTransaction}
          style={styles.fab}
        />
      </Animated.View>
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
    paddingTop: theme.paddings.xl,
    paddingBottom: theme.paddings.lg,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingBottom: 100,
  },
  calendarCard: {
    margin: theme.margins.md,
    marginTop: theme.margins.md,
    marginBottom: theme.margins.sm,
    padding: theme.paddings.xs,
  },
  sectionHeaderContainer: {
    backgroundColor: theme.colors.background,
  },
  summaryCard: {
    marginHorizontal: theme.margins.md,
    marginTop: theme.margins.sm,
    marginBottom: theme.margins.sm,
    padding: theme.paddings.lg,
    backgroundColor: theme.colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  summaryLabel: {
    marginBottom: 4,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    padding: theme.paddings.md,
    marginHorizontal: theme.margins.md,
    marginBottom: theme.margins.sm,
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
  categoryBadge: {
    paddingVertical: 0,
    paddingHorizontal: 6,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  incomeText: {
    color: theme.colors.success,
  },
  expenseText: {
    color: theme.colors.destructive,
  },
  emptyState: {
    padding: theme.paddings.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.margins.md,
    marginTop: theme.margins.xl,
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    fontSize: theme.fontSize.md,
  },
  customDayContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.margins.xs,
  },
  selectedDayContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 0,
  },
  dayText: {
    fontSize: 14,
    color: theme.colors.foreground,
  },
  disabledDayText: {
    color: theme.colors.mutedForeground,
  },
  selectedDayText: {
    color: theme.colors.primaryForeground,
  },
  todayText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  dayAmountText: {
    fontSize: 9,
    marginTop: 2,
    fontWeight: "600",
  },
  selectedDayAmountText: {
    color: theme.colors.primaryForeground,
  },
  incomeAmountText: {
    color: theme.colors.success,
  },
  expenseAmountText: {
    color: theme.colors.destructive,
  },
  fabContainer: {
    position: "absolute",
    bottom: theme.paddings.xl,
    left: theme.paddings.md,
    right: theme.paddings.md,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
}));
