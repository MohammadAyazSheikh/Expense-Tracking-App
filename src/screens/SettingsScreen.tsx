import React, { } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
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
import { useAppSettingsStore, useAuthStore } from '../store';
import { SUPPORTED_LOCALES } from '../i18n/types';
import { useTranslation } from '../hooks/useTranslation';




export const SettingsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { theme: appTheme, changeTheme, locale, changeLocale } = useAppSettingsStore();
  const { logout } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const settingsGroups = [
    {
      title: t('settings.account'),
      items: [
        { icon: "user", label: t('settings.profileSettings'), badge: null, path: "Profile" },
        { icon: "bell", label: t('settings.notifications'), badge: "3 New", path: "Notifications" },
        { icon: "lock", label: t('settings.security'), badge: null, path: "Security" },
      ]
    },
    {
      title: t('settings.preferences'),
      items: [
        { icon: "credit-card", label: t('settings.manageAccounts'), badge: null, path: "Wallets" },
        { icon: "file-text", label: t('settings.exportData'), badge: null, path: "Profile" },
      ]
    },
    {
      title: t('settings.support'),
      items: [
        { icon: "help-circle", label: t('settings.helpSupport'), badge: null, path: "HelpSupport" },
        { icon: "zap", label: t('settings.smartSenseSettings'), badge: "AI", path: "SmartSense" },
      ]
    }
  ];



  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.header}>
        <Text variant="h2" style={styles.headerTitle}>{t('settings.title')}</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText} weight="bold">AJ</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} weight="semiBold">Alex Johnson</Text>
            <Text style={styles.profileEmail}>alex.johnson@email.com</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>{t('common.edit')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Toggles */}
        <Card style={styles.togglesCard}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text weight="medium">{t('settings.darkMode')}</Text>
              <Text variant="caption">{t('settings.switchThemes')}</Text>
            </View>
            <Switch value={appTheme == "dark"} onValueChange={() => { changeTheme(appTheme == "dark" ? "light" : "dark") }} />
          </View>
          <View style={styles.separator} />

          <View style={styles.toggleRow}>
            <View style={[styles.toggleInfo, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
              <Feather name="globe" size={20} color={theme.colors.primary} />
              <View>
                <Text weight="medium">{t('settings.language')}</Text>
                <Text variant="caption">{t('settings.changeLanguage')}</Text>
              </View>
            </View>
            <Button
              title={SUPPORTED_LOCALES[locale].nativeName}
              variant="outline"
              size="sm"
              onPress={() => { changeLocale(locale == "en" ? "ur" : "en") }}
            />
          </View>
          <View style={styles.separator} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text weight="medium">{t('settings.aiInsights')}</Text>
              <Text variant="caption">{t('settings.personalizedAdvice')}</Text>
            </View>
            <Switch value={true} onValueChange={() => { }} />
          </View>
          <View style={styles.separator} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text weight="medium">{t('settings.pushNotifications')}</Text>
              <Text variant="caption">{t('settings.receiveUpdates')}</Text>
            </View>
            <Switch value={true} onValueChange={() => { }} />
          </View>
        </Card>

        {/* Settings Groups */}
        <View style={{ gap: theme.margins.lg }}>
          {settingsGroups.map((group) => (
            <View key={group.title}>
              <Text variant="caption" weight="semiBold" style={styles.groupTitle}>
                {group.title.toUpperCase()}
              </Text>
              <Card style={{ padding: 0 }}>
                {group.items.map((item, index) => (
                  <View key={item.label}>
                    {index > 0 && <View style={styles.separator} />}
                    <TouchableOpacity
                      style={styles.settingsItem}
                      onPress={() => item.path && navigation.navigate(item.path as any)}
                    >
                      <Feather name={item.icon as any} size={20} style={styles.itemIcon} />
                      <Text style={styles.itemLabel} weight="medium">{item.label}</Text>
                      {item.badge && (
                        <Badge variant="secondary" style={{ paddingVertical: 0, paddingHorizontal: 6 }}>
                          {item.badge}
                        </Badge>
                      )}
                      <Feather name="chevron-right" size={20} style={styles.itemIcon} />
                    </TouchableOpacity>
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </View>

        {/* Logout */}
        <Card style={{ padding: 0 }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
          >
            <Feather name="log-out" size={20} color={theme.colors.destructive} />
            <Text weight="semiBold" style={{ color: theme.colors.destructive }}>{t('settings.logOut')}</Text>
          </TouchableOpacity>
        </Card>

        <Text variant="caption" style={styles.version}>{t('settings.version')} 1.0.0</Text>
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
    paddingBottom: theme.paddings.xl * 1.5,
  },
  headerTitle: {
    color: 'white',
    marginBottom: theme.margins.lg,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: theme.paddings.md,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    maxWidth: {
      md: 600
    },
    alignSelf: {
      md: 'center'
    },
    width: '100%'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.paddings.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.md,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.xl,
    gap: theme.margins.lg,
    maxWidth: {
      md: 800
    },
    alignSelf: 'center',
    width: '100%'
  },
  togglesCard: {
    padding: theme.paddings.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.paddings.sm,
  },
  toggleInfo: {
    flex: 1,
    marginRight: theme.margins.md,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.margins.xs,
  },
  groupTitle: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.xs,
    marginLeft: theme.margins.xs,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.paddings.md,
    gap: theme.margins.md,
  },
  itemIcon: {
    color: theme.colors.mutedForeground,
  },
  itemLabel: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.margins.sm,
    padding: theme.paddings.md,
  },
  version: {
    textAlign: 'center',
    color: theme.colors.mutedForeground,
    marginTop: theme.margins.sm,
  }
}));
