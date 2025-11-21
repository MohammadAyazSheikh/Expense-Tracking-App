import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

const insights = [
  {
    type: "warning",
    icon: "trending-up",
    title: "Spending Alert",
    description: "You're spending 23% more on food this week compared to last week.",
    suggestion: "Try meal prepping to save approximately $50/week",
    impact: "High Impact",
  },
  {
    type: "success",
    icon: "trending-down",
    title: "Great Progress!",
    description: "Your entertainment expenses are down 15% this month.",
    suggestion: "Keep it up! You're on track to save $80 this month.",
    impact: "Positive",
  },
  {
    type: "info",
    icon: "target",
    title: "Budget Recommendation",
    description: "Based on your income, you could save an additional $200/month.",
    suggestion: "Consider setting up automatic savings of $50/week",
    impact: "Medium Impact",
  },
] as const;

const predictions = [
  { category: "Food", predicted: "$420", trend: "+12%", status: "warning" },
  { category: "Transport", predicted: "$180", trend: "-5%", status: "success" },
  { category: "Shopping", predicted: "$320", trend: "+8%", status: "info" },
  { category: "Bills", predicted: "$280", trend: "0%", status: "neutral" },
] as const;

export const SmartSenseScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const styles = useMemo(() => StyleSheet.create({
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.margins.md,
      marginBottom: theme.margins.md,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.margins.sm,
    },
    headerTitle: {
      color: 'white',
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
    },
    content: {
      padding: theme.paddings.md,
      marginTop: -theme.margins.lg,
      gap: theme.margins.lg,
    },
    sectionTitle: {
      marginBottom: theme.margins.sm,
    },
    insightCard: {
      marginBottom: theme.margins.md,
    },
    insightHeader: {
      flexDirection: 'row',
      gap: theme.margins.md,
    },
    insightIcon: {
      padding: theme.paddings.sm,
      borderRadius: theme.radius.md,
    },
    insightContent: {
      flex: 1,
    },
    insightTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.margins.xs,
    },
    suggestionBox: {
      flexDirection: 'row',
      gap: theme.margins.sm,
      backgroundColor: theme.colors.muted,
      padding: theme.paddings.sm,
      borderRadius: theme.radius.md,
      marginTop: theme.margins.sm,
    },
    predictionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.paddings.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.muted,
    },
    savingsCard: {
      backgroundColor: theme.colors.secondary,
      borderWidth: 0,
    },
    savingsContent: {
      flexDirection: 'row',
      gap: theme.margins.md,
    },
    savingsTextContainer: {
      flex: 1,
    }
  }), [theme]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return theme.colors.warning;
      case 'success': return theme.colors.success;
      case 'info': return theme.colors.accent;
      default: return theme.colors.mutedForeground;
    }
  };

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
          <View style={styles.headerTitleRow}>
            <Feather name="zap" size={24} color="white" />
            <Text variant="h2" style={styles.headerTitle}>SmartSense™</Text>
          </View>
        </View>
        <Text variant="caption" style={styles.headerSubtitle}>
          AI-powered financial insights and personalized recommendations
        </Text>
      </View>

      <View style={styles.content}>
        {/* AI Insights */}
        <View>
          <Text variant="h3" style={styles.sectionTitle}>Smart Insights</Text>
          {insights.map((insight, index) => (
            <Card key={index} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: getStatusColor(insight.type) + '20' }]}>
                  <Feather 
                    name={insight.icon as any} 
                    size={20} 
                    color={getStatusColor(insight.type)} 
                  />
                </View>
                <View style={styles.insightContent}>
                  <View style={styles.insightTitleRow}>
                    <Text weight="600">{insight.title}</Text>
                    <Badge variant={insight.type as any}>
                      {insight.impact}
                    </Badge>
                  </View>
                  <Text variant="caption" style={{ marginBottom: 8 }}>{insight.description}</Text>
                  <View style={styles.suggestionBox}>
                    <Feather name="sun" size={16} color={theme.colors.primary} />
                    <Text variant="caption" style={{ flex: 1 }}>{insight.suggestion}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Predictions */}
        <View>
          <Text variant="h3" style={styles.sectionTitle}>Next Month Predictions</Text>
          <Card>
            {predictions.map((pred, index) => (
              <View key={index} style={[
                styles.predictionRow, 
                index === predictions.length - 1 && { borderBottomWidth: 0 }
              ]}>
                <View>
                  <Text weight="500">{pred.category}</Text>
                  <Text variant="caption">Predicted</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text weight="600">{pred.predicted}</Text>
                  <Text 
                    variant="caption" 
                    style={{ color: getStatusColor(pred.status) }}
                  >
                    {pred.trend}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Savings Goal */}
        <Card style={styles.savingsCard}>
          <View style={styles.savingsContent}>
            <Feather name="target" size={24} color="white" />
            <View style={styles.savingsTextContainer}>
              <Text variant="h3" style={{ color: 'white' }}>Suggested Savings Goal</Text>
              <Text variant="caption" style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 16 }}>
                Based on your spending patterns, you could save $500 in the next 3 months 
                by optimizing your food and entertainment expenses.
              </Text>
              <Button 
                title="Set This Goal" 
                variant="secondary"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', alignSelf: 'flex-start' }}
                textStyle={{ color: 'white' }}
                onPress={() => {}}
              />
            </View>
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
};
