import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { Text } from "./Text";

type ButtonVariants = UnistylesVariants<typeof styles>;

type ButtonProps = ButtonVariants & {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle | TextStyle[];
  size?: "sm" | "md" | "lg";
};

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) => {
  styles.useVariants({
    variant,
    size,
    disabled,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.text.color as string} />
      ) : (
        <>
          {icon}

          {title && (
            <Text
              variant="label"
              style={[styles.text, textStyle]}
              weight="semiBold"
            >
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    gap: theme.margins.sm,
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
        },
        outline: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        ghost: {
          backgroundColor: "transparent",
        },
        destructive: {
          backgroundColor: theme.colors.destructive,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
        },
      },
      size: {
        sm: {
          paddingVertical: theme.paddings.sm / 2,
          paddingHorizontal: theme.paddings.md,
        },
        md: {
          paddingVertical: theme.paddings.sm,
          paddingHorizontal: theme.paddings.lg,
        },
        lg: {
          paddingVertical: theme.paddings.md,
          paddingHorizontal: theme.paddings.xl,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  text: {
    variants: {
      variant: {
        primary: {
          color: theme.colors.primaryForeground,
        },
        outline: {
          color: theme.colors.foreground,
        },
        ghost: {
          color: theme.colors.foreground,
        },
        destructive: {
          color: theme.colors.destructiveForeground,
        },
        secondary: {
          color: theme.colors.secondaryForeground,
        },
      },
    },
  },
}));
