import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { SettingsGroup } from "../components/ui/SettingsGroup";
import { SettingsRow } from "../components/ui/SettingsRow";

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
          <Text variant="h2" style={styles.headerTitle}>
            Security
          </Text>
        </View>

        {/* Security Status */}
        <Card style={styles.securityStatusCard}>
          <View style={styles.securityStatusContent}>
            <View style={styles.securityIconCircle}>
              <Feather name="shield" size={24} color="white" />
            </View>
            <View style={styles.securityStatusText}>
              <Text weight="semiBold" style={styles.securityStatusTitle}>
                Protected
              </Text>
              <Text variant="caption" style={styles.securityStatusSubtitle}>
                Your account is secure
              </Text>
            </View>
            <Badge variant="success" style={styles.activeBadge}>
              Active
            </Badge>
          </View>
        </Card>
      </View>

      <View style={styles.content}>
        {/* Authentication */}
        <SettingsGroup
          title="Authentication"
          cardStyle={{ padding: theme.paddings.lg }}
        >
          <SettingsRow
            label="Biometric Login"
            description="Use fingerprint/Face ID"
            icon="smartphone"
            iconColor={theme.colors.primary}
            variant="toggle"
            style={{ paddingHorizontal: 0 }}
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
              />
            }
          />
          <SettingsRow
            label="Two-Factor Authentication"
            description="SMS or authenticator app"
            icon="lock"
            iconColor={theme.colors.warning}
            variant="toggle"
            showSeparator
            style={{ paddingHorizontal: 0 }}
            rightElement={
              <View style={styles.authOptionRight}>
                <Badge variant="secondary">Recommended</Badge>
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                />
              </View>
            }
          />
        </SettingsGroup>

        {/* Change Password */}
        <SettingsGroup
          title="Change Password"
          cardStyle={{ padding: theme.paddings.lg }}
        >
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
              onPress={() => {}}
              style={styles.updateButton}
            />
          </View>
        </SettingsGroup>

        {/* Session Management */}
        <SettingsGroup
          title="Active Sessions"
          cardStyle={{ padding: theme.paddings.lg }}
        >
          <SettingsRow
            label="iPhone 14 Pro"
            description="Current device • New York, US"
            rightElement={<Badge variant="success">Active</Badge>}
            style={styles.sessionRow}
          />
          <SettingsRow
            label="MacBook Pro"
            description="2 days ago • New York, US"
            showSeparator
            rightElement={
              <Button
                title="End"
                variant="ghost"
                size="sm"
                onPress={() => {}}
                style={styles.endButton}
              />
            }
            style={styles.sessionRow}
          />
          <Button
            title="Sign Out All Devices"
            variant="outline"
            onPress={() => {}}
            style={styles.signOutAllButton}
          />
        </SettingsGroup>

        {/* Privacy Settings */}
        <SettingsGroup title="Privacy">
          <SettingsRow
            label="Data & Privacy"
            description="Manage your data"
            icon="key"
            onPress={() => {}}
          />
          <SettingsRow
            label="Connected Apps"
            description="Review app permissions"
            icon="shield"
            showSeparator
            onPress={() => {}}
          />
        </SettingsGroup>
      </View>
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
    marginBottom: theme.margins.lg,
  },
  headerTitle: {
    color: "white",
  },
  securityStatusCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 0,
    padding: theme.paddings.md,
    marginTop: theme.margins.sm,
    maxWidth: {
      md: 600,
    },
    alignSelf: {
      md: "center",
    },
    width: "100%",
  },
  securityStatusContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  securityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${theme.colors.success}33`,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  securityStatusText: {
    flex: 1,
  },
  securityStatusTitle: {
    color: "white",
    fontSize: theme.fontSize.lg,
  },
  securityStatusSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: theme.fontSize.sm,
  },
  activeBadge: {
    backgroundColor: `${theme.colors.success}33`,
    borderWidth: 0,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  authOptionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  passwordForm: {
    gap: theme.margins.sm,
  },
  updateButton: {
    marginTop: theme.margins.sm,
  },
  sessionRow: {
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.md,
    marginBottom: theme.margins.sm,
  },
  endButton: {
    paddingHorizontal: theme.paddings.md,
  },
  signOutAllButton: {
    marginTop: theme.margins.md,
  },
}));
