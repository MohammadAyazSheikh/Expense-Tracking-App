import React from "react";
import {
  View,
  ViewStyle,
  TextStyle,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";
import { Text } from "./Text";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { LayoutAnimation } from "../../utils/animation";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
type ButtonVariants = UnistylesVariants<typeof styles>;

type ButtonProps = ButtonVariants & {
  title?: string;
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
    <AnimatedPressable
      layout={LayoutAnimation}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, style]}
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
    </AnimatedPressable>
  );
};

type DropDownButtonProps = {
  leftIcon?: React.ReactNode;
  label?: string;
  onPress: () => void;
  error?: string;
  selectedValue: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export const DropDownButton = ({
  leftIcon,
  label,
  error,
  onPress,
  selectedValue,
  style,
  labelStyle,
  valueStyle,
  containerStyle,
}: DropDownButtonProps) => {
  const { theme } = useUnistyles();
  return (
    <View style={[containerStyle]}>
      {label && (
        <Text weight="semiBold" style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <Pressable style={[styles.selectorButton, style]} onPress={onPress}>
        {leftIcon}
        <Text style={[valueStyle]}>{selectedValue}</Text>
        <Feather
          name="chevron-down"
          size={20}
          color={theme.colors.mutedForeground}
          style={{ marginLeft: "auto" }}
        />
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
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
          paddingVertical: theme.paddings.xs / 2,
          paddingHorizontal: theme.paddings.md,
        },
        md: {
          // paddingVertical: theme.paddings.xs,
          height: 50,
          paddingHorizontal: theme.paddings.lg,
        },
        lg: {
          // paddingVertical: theme.paddings.sm,
          height: 60,
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

  //dropdown button
  label: {
    marginBottom: theme.margins.sm,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: theme.paddings.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.margins.sm,
  },
  error: {
    marginTop: theme.margins.xs,
    color: theme.colors.destructive,
    fontSize: theme.fontSize.sm,
  },
}));
