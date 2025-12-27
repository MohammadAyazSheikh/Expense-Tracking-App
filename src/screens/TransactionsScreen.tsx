import React, { useMemo, useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../hooks/useTranslation";
import { SheetManager } from "react-native-actions-sheet";
import { SearchBar } from "../components/ui/searchbar";
import {
  FilterState,
  DateRange,
} from "../components/Transactions/filterSheet/FilterSheet";

import { useFinanceStore } from "../store";
import { TransactionCard } from "../components/Transactions/TransactionCard";
// Helper function to filter by date range
const isWithinDateRange = (
  transactionDate: string,
  dateRange: DateRange,
  customStartDate?: string,
  customEndDate?: string
): boolean => {
  const txDate = new Date(transactionDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (dateRange) {
    case "today":
      return txDate.toDateString() === today.toDateString();

    case "week":
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return txDate >= weekAgo && txDate <= today;

    case "month":
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      return txDate >= monthAgo && txDate <= today;

    case "year":
      const yearAgo = new Date(today);
      yearAgo.setFullYear(today.getFullYear() - 1);
      return txDate >= yearAgo && txDate <= today;

    case "custom":
      if (!customStartDate && !customEndDate) return true;
      const start = customStartDate ? new Date(customStartDate) : new Date(0);
      const end = customEndDate ? new Date(customEndDate) : new Date();
      return txDate >= start && txDate <= end;

    case "all":
    default:
      return true;
  }
};

export const TransactionsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    categories: [],
    dateRange: "all",
    tags: [],
  });

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      const date = transaction.date;
      let dateLabel = date;
      if (date === "2024-06-15") dateLabel = t("transactions.today");
      else if (date === "2024-06-14") dateLabel = t("transactions.yesterday");

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(transaction);
      return groups;
    }, {} as Record<string, typeof transactions>);
  }, [transactions, t]);

  const filteredGroups = Object.entries(groupedTransactions).reduce(
    (acc, [date, items]) => {
      const filteredItems = items.filter((t) => {
        // Search filter
        const matchesSearch = t.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Type filter
        const matchesType = filters.type === "all" || t.type === filters.type;

        // Category filter
        const category = categories.find((c) => c.name === t.category);
        const matchesCategory =
          filters.categories.length === 0 ||
          (category && filters.categories.includes(category.id));

        // Date range filter
        const matchesDateRange = isWithinDateRange(
          t.date,
          filters.dateRange,
          filters.customStartDate,
          filters.customEndDate
        );

        // Tags filter
        const matchesTags =
          filters.tags.length === 0 ||
          (t.tags && t.tags.some((tagId) => filters.tags.includes(tagId)));

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory &&
          matchesDateRange &&
          matchesTags
        );
      });

      if (filteredItems.length > 0) {
        acc.push([date, filteredItems]);
      }
      return acc;
    },
    [] as [string, typeof transactions][]
  );

  // Count active filters
  const activeFiltersCount =
    (filters.type !== "all" ? 1 : 0) +
    filters.categories.length +
    (filters.dateRange !== "all" ? 1 : 0) +
    filters.tags.length;

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Button
            title=""
            icon={<Feather name="arrow-left" size={24} color="white" />}
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
          <Text variant="h2" style={styles.headerTitle}>
            {t("transactions.title")}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Calendar" as any)}
            style={styles.calendarButton}
          >
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <SearchBar
          containerStyle={styles.searchOuterContainer}
          style={styles.searchWrapper}
          inputStyle={styles.searchInput}
          placeholder={t("transactions.searchTransactions")}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={
            <Feather name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
          }
          onPressFilter={async () => {
            const result = await SheetManager.show("filter-sheet", {
              payload: { initialFilters: filters },
            });
            if (result) {
              setFilters(result);
            }
          }}
        />
      </View>

      <View style={styles.content}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={{ marginBottom: 4 }}>
                {t("transactions.all")}
              </Text>
              <Text weight="semiBold">{transactions.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={{ marginBottom: 4 }}>
                {t("transactions.income")}
              </Text>
              <Text weight="semiBold" style={{ color: theme.colors.success }}>
                $
                {transactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={{ marginBottom: 4 }}>
                {t("transactions.expenses")}
              </Text>
              <Text weight="semiBold" style={{ color: theme.colors.accent }}>
                $
                {Math.abs(
                  transactions
                    .filter((t) => t.type === "expense")
                    .reduce((sum, t) => sum + t.amount, 0)
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Transactions List */}
        <View>
          {filteredGroups.map(([date, dateTransactions]) => (
            <View key={date} style={styles.dateGroup}>
              <Text
                variant="caption"
                weight="semiBold"
                style={styles.dateLabel}
              >
                {date}
              </Text>
              <View style={styles.transactionList}>
                {dateTransactions.map((transaction) => {
                  const category = categories.find(
                    (c) => c.name === transaction.category
                  );
                  return (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      category={category}
                      onPress={() =>
                        navigation.navigate("TransactionDetail", {
                          id: transaction.id,
                          category: category!,
                        })
                      }
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
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
    alignItems: "center",
    gap: theme.margins.md,
    marginBottom: theme.margins.md,
  },
  headerTitle: {
    color: "white",
    flex: 1,
  },
  calendarButton: {
    padding: 4,
  },
  searchOuterContainer: {
    maxWidth: {
      md: 600,
    },
    alignSelf: {
      md: "center",
    },
    width: "100%",
    marginBottom: 0,
  },
  searchWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 0,
    height: 48,
    paddingHorizontal: theme.paddings.md,
  },
  searchInput: {
    color: "white",
    fontSize: theme.fontSize.md,
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
  summaryCard: {
    paddingVertical: theme.paddings.md,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.paddings.md,
    gap: {
      xs: theme.margins.sm,
      md: theme.margins.lg,
    },
  },
  summaryItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  dateGroup: {
    marginBottom: theme.margins.md,
  },
  dateLabel: {
    marginBottom: theme.margins.sm,
    paddingHorizontal: theme.paddings.xs,
  },
  transactionList: {
    gap: theme.margins.sm,
  },
}));
