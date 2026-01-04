import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { Text } from "./Text";

const styles = StyleSheet.create((theme) => ({
  container: {
    borderRadius: theme.radius.full,
    alignSelf: "flex-start",
    variants: {
      dot: {
        true: {
          aspectRatio: 1,
        },
      },
      size: {
        xl: {
          paddingHorizontal: theme.paddings.xl,
          paddingVertical: 6,
        },
        md: {
          paddingHorizontal: theme.paddings.md,
          paddingVertical: 4,
        },
        sm: {
          paddingHorizontal: theme.paddings.sm,
          paddingVertical: 2,
        },
        xs: {
          paddingHorizontal: theme.paddings.xs,
          paddingVertical: 2,
        },
      },
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
    fontSize: theme.fontSize.xxs,
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
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean;
  size?: "xl" | "md" | "sm" | "xs";
};

export const Badge = ({
  children,
  variant = "primary",
  style,
  textStyle,
  dot = false,
  size = "md",
}: BadgeProps) => {
  styles.useVariants({
    variant,
    dot,
    size,
  });

  return (
    <View style={[styles.container, style]}>
      {children ? (
        <Text weight="semiBold" style={[styles.text, textStyle]}>
          {children}
        </Text>
      ) : null}
    </View>
  );
};
