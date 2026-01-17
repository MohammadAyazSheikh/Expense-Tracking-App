import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Header } from "../components/ui/Headers";
import { TabView } from "../components/ui/TabView";
import { NotificationCard } from "../components/notifications/NotificationCard";
import { Notification } from "../types";
import { Button } from "../components/ui/Button";
import { Text } from "../components/ui/Text";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "friend_request",
    title: "New Friend Request",
    message: "Sarah Miller wants to connect with you",
    time: "2 min ago",
    iconName: "user-plus",
    color: "primary",
    read: false,
    action: "Friends",
    actionButtons: "accept_decline",
    actionData: { primaryLabel: "Accept", secondaryLabel: "Decline" },
  },
  {
    id: 4,
    type: "group_added",
    title: "Added to Group",
    message: "You were added to 'Weekend Trip' group",
    time: "30 min ago",
    iconName: "users",
    color: "primary",
    read: false,
    action: "Groups",
    actionButtons: "view",
    actionData: { primaryLabel: "View Group" },
  },
  {
    id: 8,
    type: "budget_warning",
    title: "Budget Warning",
    message: "You've used 80% of your Food budget this month",
    time: "1 day ago",
    iconName: "alert-triangle",
    color: "warning",
    read: false,
    action: "Budget",
    actionButtons: "view",
    actionData: { primaryLabel: "View Budget", secondaryLabel: "Adjust Limit" },
  },
  {
    id: 9,
    type: "budget_exceeded",
    title: "Budget Exceeded",
    message: "Entertainment budget exceeded by $45.00",
    time: "2 days ago",
    iconName: "target",
    color: "destructive",
    read: true,
    action: "Budget",
    actionButtons: "view",
    actionData: {
      primaryLabel: "View Budget",
      secondaryLabel: "Increase Limit",
    },
  },
  {
    id: 14,
    type: "income_received",
    title: "Income Received",
    message: "Salary of $3,500.00 credited to your account",
    time: "3 days ago",
    iconName: "dollar-sign",
    color: "success",
    read: true,
    action: "MainTab",
    actionButtons: "view",
    actionData: { primaryLabel: "View Transaction" },
  },
];

export const NotificationsScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    Toast.show({
      type: "success",
      text1: "Marked all as read",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAction = (type: string, notification: Notification) => {
    markAsRead(notification.id);
    if (type === "primary") {
      // Handle navigation based on action
      // Simplified for now
      if (notification.action) {
        // Check if action refers to a tab route or stack route
        if (notification.action === "MainTab") {
          navigation.navigate("MainTab", { screen: "Transactions" }); // Default for MainTab
        } else {
          navigation.navigate(notification.action);
        }
      }
    } else {
      // Secondary action
      if (notification.actionButtons === "accept_decline") {
        deleteNotification(notification.id);
        Toast.show({ type: "info", text1: "Request Declined" });
      } else {
        // Handle other secondary
      }
    }
  };

  const renderList = (data: Notification[]) => (
    <ScrollView contentContainerStyle={styles.listContent}>
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather
            name="bell-off"
            size={48}
            color={theme.colors.mutedForeground}
          />
          <Text
            variant="caption"
            style={{ marginTop: 16, textAlign: "center" }}
          >
            No notifications found
          </Text>
        </View>
      ) : (
        data.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onPress={() => markAsRead(notification.id)}
            onAction={(type) => handleAction(type, notification)}
            onDelete={() => deleteNotification(notification.id)}
          />
        ))
      )}
    </ScrollView>
  );

  const AllTab = () => renderList(notifications);
  const UnreadTab = () => renderList(notifications.filter((n) => !n.read));

  return (
    <ScreenWrapper style={styles.container}>
      <Header
        title="Notifications"
        onBack={() => navigation.goBack()}
        right={
          notifications.length > 0 && (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button
                title="Mark All Read"
                variant="ghost"
                size="sm"
                onPress={markAllAsRead}
                textStyle={{ color: "white", fontSize: 12 }}
                style={{ height: 32, paddingHorizontal: 0 }}
              />
            </View>
          )
        }
      />
      <TabView
        routes={[
          { key: "all", title: "All" },
          {
            key: "unread",
            title: "Unread",
            badge: unreadCount > 0,
            badgeVariant: "destructive",
          },
        ]}
        screens={{
          all: AllTab,
          unread: UnreadTab,
        }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.paddings.md,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
}));
