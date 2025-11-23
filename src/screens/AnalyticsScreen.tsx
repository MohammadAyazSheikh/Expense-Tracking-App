import React, { useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFinanceStore } from '../store';
import { Feather } from '@expo/vector-icons';

const categoryBreakdown = [
  { name: "Food", amount: 420, percentage: 29 },
  { name: "Transport", amount: 230, percentage: 16 },
  { name: "Shopping", amount: 350, percentage: 24 },
  { name: "Bills", amount: 280, percentage: 20 },
  { name: "Entertainment", amount: 150, percentage: 11 },
];

export const AnalyticsScreen = () => {

  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const transactions = useFinanceStore((state) => state.transactions);

  const lineChartData = useMemo(() => {
    // Simplified: Last 6 transactions amounts for demo
    // In real app: Group by date
    const last6 = transactions
      .filter(t => t.type === 'expense')
      .slice(0, 6)
      .map(t => Math.abs(t.amount))
      .reverse();

    return {
      labels: ["1", "2", "3", "4", "5", "6"],
      datasets: [{ data: last6.length > 0 ? last6 : [0, 0, 0, 0, 0, 0] }]
    };
  }, [transactions]);

  const barChartData = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      labels: ["Income", "Expense"],
      datasets: [{ data: [income, expense] }]
    };
  }, [transactions]);



  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Button
              title=""
              icon={<Feather name="arrow-left" size={24} color="white" />}
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 0, width: 40 }}
            />
            <Text variant="h2" style={styles.headerTitle}>Analytics</Text>
          </View>
          <Button
            title="June 2024"
            icon={<Feather name="calendar" size={16} color="white" />}
            variant="secondary"
            size="sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            textStyle={{ color: 'white' }}
            onPress={() => { }}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <Text variant="caption" style={{ marginBottom: 4 }}>Total Spent</Text>
            <Text variant="h2" style={{ color: theme.colors.accent, marginBottom: 4 }}>$1,430</Text>
            <Text variant="caption" style={{ color: theme.colors.success }}>↓ 12% vs last month</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text variant="caption" style={{ marginBottom: 4 }}>Avg. Daily</Text>
            <Text variant="h2" style={{ marginBottom: 4 }}>$47.67</Text>
            <Text variant="caption" style={{ color: theme.colors.warning }}>↑ 5% vs last month</Text>
          </Card>
        </View>

        {/* Spending Trends */}
        <Card>
          <Text variant="h3">Spending Trends</Text>
          <View style={{ alignItems: 'center' }}>
            <LineChart
              data={lineChartData}
              width={Dimensions.get("window").width - 64}
              height={220}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => theme.colors.primary,
                labelColor: (opacity = 1) => theme.colors.mutedForeground,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: theme.colors.primary }
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        </Card>

        {/* Income vs Expenses */}
        <Card>
          <Text variant="h3">Income vs Expenses</Text>
          <View style={{ alignItems: 'center' }}>
            <BarChart
              data={barChartData}
              width={Dimensions.get("window").width - 64}
              height={220}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => theme.colors.secondary,
                labelColor: (opacity = 1) => theme.colors.mutedForeground,
                barPercentage: 0.5
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.success }]} />
              <Text variant="caption">Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.accent }]} />
              <Text variant="caption">Expenses</Text>
            </View>
          </View>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <Text variant="h3" style={{ marginBottom: theme.margins.md }}>Category Breakdown</Text>
          <View>
            {categoryBreakdown.map((category) => (
              <View key={category.name} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text weight="medium">{category.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text weight="semiBold" style={{ marginRight: 8 }}>${category.amount}</Text>
                    <Text variant="caption">{category.percentage}%</Text>
                  </View>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${category.percentage}%` }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>
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
    justifyContent: 'space-between',
    marginBottom: theme.margins.md
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md
  },
  headerTitle: {
    color: 'white'
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: theme.margins.md
  },
  summaryCard: {
    flex: 1,
    padding: theme.paddings.md
  },
  chartContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.md,
    marginTop: theme.margins.md
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.margins.lg,
    marginTop: theme.margins.md
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.xs
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  categoryItem: {
    marginBottom: theme.margins.md
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.margins.xs
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.muted,
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4
  }
}));