import React from "react";
import { View, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Notification } from "../../types";

type NotificationCardProps = {
  notification: Notification;
  onPress: () => void;
  onAction: (action: string, notification: Notification) => void;
  onDelete: () => void;
};

export const NotificationCard = ({
  notification,
  onPress,
  onAction,
  onDelete,
}: NotificationCardProps) => {
  const { theme } = useUnistyles();

  const getIconColor = (colorClass: string) => {
    // Map tailwind classes to theme colors
    if (colorClass.includes("primary")) return theme.colors.primary;
    if (colorClass.includes("success")) return theme.colors.success;
    if (colorClass.includes("destructive")) return theme.colors.destructive;
    if (colorClass.includes("warning")) return theme.colors.warning;
    if (colorClass.includes("accent")) return theme.colors.accent;
    return theme.colors.foreground;
  };

  const getBgColor = (bgClass: string) => {
    // Map tailwind bg classes to theme colors with opacity
    if (bgClass.includes("primary")) return theme.colors.primary + "1A"; // 10%
    if (bgClass.includes("success")) return theme.colors.success + "1A";
    if (bgClass.includes("destructive")) return theme.colors.destructive + "1A";
    if (bgClass.includes("warning")) return theme.colors.warning + "1A";
    if (bgClass.includes("accent")) return theme.colors.accent + "1A";
    return theme.colors.muted;
  };

  const iconColor = getIconColor(notification.color);
  const bgColor = getBgColor(notification.bgColor);

  return (
    <Pressable onPress={onPress}>
      <Card
        style={[
          styles.container,
          !notification.read && {
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
            backgroundColor: theme.colors.primary + "05",
          },
        ]}
      >
        <View style={styles.contentRow}>
          <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
            {/* We will need to map lucide icons generic way or pass icon component */}
            {/* For now assuming notification.icon is a valid Feather icon name or similar */}
            {/* Since web uses Lucide components directly, we might need a mapper or change data structure */}
            {/* For this MVP I will use a generic Bell if icon mapping fails, or expect valid names in data */}
            <Icon
              type="Feather"
              name={(notification.iconName || "bell") as any}
              size={20}
              color={iconColor}
            />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text weight="semiBold" style={styles.title} numberOfLines={1}>
                  {notification.title}
                </Text>
                <Text
                  variant="caption"
                  style={{ color: theme.colors.mutedForeground }}
                  numberOfLines={2}
                >
                  {notification.message}
                </Text>

                {/* Actions */}
                {notification.actionButtons && notification.actionData && (
                  <View style={styles.actionsRow}>
                    <Button
                      title={notification.actionData.primaryLabel || "View"}
                      size="sm"
                      onPress={() => onAction("primary", notification)}
                      style={{ height: 32, paddingHorizontal: 12 }}
                      textStyle={{ fontSize: 12 }}
                    />
                    {notification.actionData.secondaryLabel && (
                      <Button
                        title={notification.actionData.secondaryLabel}
                        size="sm"
                        variant="outline"
                        onPress={() => onAction("secondary", notification)}
                        style={{ height: 32, paddingHorizontal: 12 }}
                        textStyle={{ fontSize: 12 }}
                      />
                    )}
                  </View>
                )}
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  type="Feather"
                  name="trash-2"
                  size={16}
                  color={theme.colors.mutedForeground}
                />
              </Pressable>
            </View>
            <Text variant="caption" style={styles.time}>
              {notification.time}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.paddings.md,
    marginBottom: theme.margins.sm,
  },
  contentRow: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.margins.sm,
  },
  title: {
    marginBottom: 2,
  },
  time: {
    marginTop: 4,
    fontSize: 10,
    color: theme.colors.mutedForeground,
  },
  actionsRow: {
    flexDirection: "row",
    gap: theme.margins.sm,
    marginTop: theme.margins.sm,
  },
}));
