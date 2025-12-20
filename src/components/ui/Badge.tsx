import React from "react";
import { View, ViewStyle } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { Text } from "./Text";

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.paddings.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    alignSelf: "flex-start",
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
        },
        outline: {
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: "transparent",
        },
        destructive: {
          backgroundColor: theme.colors.destructive,
        },
        success: {
          backgroundColor: theme.colors.success,
        },
        warning: {
          backgroundColor: theme.colors.warning,
        },
        info: {
          backgroundColor: theme.colors.accent,
        },
      },
    },
  },
  text: {
    fontSize: 10,
    variants: {
      variant: {
        primary: { color: "white" },
        secondary: { color: "white" },
        outline: { color: theme.colors.foreground },
        destructive: { color: "white" },
        success: { color: "white" },
        warning: { color: "white" },
        info: { color: "white" },
      },
    },
  },
}));

type BadgeVariants = UnistylesVariants<typeof styles>;

type BadgeProps = BadgeVariants & {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const Badge = ({ children, variant = "primary", style }: BadgeProps) => {
  styles.useVariants({
    variant,
  });

  return (
    <View style={[styles.container, style]}>
      <Text weight="semiBold" style={styles.text}>
        {children}
      </Text>
    </View>
  );
};
