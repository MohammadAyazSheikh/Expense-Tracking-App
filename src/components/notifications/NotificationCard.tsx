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

  styles.useVariants({ variant: notification.color as any });

  return (
    <Pressable onPress={onPress}>
      <Card
        style={[
          styles.container,
          !notification.read && {
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
          },
        ]}
      >
        <View style={styles.contentRow}>
          <View style={[styles.iconContainer]}>
            <Icon
              type="Feather"
              name={(notification.iconName || "bell") as any}
              size={20}
              color={theme.colors.background}
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
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
        },
        success: {
          backgroundColor: theme.colors.success,
        },
        destructive: {
          backgroundColor: theme.colors.destructive,
        },
        warning: {
          backgroundColor: theme.colors.warning,
        },
        accent: {
          backgroundColor: theme.colors.accent,
        },
        muted: {
          backgroundColor: theme.colors.muted,
        },
      },
    },
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
