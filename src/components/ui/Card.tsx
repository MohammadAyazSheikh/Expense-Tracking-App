import React from "react";
import { ViewProps, Pressable } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.paddings.lg,
    variants: {
      variant: {
        primary: {
          ...theme.shadows.xs,
        },
        outlined: {
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
      },
    },
  },
}));

type CardVariants = UnistylesVariants<typeof styles>;

type CardProps = ViewProps &
  CardVariants & {
    onPress?: () => void;
    onLongPress?: () => void;
  };

export const Card = ({
  children,
  variant = "primary",
  onPress,
  onLongPress,
  style,
  ...props
}: CardProps) => {
  styles.useVariants({
    variant,
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.card, style]}
      {...props}
    >
      {children}
    </Pressable>
  );
};
