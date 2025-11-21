import React, { useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

import { useFinanceStore } from '../store';

const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    "Food": "🍔",
    "Transport": "🚗",
    "Bills": "📱",
    "Income": "💰",
    "Shopping": "🛍️",
    "Health": "💊"
  };
  return emojis[category] || "📝";
};

export const TransactionsScreen = () => {



  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const transactions = useFinanceStore((state) => state.transactions);



  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      // Simplified date grouping logic for demo
      const date = transaction.date;
      // In real app, use proper date formatting
      let dateLabel = date;
      if (date === "2024-06-15") dateLabel = "Today";
      else if (date === "2024-06-14") dateLabel = "Yesterday";

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(transaction);
      return groups;
    }, {} as Record<string, typeof transactions>);
  }, []);

  const filteredGroups = Object.entries(groupedTransactions).filter(([_, items]) =>
    items.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <Text variant="h2" style={styles.headerTitle}>Transactions</Text>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button
            title=""
            icon={<Feather name="sliders" size={20} color="white" />}
            variant="ghost"
            onPress={() => { }}
            style={{ paddingHorizontal: 0, width: 32 }}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Summary Card */}
        <Card>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={{ marginBottom: 4 }}>Total</Text>
              <Text weight="600">{transactions.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={{ marginBottom: 4 }}>Income</Text>
              <Text weight="600" style={{ color: theme.colors.success }}>
                ${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={{ marginBottom: 4 }}>Expenses</Text>
              <Text weight="600" style={{ color: theme.colors.accent }}>
                ${Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}
              </Text>
            </View>
          </View>
        </Card>

        {/* Transactions List */}
        <View>
          {filteredGroups.map(([date, dateTransactions]) => (
            <View key={date} style={styles.dateGroup}>
              <Text variant="caption" weight="600" style={styles.dateLabel}>{date}</Text>
              <View style={styles.transactionList}>
                {dateTransactions.map((transaction) => (
                  <Card key={transaction.id} style={styles.transactionCard}>
                    <Text style={styles.transactionEmoji}>
                      {getCategoryEmoji(transaction.category)}
                    </Text>
                    <View style={styles.transactionInfo}>
                      <Text weight="500" numberOfLines={1}>{transaction.name}</Text>
                      <View style={styles.transactionMeta}>
                        <Badge variant="outline" style={{ paddingVertical: 0, paddingHorizontal: 6 }}>
                          {transaction.category}
                        </Badge>
                        <Text variant="caption">{transaction.time}</Text>
                      </View>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text
                        weight="600"
                        style={{
                          color: transaction.type === 'income' ? theme.colors.success : theme.colors.foreground
                        }}
                      >
                        {transaction.type === 'income' ? '+' : ''}{transaction.amount.toFixed(2)}
                      </Text>
                      <Text variant="caption">{transaction.payment}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};


const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    marginBottom: theme.margins.md
  },
  headerTitle: {
    color: 'white'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.paddings.md,
    height: 48
  },
  searchInput: {
    flex: 1,
    color: 'white',
    marginLeft: theme.margins.sm,
    fontSize: theme.fontSize.md
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.paddings.md
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1
  },
  dateGroup: {
    marginBottom: theme.margins.md
  },
  dateLabel: {
    marginBottom: theme.margins.sm,
    paddingHorizontal: theme.paddings.xs
  },
  transactionList: {
    gap: theme.margins.sm
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    padding: theme.paddings.md
  },
  transactionEmoji: {
    fontSize: 24
  },
  transactionInfo: {
    flex: 1
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.xs,
    marginTop: 4
  },
  transactionAmount: {
    alignItems: 'flex-end'
  }
}));
