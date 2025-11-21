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

import { useFinanceStore } from '../store';

const recentTransfers = [
  { from: "Chase Checking", to: "Cash", amount: 200, date: "Today" },
  { from: "PayPal", to: "Chase Checking", amount: 150, date: "Yesterday" },
];

export const WalletsScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const wallets = useFinanceStore((state) => state.wallets);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

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
      justifyContent: 'space-between',
      marginBottom: theme.margins.lg,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.margins.md,
    },
    headerTitle: {
      color: 'white',
    },
    balanceCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: theme.paddings.lg,
      borderRadius: theme.radius.lg,
    },
    balanceLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 4,
    },
    balanceValue: {
      color: 'white',
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: theme.margins.md,
    },
    content: {
      padding: theme.paddings.md,
      marginTop: -theme.margins.lg,
      gap: theme.margins.md,
    },
    walletCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.paddings.lg,
    },
    walletInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.margins.md,
    },
    walletIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    transferButton: {
      marginVertical: theme.margins.md,
    },
    transferItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.paddings.md,
    },
    transferInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.margins.md,
    },
    transferIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsGrid: {
      flexDirection: 'row',
      gap: theme.margins.md,
      marginTop: theme.margins.md,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      padding: theme.paddings.md,
    }
  }), [theme]);

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
            <Text variant="h2" style={styles.headerTitle}>Wallets & Accounts</Text>
          </View>
          <Button 
            title="Add" 
            icon={<Feather name="plus" size={16} color="white" />}
            variant="secondary"
            size="sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            textStyle={{ color: 'white' }}
            onPress={() => {}}
          />
        </View>

        <View style={styles.balanceCard}>
          <Text variant="caption" style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${totalBalance.toFixed(2)}</Text>
          <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 0 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>{wallets.length} Accounts</Text>
          </Badge>
        </View>
      </View>

      <View style={styles.content}>
        {/* Wallets List */}
        <View style={{ gap: theme.margins.sm }}>
          {wallets.map((wallet) => (
            <Card key={wallet.id} style={styles.walletCard}>
              <View style={styles.walletInfo}>
                <View style={[styles.walletIcon, { backgroundColor: getColor(wallet.color) + '15' }]}>
                  <Feather 
                    name={wallet.icon as any} 
                    size={24} 
                    color={getColor(wallet.textColor || wallet.color)} 
                  />
                </View>
                <View>
                  <Text weight="600">{wallet.name}</Text>
                  {wallet.accountNumber && (
                    <Text variant="caption">{wallet.accountNumber}</Text>
                  )}
                  <Badge variant="secondary" style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 10, textTransform: 'capitalize' }}>{wallet.type}</Text>
                  </Badge>
                </View>
              </View>
              <Text weight="bold" style={{ fontSize: 18 }}>${wallet.balance.toFixed(2)}</Text>
            </Card>
          ))}
        </View>

        {/* Transfer Button */}
        <Button 
          title="Transfer Between Accounts" 
          icon={<Feather name="refresh-cw" size={20} color="white" />}
          size="lg"
          style={styles.transferButton}
          onPress={() => navigation.navigate('MainTab', { screen: 'AddExpense' })}
        />

        {/* Recent Transfers */}
        <View>
          <Text variant="h3" style={{ marginBottom: theme.margins.sm }}>Recent Transfers</Text>
          <View style={{ gap: theme.margins.sm }}>
            {recentTransfers.map((transfer, index) => (
              <Card key={index} style={styles.transferItem}>
                <View style={styles.transferInfo}>
                  <View style={styles.transferIcon}>
                    <Feather name="refresh-cw" size={16} color={theme.colors.mutedForeground} />
                  </View>
                  <View>
                    <Text weight="500">{transfer.from}</Text>
                    <Text variant="caption">to {transfer.to}</Text>
                    <Text variant="caption">{transfer.date}</Text>
                  </View>
                </View>
                <Text weight="600">${transfer.amount}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Account Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text variant="caption" style={{ marginBottom: 4 }}>This Month</Text>
            <Text weight="bold" style={{ fontSize: 20, color: theme.colors.success, marginBottom: 4 }}>+$1,240</Text>
            <Text variant="caption">Income</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="caption" style={{ marginBottom: 4 }}>This Month</Text>
            <Text weight="bold" style={{ fontSize: 20, color: theme.colors.accent, marginBottom: 4 }}>-$890</Text>
            <Text variant="caption">Expenses</Text>
          </Card>
        </View>
      </View>
    </ScreenWrapper>
  );
};
