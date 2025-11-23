import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

export const SecurityScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

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
          <Text variant="h2" style={styles.headerTitle}>Security</Text>
        </View>

        {/* Security Status */}
        <Card style={styles.securityStatusCard}>
          <View style={styles.securityStatusContent}>
            <View style={styles.securityIconCircle}>
              <Feather name="shield" size={24} color="white" />
            </View>
            <View style={styles.securityStatusText}>
              <Text weight="semiBold" style={styles.securityStatusTitle}>Protected</Text>
              <Text variant="caption" style={styles.securityStatusSubtitle}>
                Your account is secure
              </Text>
            </View>
            <Badge variant="success" style={styles.activeBadge}>Active</Badge>
          </View>
        </Card>
      </View>

      <View style={styles.content}>
        {/* Authentication */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Authentication</Text>
          <View style={styles.authOptions}>
            <View style={styles.authOption}>
              <View style={styles.authOptionLeft}>
                <View style={[styles.authIconCircle, { backgroundColor: `${theme.colors.primary}15` }]}>
                  <Feather name="smartphone" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.authOptionText}>
                  <Text weight="semiBold">Biometric Login</Text>
                  <Text variant="caption">Use fingerprint/Face ID</Text>
                </View>
              </View>
              <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} />
            </View>
            <View style={styles.separator} />
            <View style={styles.authOption}>
              <View style={styles.authOptionLeft}>
                <View style={[styles.authIconCircle, { backgroundColor: `${theme.colors.warning}15` }]}>
                  <Feather name="lock" size={20} color={theme.colors.warning} />
                </View>
                <View style={styles.authOptionText}>
                  <Text weight="semiBold">Two-Factor Authentication</Text>
                  <Text variant="caption">SMS or authenticator app</Text>
                </View>
              </View>
              <View style={styles.authOptionRight}>
                <Badge variant="secondary">Recommended</Badge>
                <Switch value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} />
              </View>
            </View>
          </View>
        </Card>

        {/* Change Password */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Change Password</Text>
          <View style={styles.passwordForm}>
            <Input
              label="Current Password"
              placeholder="Enter current password"
              secureTextEntry
            />
            <Input
              label="New Password"
              placeholder="Enter new password"
              secureTextEntry
            />
            <Input
              label="Confirm New Password"
              placeholder="Re-enter new password"
              secureTextEntry
            />
            <Button
              title="Update Password"
              icon={<Feather name="lock" size={16} color="white" />}
              onPress={() => { }}
              style={styles.updateButton}
            />
          </View>
        </Card>

        {/* Session Management */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Active Sessions</Text>
          <View style={styles.sessions}>
            <View style={[styles.sessionItem, { backgroundColor: theme.colors.muted }]}>
              <View style={styles.sessionInfo}>
                <Text weight="semiBold">iPhone 14 Pro</Text>
                <Text variant="caption">Current device • New York, US</Text>
              </View>
              <Badge variant="success">Active</Badge>
            </View>
            <View style={[styles.sessionItem, { backgroundColor: theme.colors.muted }]}>
              <View style={styles.sessionInfo}>
                <Text weight="semiBold">MacBook Pro</Text>
                <Text variant="caption">2 days ago • New York, US</Text>
              </View>
              <Button
                title="End"
                variant="ghost"
                size="sm"
                onPress={() => { }}
                style={styles.endButton}
              />
            </View>
          </View>
          <Button
            title="Sign Out All Devices"
            variant="outline"
            onPress={() => { }}
            style={styles.signOutAllButton}
          />
        </Card>

        {/* Privacy Settings */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.privacyOptions}>
            <TouchableOpacity style={styles.privacyOption}>
              <View style={styles.privacyOptionLeft}>
                <Feather name="key" size={20} color={theme.colors.mutedForeground} />
                <View style={styles.privacyOptionText}>
                  <Text weight="semiBold">Data & Privacy</Text>
                  <Text variant="caption">Manage your data</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.mutedForeground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.privacyOption}>
              <View style={styles.privacyOptionLeft}>
                <Feather name="shield" size={20} color={theme.colors.mutedForeground} />
                <View style={styles.privacyOptionText}>
                  <Text weight="semiBold">Connected Apps</Text>
                  <Text variant="caption">Review app permissions</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
};


const styles = StyleSheet.create(theme => ({
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
    marginBottom: theme.margins.lg,
  },
  headerTitle: {
    color: 'white',
  },
  securityStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 0,
    padding: theme.paddings.md,
    marginTop: theme.margins.sm,
  },
  securityStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
  },
  securityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${theme.colors.success}33`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  securityStatusText: {
    flex: 1,
  },
  securityStatusTitle: {
    color: 'white',
    fontSize: theme.fontSize.lg,
  },
  securityStatusSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: theme.fontSize.sm,
  },
  activeBadge: {
    backgroundColor: `${theme.colors.success}33`,
    borderWidth: 0,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
  },
  section: {
    padding: theme.paddings.lg,
  },
  sectionTitle: {
    marginBottom: theme.margins.md,
  },
  authOptions: {
    gap: theme.margins.sm,
  },
  authOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.paddings.sm,
  },
  authOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    flex: 1,
  },
  authIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authOptionText: {
    flex: 1,
  },
  authOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.sm,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.margins.xs,
  },
  passwordForm: {
    gap: theme.margins.sm,
  },
  updateButton: {
    marginTop: theme.margins.sm,
  },
  sessions: {
    gap: theme.margins.md,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
  },
  sessionInfo: {
    flex: 1,
  },
  endButton: {
    paddingHorizontal: theme.paddings.md,
  },
  signOutAllButton: {
    marginTop: theme.margins.md,
  },
  privacyOptions: {
    gap: theme.margins.xs,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
  },
  privacyOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    flex: 1,
  },
  privacyOptionText: {
    flex: 1,
  },
}));
