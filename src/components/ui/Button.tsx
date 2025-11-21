import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from './Text';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}


export const Button = ({
  title,
  onPress,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle
}: ButtonProps) => {

  const getTextColorStyle = () => {
    switch (variant) {
      case 'outline': return styles.textOutline;
      case 'ghost': return styles.textGhost;
      case 'destructive': return styles.textDestructive;
      case 'secondary': return styles.textSecondary;
      default: return styles.textDefault;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColorStyle().color} />
      ) : (
        <>
          {icon}

          {title && <Text
            variant="label"
            style={[getTextColorStyle(), textStyle]}
            weight="600"
          >
            {title}
          </Text>}
        </>
      )}
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    gap: theme.margins.sm,
  },
  // Variants
  default: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: theme.colors.destructive,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  // Sizes
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
  // Disabled
  disabled: {
    opacity: 0.5,
  },
  // Text Colors
  textDefault: {
    color: theme.colors.primaryForeground,
  },
  textOutline: {
    color: theme.colors.foreground,
  },
  textGhost: {
    color: theme.colors.foreground,
  },
  textDestructive: {
    color: theme.colors.destructiveForeground,
  },
  textSecondary: {
    color: theme.colors.secondaryForeground,
  }
}));