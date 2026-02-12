import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Switch } from "../components/ui/Switch";
import { SettingsGroup } from "../components/ui/SettingsGroup";
import { SettingsRow } from "../components/ui/SettingsRow";
import { useAppSettingsStore, useAuthStore } from "../store";
import { SUPPORTED_LANGUAGES } from "../i18n/types";
import { useTranslation } from "../hooks/useTranslation";
import { ApiLoader } from "@/components/ui/ApiLoader";
import { SafeArea } from "@/components/ui/SafeArea";
import { Header } from "@/components/ui/Headers";
import { alertService } from "@/utils/alertService";

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const {
    theme: appTheme,
    changeTheme,
    language,
    changeLanguage,
  } = useAppSettingsStore();
  const { logout, isLoading, user } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const settingsGroups = [
    {
      title: t("settings.account"),
      items: [
        {
          icon: {
            name: "user",
            family: "Feather",
          },
          label: t("settings.profileSettings"),
          badge: null,
          path: "Profile",
        },
        {
          icon: {
            name: "bell",
            family: "Feather",
          },
          label: t("settings.notifications"),
          badge: "3 New",
          path: "NotificationSettings",
        },
        {
          icon: {
            name: "lock",
            family: "Feather",
          },
          label: t("settings.security"),
          badge: null,
          path: "Security",
        },
      ],
    },
    {
      title: t("settings.preferences"),
      items: [
        {
          icon: {
            name: "credit-card",
            family: "Feather",
          },
          label: t("settings.manageAccounts"),
          badge: null,
          path: "Wallets",
        },
        {
          icon: {
            name: "grid",
            family: "Feather",
          },
          label: t("settings.categories"),
          badge: null,
          path: "CategoryManager",
        },
        {
          icon: {
            name: "tag",
            family: "Feather",
          },
          label: t("settings.tags"),
          badge: null,
          path: "TagManager",
        },
        {
          icon: {
            name: "settings",
            family: "Feather",
          },
          label: t("settings.appSettings"),
          badge: null,
          path: "AppSettings",
        },
        {
          icon: {
            name: "file-text",
            family: "Feather",
          },
          label: t("settings.exportData"),
          badge: null,
          path: "Profile",
        },
      ],
    },
    {
      title: t("settings.support"),
      items: [
        {
          icon: {
            name: "help-circle",
            family: "Feather",
          },
          label: t("settings.helpSupport"),
          badge: null,
          path: "HelpSupport",
        },
        {
          icon: { name: "zap", family: "Feather" },
          label: t("settings.smartSenseSettings"),
          badge: "AI",
          path: "SmartSense",
        },
      ],
    },
  ];

  return (
    <SafeArea applyBottomInset style={styles.container} scrollable>
      <Header applySafeAreaPadding title={t("settings.title")}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText} weight="bold">
                {user?.fullName?.slice(0, 2).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} weight="semiBold">
              {user?.fullName}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </Header>
      <View style={styles.content}>
        {/* Quick Toggles */}
        <SettingsGroup cardStyle={{ padding: theme.paddings.lg }}>
          <SettingsRow
            label={t("settings.language")}
            description={t("settings.changeLanguage")}
            icon={{ name: "globe", family: "Feather" }}
            iconColor={theme.colors.primary}
            variant="toggle"
            rightElement={
              <Button
                title={SUPPORTED_LANGUAGES[language].nativeName}
                variant="outline"
                size="sm"
                onPress={() => {
                  changeLanguage(language == "en" ? "ur" : "en");
                }}
              />
            }
          />
          <SettingsRow
            label={t("settings.darkMode")}
            description={t("settings.switchThemes")}
            variant="toggle"
            showSeparator
            rightElement={
              <Switch
                value={appTheme == "dark"}
                onValueChange={() => {
                  changeTheme(appTheme == "dark" ? "light" : "dark");
                }}
              />
            }
          />
          <SettingsRow
            label={t("settings.aiInsights")}
            description={t("settings.personalizedAdvice")}
            variant="toggle"
            showSeparator
            rightElement={<Switch value={true} onValueChange={() => {}} />}
          />
          <SettingsRow
            label={t("settings.pushNotifications")}
            description={t("settings.receiveUpdates")}
            variant="toggle"
            showSeparator
            rightElement={<Switch value={true} onValueChange={() => {}} />}
          />
        </SettingsGroup>

        {/* Settings Groups */}
        <View style={{ gap: theme.margins.lg }}>
          {settingsGroups.map((group) => (
            <SettingsGroup key={group.title} title={group.title}>
              {group.items.map((item, index) => (
                <SettingsRow
                  key={item.label}
                  label={item.label}
                  icon={item.icon as any}
                  onPress={() =>
                    item.path && navigation.navigate(item.path as any)
                  }
                  showSeparator={index > 0}
                  rightElement={
                    item.badge ? (
                      <View style={styles.optionRightNotification}>
                        <Badge
                          variant="secondary"
                          style={{ paddingVertical: 0, paddingHorizontal: 6 }}
                        >
                          {item.badge}
                        </Badge>
                      </View>
                    ) : null
                  }
                />
              ))}
            </SettingsGroup>
          ))}
        </View>

        {/* Logout */}
        <SettingsGroup>
          <SettingsRow
            label={t("settings.logOut")}
            icon={{ name: "log-out", family: "Feather" }}
            isDestructive
            onPress={() => {
              alertService.show({
                title: t("auth.logOut"),
                message: t("auth.logOutMessage"),
                buttons: [
                  { text: t("common.cancel"), style: "cancel" },
                  {
                    text: t("auth.logOut"),
                    style: "destructive",
                    onPress: () => logout(),
                  },
                ],
              });
            }}
            style={styles.logoutRow}
          />
        </SettingsGroup>

        <Text variant="caption" style={styles.version}>
          {t("settings.version")} 1.0.0
        </Text>
      </View>
      <ApiLoader isLoading={isLoading} message="Loading..." />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: theme.paddings.md,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    marginVertical: theme.margins.lg,
    maxWidth: {
      md: 600,
    },
    alignSelf: {
      md: "center",
    },
    width: "100%",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "white",
    fontSize: 18,
  },
  profileEmail: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.xl,
    gap: theme.margins.lg,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  optionRightNotification: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  logoutRow: {
    justifyContent: "center",
  },
  version: {
    textAlign: "center",
    color: theme.colors.mutedForeground,
    marginTop: theme.margins.sm,
  },
}));
