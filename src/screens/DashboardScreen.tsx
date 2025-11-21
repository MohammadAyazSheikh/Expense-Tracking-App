import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

import { useFinanceStore } from '../store';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export const DashboardScreen = () => {



  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { transactions, wallets } = useFinanceStore();

  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  }, [wallets]);

  const { income, expenses } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.income += curr.amount;
        } else {
          acc.expenses += Math.abs(curr.amount);
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 3);
  }, [transactions]);

  const chartData = useMemo(() => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.accent,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.destructive,
    ];

    return Object.entries(categoryTotals).map(([name, amount], index) => ({
      name,
      population: amount,
      color: colors[index % colors.length],
      legendFontColor: theme.colors.foreground,
      legendFontSize: 12,
    }));
  }, [transactions, theme]);



  return (
    <ScreenWrapper style={styles.container} scrollable>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="caption">Welcome back</Text>
          <Text variant="h2">Alex Johnson</Text>
        </View>
        <Button
          title=""
          icon={<Feather name="zap" size={20} color={theme.colors.primary} />}
          variant="outline"
          onPress={() => { }}
          style={{ width: 40, height: 40, borderRadius: 20, paddingHorizontal: 0 }}
        />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statLabelRow}>
              <Feather name="arrow-up-right" size={16} color="white" />
              <Text style={styles.statLabel}>Income</Text>
            </View>
            <Text style={styles.statValue}>${income.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statLabelRow}>
              <Feather name="arrow-down-right" size={16} color="white" />
              <Text style={styles.statLabel}>Expenses</Text>
            </View>
            <Text style={styles.statValue}>${expenses.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('MainTab', { screen: 'Analytics' })}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryLight + '20' }]}>
            <Feather name="trending-up" size={24} color={theme.colors.primary} />
          </View>
          <Text variant="caption" weight="500">Analytics</Text>
        </Card>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('MainTab', { screen: 'Wallets' })}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.success + '20' }]}>
            <Feather name="credit-card" size={24} color={theme.colors.success} />
          </View>
          <Text variant="caption" weight="500">Wallets</Text>
        </Card>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('MainTab', { screen: 'Budget' })}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning + '20' }]}>
            <Feather name="target" size={24} color={theme.colors.warning} />
          </View>
          <Text variant="caption" weight="500">Budget</Text>
        </Card>
      </View>


      {/* Spending Overview */}
      <Card style={{ marginBottom: theme.margins.lg }}>
        <View style={styles.sectionTitle}>
          <Text variant="h3">Spending Overview</Text>
          <Button title="See All" variant="ghost" size="sm" onPress={() => navigation.navigate('MainTab', { screen: 'Analytics' })} />
        </View>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 64} // Adjust for padding
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.card,
              backgroundGradientFrom: theme.colors.card,
              backgroundGradientTo: theme.colors.card,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
          />
        ) : (
          <View style={styles.chartPlaceholder}>
            <Feather name="pie-chart" size={48} color={theme.colors.mutedForeground} />
            <Text variant="caption" style={{ marginTop: 8 }}>No expenses yet</Text>
          </View>
        )}
      </Card>

      {/* AI Insights */}
      <Card style={styles.insightCard}>
        <View style={styles.insightContent}>
          <View style={styles.insightIcon}>
            <Feather name="zap" size={20} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="600" style={{ marginBottom: 4 }}>SmartSense™ Insight</Text>
            <Text variant="caption" style={{ marginBottom: 8 }}>
              You're spending 23% more on food this week. Consider meal prepping to save $50/week.
            </Text>
            <Button
              title="View Full Analysis →"
              variant="ghost"
              size="sm"
              style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }}
              textStyle={{ color: theme.colors.primary }}
              onPress={() => navigation.navigate('MainTab', { screen: 'SmartSense' })}
            />
          </View>
        </View>
      </Card>

      {/* Recent Transactions */}
      <View style={{ marginBottom: 80 }}>
        <View style={styles.sectionTitle}>
          <Text variant="h3">Recent Transactions</Text>
          <Button title="See All" variant="ghost" size="sm" onPress={() => navigation.navigate('MainTab', { screen: 'Transactions' })} />
        </View>
        <View style={styles.transactionList}>
          {recentTransactions.map((tx) => (
            <Card key={tx.id} style={styles.transactionItem}>
              <View>
                <Text weight="500">{tx.name}</Text>
                <Text variant="caption">{tx.date}</Text>
              </View>
              <Text
                weight="600"
                style={{ color: tx.type === 'income' ? theme.colors.success : theme.colors.foreground }}
              >
                {tx.type === 'income' ? '+' : ''}{Math.abs(tx.amount).toFixed(2)}
              </Text>
            </Card>
          ))}
        </View>
      </View>

      {/* FAB */}
      {/* Note: FAB should ideally be outside ScrollView or use absolute positioning relative to screen, 
          but inside ScreenWrapper it might scroll if not careful. 
          Here we put it inside ScrollView but with absolute position it might move.
          Better to put it outside ScrollView in a fragment if ScreenWrapper supported it, 
          or just use a fixed View overlay.
      */}
    </ScreenWrapper>
  );
};


const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.margins.lg,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    borderRadius: theme.radius.lg,
    marginBottom: theme.margins.lg,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.margins.xs,
  },
  balanceValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.margins.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.margins.lg,
  },
  statItem: {
    flex: 1,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: theme.fontSize.sm,
  },
  statValue: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.fontSize.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.margins.md,
    marginBottom: theme.margins.lg,
  },
  actionCard: {
    flex: 1,
    padding: theme.paddings.md,
    alignItems: 'center',
    gap: theme.margins.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.margins.md,
  },
  chartPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.md,
  },
  insightCard: {
    marginBottom: theme.margins.lg,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Approximate gradient border
  },
  insightContent: {
    flexDirection: 'row',
    gap: theme.margins.md,
  },
  insightIcon: {
    padding: theme.paddings.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Approximate primary/10
    borderRadius: theme.radius.md,
  },
  transactionList: {
    gap: theme.margins.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.paddings.md,
  },
  fab: {
    position: 'absolute',
    bottom: theme.margins.lg,
    right: theme.margins.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }
}));