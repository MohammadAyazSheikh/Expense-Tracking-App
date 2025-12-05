import React, { useMemo, useState } from "react";
import { View, TextInput } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Icon, IconType } from "../components/ui/Icon";
import { useTranslation } from "../hooks/useTranslation";
import {
  FilterModal,
  FilterState,
} from "../components/Transactions/FilterModal";

import { useFinanceStore } from "../store";
import { Category, Transaction } from "../types";

type TransactionCardProps = {
  transaction: Transaction;
  category?: Category;
};

const TransactionCard = ({ transaction, category }: TransactionCardProps) => {
  const { theme } = useUnistyles();
  return (
    <Card key={transaction.id} style={styles.transactionCard}>
      <View
        style={[
          styles.transactionIcon,
          { backgroundColor: category?.color || theme.colors.muted },
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
          {transaction.name}
        </Text>
        <View style={styles.transactionMeta}>
          <Badge
            variant="outline"
            style={{ paddingVertical: 0, paddingHorizontal: 6 }}
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
        <Text variant="caption">{transaction.payment}</Text>
      </View>
    </Card>
  );
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
        const matchesSearch = t.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType = filters.type === "all" || t.type === filters.type;
        const category = categories.find((c) => c.name === t.category);
        const matchesCategory =
          filters.categories.length === 0 ||
          (category && filters.categories.includes(category.id));

        return matchesSearch && matchesType && matchesCategory;
      });

      if (filteredItems.length > 0) {
        acc.push([date, filteredItems]);
      }
      return acc;
    },
    [] as [string, typeof transactions][]
  );

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
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("transactions.searchTransactions")}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button
            title=""
            icon={<Feather name="sliders" size={20} color="white" />}
            variant="ghost"
            onPress={() => setIsFilterVisible(true)}
            style={{ paddingHorizontal: 0, width: 32 }}
          />
        </View>
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
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </View>

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={setFilters}
        initialFilters={filters}
      />
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.paddings.md,
    height: 48,
    maxWidth: {
      md: 600,
    },
    alignSelf: {
      md: "center",
    },
    width: "100%",
  },
  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: theme.margins.sm,
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
  transactionEmoji: {
    fontSize: 24,
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
}));
