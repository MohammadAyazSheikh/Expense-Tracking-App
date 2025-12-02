import React from "react";
import { View, ViewProps, TouchableOpacity } from "react-native";
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
  };

export const Card = ({
  children,
  variant = "primary",
  onPress,
  style,
  ...props
}: CardProps) => {
  const Component = (
    onPress ? TouchableOpacity : View
  ) as React.ComponentType<any>;

  styles.useVariants({
    variant,
  });

  return (
    <Component onPress={onPress} style={[styles.card, style]} {...props}>
      {children}
    </Component>
  );
};
