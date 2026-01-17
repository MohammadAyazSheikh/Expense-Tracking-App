import React from "react";
import { View, ViewStyle, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Feather } from "@expo/vector-icons";
import { Text } from "./Text";
import Animated from "react-native-reanimated";
import {
  EnteringAnimation,
  ExitingAnimation,
  LayoutAnimation,
} from "../../utils/Animation";

interface SettingsRowProps {
  label: string;
  description?: string;
  icon?: keyof typeof Feather.glyphMap | React.ReactNode;
  iconColor?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  showSeparator?: boolean;
  variant?: "standard" | "toggle";
  style?: ViewStyle;
}

export const SettingsRow = ({
  label,
  description,
  icon,
  iconColor,
  rightElement,
  onPress,
  showChevron = true,
  isDestructive = false,
  showSeparator = false,
  variant = "standard",
  style,
}: SettingsRowProps) => {
  const { theme } = useUnistyles();

  const content = (
    <View
      style={[
        styles.container,
        variant === "toggle" && styles.toggleContainer,
        style,
      ]}
    >
      {icon && typeof icon === "string" ? (
        <Feather
          name={icon as keyof typeof Feather.glyphMap}
          size={20}
          color={
            isDestructive
              ? theme.colors.destructive
              : iconColor || theme.colors.mutedForeground
          }
          style={styles.icon}
        />
      ) : (
        icon
      )}
      <View style={styles.textContainer}>
        <Text
          weight={variant === "toggle" ? "medium" : "semiBold"}
          style={[
            styles.label,
            isDestructive && { color: theme.colors.destructive },
            variant === "standard" && !icon && { fontSize: theme.fontSize.md },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text variant="caption" style={styles.description}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.rightContainer}>
        {rightElement}
        {onPress && showChevron && (
          <Feather
            name="chevron-right"
            size={20}
            color={theme.colors.mutedForeground}
          />
        )}
      </View>
    </View>
  );

  return (
    <Animated.View
      layout={LayoutAnimation}
      entering={EnteringAnimation}
      exiting={ExitingAnimation}
    >
      {showSeparator && <View style={styles.separator} />}
      {onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content}
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.paddings.md,
    gap: theme.margins.md,
  },
  toggleContainer: {
    paddingVertical: theme.paddings.sm,
    paddingHorizontal: 0,
  },
  icon: {
    width: 20,
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: theme.fontSize.sm,
  },
  description: {
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.margins.xs,
  },
}));
