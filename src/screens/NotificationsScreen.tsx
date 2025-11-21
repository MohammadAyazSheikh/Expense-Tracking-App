import React, { } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Switch } from '../components/ui/Switch';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

const notificationCategories = [
  {
    title: "Transaction Alerts",
    icon: "dollar-sign",
    color: "success",
    items: [
      { label: "Large expense alerts", description: "Notify when expense exceeds $100", enabled: true },
      { label: "Daily summary", description: "Daily spending recap at 9 PM", enabled: true },
      { label: "Weekly reports", description: "Weekly financial overview", enabled: false },
    ]
  },
  {
    title: "Budget & Goals",
    icon: "target",
    color: "warning",
    items: [
      { label: "Budget warnings", description: "Alert at 80% of budget limit", enabled: true },
      { label: "Budget exceeded", description: "Notify when over budget", enabled: true },
      { label: "Savings milestones", description: "Celebrate savings achievements", enabled: true },
    ]
  },
  {
    title: "AI Insights",
    icon: "zap", // sparkles -> zap
    color: "primary",
    items: [
      { label: "SmartSense™ tips", description: "Personalized saving suggestions", enabled: true },
      { label: "Spending patterns", description: "Unusual activity detection", enabled: true },
      { label: "Monthly insights", description: "End of month AI analysis", enabled: false },
    ]
  },
  {
    title: "Analytics",
    icon: "trending-up",
    color: "accent",
    items: [
      { label: "Income received", description: "Notify on new income", enabled: true },
      { label: "Bill reminders", description: "Upcoming bill notifications", enabled: true },
    ]
  }
];

export const NotificationsScreen = () => {

  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();



  const getColor = (colorName: string) => {
    return theme.colors[colorName as keyof typeof theme.colors] as string;
  };

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
            <Text variant="h2" style={styles.headerTitle}>Notifications</Text>
          </View>
          <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 0 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>3 New</Text>
          </Badge>
        </View>

        <View style={styles.masterToggleCard}>
          <View style={styles.masterToggleInfo}>
            <Feather name="bell" size={24} color="white" />
            <View>
              <Text weight="600" style={{ color: 'white' }}>Push Notifications</Text>
              <Text variant="caption" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Receive all app notifications</Text>
            </View>
          </View>
          <Switch value={true} onValueChange={() => { }} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Notification Categories */}
        <View style={{ gap: theme.margins.md }}>
          {notificationCategories.map((category) => (
            <Card key={category.title} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <Feather
                    name={category.icon as any}
                    size={20}
                    color={getColor(category.color)}
                  />
                </View>
                <Text variant="h3">{category.title}</Text>
              </View>

              <View>
                {category.items.map((item, index) => (
                  <View key={item.label}>
                    {index > 0 && <View style={styles.separator} />}
                    <View style={styles.notificationItem}>
                      <View style={styles.itemInfo}>
                        <Text weight="500">{item.label}</Text>
                        <Text variant="caption">{item.description}</Text>
                      </View>
                      <Switch value={item.enabled} onValueChange={() => { }} />
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>

        {/* Email Preferences */}
        <Card style={{ marginTop: theme.margins.md }}>
          <Text variant="h3" style={{ marginBottom: theme.margins.md }}>Email Notifications</Text>
          <View>
            <View style={styles.notificationItem}>
              <View style={styles.itemInfo}>
                <Text weight="500">Monthly Reports</Text>
                <Text variant="caption">Detailed financial summary</Text>
              </View>
              <Switch value={true} onValueChange={() => { }} />
            </View>
            <View style={styles.separator} />
            <View style={styles.notificationItem}>
              <View style={styles.itemInfo}>
                <Text weight="500">Product Updates</Text>
                <Text variant="caption">New features and improvements</Text>
              </View>
              <Switch value={false} onValueChange={() => { }} />
            </View>
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
    marginBottom: theme.margins.lg
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md
  },
  headerTitle: {
    color: 'white'
  },
  masterToggleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: theme.paddings.md,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  masterToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md
  },
  categoryCard: {
    padding: theme.paddings.lg
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    marginBottom: theme.margins.md
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.muted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.paddings.sm
  },
  itemInfo: {
    flex: 1,
    marginRight: theme.margins.md
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.margins.xs
  }
}));