import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { PieChart } from 'react-native-gifted-charts';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Feather } from '@expo/vector-icons';
import { useFinanceStore } from '../store';


export const DashboardScreen = () => {

  const { width } = useWindowDimensions();

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
      value: amount,
      text: name,
      color: colors[index % colors.length]
    }));
  }, [transactions, theme]);

  const renderDot = (color: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View style={styles.legendContainer}>
          {
            chartData.map((item, index) => (
              <View
                key={index}
                style={styles.legendItem}>
                {renderDot(item.color)}
                <Text style={styles.legendLabel}>{item.text}: {item.value}%</Text>
              </View>
            ))
          }
        </View>
      </>
    );
  };

  return (
    <ScreenWrapper style={styles.container} contentContainerStyle={styles.content} scrollable>
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
          style={{ width: 40, height: 40, borderRadius: 20, paddingHorizontal: 0, paddingVertical: 0, padding: 0, gap: 0, justifyContent: "center", alignItems: "center" }}
        />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue} weight="bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statLabelRow}>
              <Feather name="arrow-up-right" size={16} color="white" />
              <Text style={styles.statLabel}>Income</Text>
            </View>
            <Text style={styles.statValue} weight="semiBold">${income.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statLabelRow}>
              <Feather name="arrow-down-right" size={16} color="white" />
              <Text style={styles.statLabel}>Expenses</Text>
            </View>
            <Text style={styles.statValue} weight="semiBold">${expenses.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('MainTab', { screen: 'Analytics' })}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Feather name="trending-up" size={24} color={theme.colors.muted} />
          </View>
          <Text variant="caption" weight="medium">Analytics</Text>
        </Card>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('Wallets')}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.success }]}>
            <Feather name="credit-card" size={24} color={theme.colors.muted} />
          </View>
          <Text variant="caption" weight="medium">Wallets</Text>
        </Card>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('MainTab', { screen: 'Budget' })}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning }]}>
            <Feather name="target" size={24} color={theme.colors.muted} />
          </View>
          <Text variant="caption" weight="medium">Budget</Text>
        </Card>
      </View>


      {/* Spending Overview */}
      <Card style={{ marginBottom: theme.margins.lg }}>
        <View style={styles.sectionTitle}>
          <Text variant="h3">Spending Overview</Text>
          <Button title="See All" variant="ghost" size="sm" onPress={() => navigation.navigate('MainTab', { screen: 'Analytics' })} />
        </View>
        {chartData.length > 0 ? (
          <View style={{ alignItems: 'center', marginTop: theme.margins.md }}>
            <PieChart
              data={chartData}
              donut
              radius={width * 0.3}
              innerRadius={width * 0.2}
              backgroundColor={theme.colors.popover}
              centerLabelComponent={() => (
                <View style={{ alignItems: 'center' }}>
                  <Text variant="caption" style={{ color: theme.colors.mutedForeground }}>Total</Text>
                  <Text variant="h3" weight="bold">${expenses.toFixed(0)}</Text>
                </View>
              )}
              focusOnPress
              sectionAutoFocus
              // labelsPosition="outward"
              // textColor={theme.colors.foreground}
              // textSize={12}
              // showValuesAsLabels
              // showText
              isAnimated
              animationDuration={800}



            />
            {renderLegendComponent()}
          </View>
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
            <Text weight="semiBold" style={{ marginBottom: 4 }}>SmartSense™ Insight</Text>
            <Text variant="caption" style={{ marginBottom: 8 }}>
              You're spending 23% more on food this week. Consider meal prepping to save $50/week.
            </Text>
            <Button
              title="View Full Analysis →"
              variant="ghost"
              size="sm"
              style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }}
              textStyle={{ color: theme.colors.primary }}
              onPress={() => navigation.navigate('SmartSense')}
            />
          </View>
        </View>
      </Card>

      {/* Recent Transactions */}
      <View style={{ marginBottom: 80 }}>
        <View style={styles.sectionTitle}>
          <Text variant="h3">Recent Transactions</Text>
          <Button title="See All" variant="ghost" size="sm" onPress={() => navigation.navigate("Transactions" as any)} />
        </View>
        <View style={styles.transactionList}>
          {recentTransactions.map((tx) => (
            <Card key={tx.id} style={styles.transactionItem}>
              <View>
                <Text weight="medium">{tx.name}</Text>
                <Text variant="caption">{tx.date}</Text>
              </View>
              <Text
                weight="semiBold"
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
  content: {
    paddingHorizontal: theme.paddings.md
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
    fontSize: theme.fontSize.xxxl,
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
  legendLabel: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.md,
  },
  legendContainer: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: "space-around",
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "50%",
    flex: 1,
    paddingHorizontal: theme.paddings.md,
    paddingVertical: theme.paddings.sm,
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